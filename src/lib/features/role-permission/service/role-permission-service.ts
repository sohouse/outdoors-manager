import { RolePermissionDao } from "@/lib/features/role-permission/dao/role-permission-dao";
import { UserRolePermission } from "@/lib/features/role-permission/shared/role-permission.ts";
import {
    getCachedUserRolePermission,
    invalidateUserRolePermissionCache,
    setCachedUserRolePermission,
} from "@/lib/features/role-permission/service/role-permission-cache-service.ts";

const rolePermissionDao = new RolePermissionDao();

export const userRolePermission = async (id: string): Promise<UserRolePermission> => {
    const cachedAuthz = await getCachedUserRolePermission(id);

    if (cachedAuthz) {
        return cachedAuthz;
    }
    
    const authz = await rolePermissionDao.getUserRolePermission(id);
    await setCachedUserRolePermission(authz);

    return authz;
};

export const invalidateRolePermissionCache = async ({
    userId,
    type,
    name,
}: {
    userId: string;
    type?: "role" | "permission";
    name?: string;
}): Promise<number> => {
    return invalidateUserRolePermissionCache({ userId, type, name });
};
