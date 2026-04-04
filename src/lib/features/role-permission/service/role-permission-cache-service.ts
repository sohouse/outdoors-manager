import { getRedisClient } from "@/lib/cache/redis-client.ts";
import type { UserPermissionRole, UserRolePermission } from "@/lib/features/role-permission/shared/role-permission.ts";

type AuthzCacheType = "role" | "permission";

type CacheProfile = Pick<UserRolePermission, "userId" | "name" | "username">;

const AUTHZ_CACHE_PREFIX = "authz";
const PROFILE_CACHE_TYPE = "profile";
const PROFILE_CACHE_NAME = "summary";
const DEFAULT_AUTHZ_CACHE_TTL_SECONDS = Number(process.env.AUTHZ_CACHE_TTL_SECONDS ?? 300);

// 构建第二层缓存列表key
const buildAuthzIndexKey = (type: AuthzCacheType, userId: string): string =>
    `${AUTHZ_CACHE_PREFIX}:${type}:${userId}`;
// 构建第二层缓存项key
const buildAuthzItemKey = (type: AuthzCacheType, userId: string, name: string): string =>
    `${AUTHZ_CACHE_PREFIX}:${type}:${userId}:${name}`;
// 构建用户基本信息缓存key
const buildProfileKey = (userId: string): string =>
    `${AUTHZ_CACHE_PREFIX}:${PROFILE_CACHE_TYPE}:${userId}:${PROFILE_CACHE_NAME}`;

const deserializeObj = <T>(value: unknown): T | null => {
    if (typeof value !== "string") {
        return null;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
};

const filterStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is string => typeof item === "string");
};

const getCacheTTLSeconds = (): number => {
    if (Number.isNaN(DEFAULT_AUTHZ_CACHE_TTL_SECONDS) || DEFAULT_AUTHZ_CACHE_TTL_SECONDS <= 0) {
        return 300;
    }

    return DEFAULT_AUTHZ_CACHE_TTL_SECONDS;
};

const executeCacheOperation = async <T>(operation: () => Promise<T>, fallback: T): Promise<T> => {
    try {
        return await operation();
    } catch (error) {
        console.warn("[authz-cache] redis operation failed", error);
        return fallback;
    }
};

// 根据用户ID获取角色和权限数据
export const getCachedUserRolePermission = async (userId: string): Promise<UserRolePermission | null> => {
    const redis = getRedisClient();

    if (!redis) {
        return null;
    }

    return executeCacheOperation(async () => {
        const profileRaw = await redis.get<string>(buildProfileKey(userId));

        if (!profileRaw) {
            return null;
        }

        const profile = deserializeObj<CacheProfile>(profileRaw);
        if (!profile) {
            return null;
        }

        const roleNames = filterStringArray(await redis.smembers<string[]>(buildAuthzIndexKey("role", userId)));
        const permissionNames = filterStringArray(
            await redis.smembers<string[]>(buildAuthzIndexKey("permission", userId))
        );

        const roles = roleNames.length > 0
            ? await redis.mget<(string | null)[]>(...roleNames.map((roleName) => buildAuthzItemKey("role", userId, roleName)))
            : [];

        const permissions = permissionNames.length > 0
            ? await redis.mget<(string | null)[]>(
                ...permissionNames.map((permissionName) => buildAuthzItemKey("permission", userId, permissionName))
            )
            : [];

        const parsedRoles = roles
            .map((role) => deserializeObj<UserPermissionRole>(role))
            .filter((role): role is UserPermissionRole => role !== null
        );
        const parsedPermissions = permissions
            .map((permission) => deserializeObj<string>(permission))
            .filter((permission): permission is string => Boolean(permission));

        if (parsedRoles.length !== roleNames.length || parsedPermissions.length !== permissionNames.length) {
            return null;
        }

        return {
            userId: profile.userId,
            name: profile.name,
            username: profile.username,
            roles: parsedRoles,
            permissions: parsedPermissions,
        };
    }, null);
};

export const setCachedUserRolePermission = async (authz: UserRolePermission): Promise<void> => {
    const redis = getRedisClient();

    if (!redis) {
        return;
    }

    await executeCacheOperation(async () => {
        const ttl = getCacheTTLSeconds();
        const roleIndexKey = buildAuthzIndexKey("role", authz.userId);
        const permissionIndexKey = buildAuthzIndexKey("permission", authz.userId);
        const profileKey = buildProfileKey(authz.userId);

        await invalidateUserRolePermissionCache({ userId: authz.userId });

        const pipeline = redis.pipeline();

        pipeline.set(profileKey, JSON.stringify({
            userId: authz.userId,
            name: authz.name,
            username: authz.username,
        }), { ex: ttl });

        if (authz.roles.length > 0) {
            const [firstRole, ...restRoles] = authz.roles.map((role) => role.roleType);
            pipeline.sadd(roleIndexKey, firstRole, ...restRoles);
            pipeline.expire(roleIndexKey, ttl);

            authz.roles.forEach((role) => {
                pipeline.set(
                    buildAuthzItemKey("role", authz.userId, role.roleType),
                    JSON.stringify(role),
                    { ex: ttl }
                );
            });
        }

        if (authz.permissions.length > 0) {
            const [firstPermission, ...restPermissions] = authz.permissions;
            pipeline.sadd(permissionIndexKey, firstPermission, ...restPermissions);
            pipeline.expire(permissionIndexKey, ttl);

            authz.permissions.forEach((permission) => {
                pipeline.set(
                    buildAuthzItemKey("permission", authz.userId, permission),
                    JSON.stringify(permission),
                    { ex: ttl }
                );
            });
        }

        await pipeline.exec();
    }, undefined);
};

export const invalidateUserRolePermissionCache = async ({
    userId,
    type,
    name,
}: {
    userId: string;
    type?: AuthzCacheType;
    name?: string;
}): Promise<number> => {
    const redis = getRedisClient();

    if (!redis) {
        return 0;
    }

    return executeCacheOperation(async () => {
        const pipeline = redis.pipeline();
        let deletedKeys = 0;

        if (type && name) {
            pipeline.del(buildAuthzItemKey(type, userId, name));
            pipeline.srem(buildAuthzIndexKey(type, userId), name);
            deletedKeys += 1;
            await pipeline.exec();
            return deletedKeys;
        }

        const deleteTypeGroup = async (targetType: AuthzCacheType) => {
            const indexKey = buildAuthzIndexKey(targetType, userId);
            const names = filterStringArray(await redis.smembers<string[]>(indexKey));

            names.forEach((entryName) => {
                pipeline.del(buildAuthzItemKey(targetType, userId, entryName));
                deletedKeys += 1;
            });

            pipeline.del(indexKey);
            deletedKeys += 1;
        };

        if (!type || type === "role") {
            await deleteTypeGroup("role");
        }

        if (!type || type === "permission") {
            await deleteTypeGroup("permission");
        }

        if (!type) {
            pipeline.del(buildProfileKey(userId));
            deletedKeys += 1;
        }

        await pipeline.exec();
        return deletedKeys;
    }, 0);
};
