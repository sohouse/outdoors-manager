import { prismaClient } from "@/lib/database/prisma-client.ts";
import { UserRolePermission } from "@/lib/features/role-permission/shared/role-permission.ts";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { INTERNAL_ERROR, USER_NOT_FOUND } from "@/lib/types/error-type.ts";

const PERMISSIONS = [
    { key: "activity:read", name: "查看活动" },
    { key: "activity:create", name: "创建活动" },
    { key: "activity:update.own", name: "编辑自己的活动" },
    { key: "activity:update.any", name: "编辑任意活动" },
    { key: "activity:delete.own", name: "删除自己的活动" },
    { key: "activity:delete.any", name: "删除任意活动" },
];

export const initPermission = async (): Promise<void> => {
    try {
        await prismaClient.permission.deleteMany();
        await prismaClient.permission.createMany({
            data: PERMISSIONS,
        });
    } catch {
        throw new ApplicationException(INTERNAL_ERROR);
    }
};

export class RolePermissionDao {
    getUserRolePermission = async (id: string): Promise<UserRolePermission> => {
        try {
            const userWithRoles = await prismaClient.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    userRoles: {
                        select: {
                            role: {
                                select: {
                                    type: true,
                                    rolePermissions: {
                                        select: {
                                            permission: {
                                                select: {
                                                    key: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!userWithRoles) {
                throw new ApplicationException(USER_NOT_FOUND);
            }

            const roles = userWithRoles.userRoles.map((userRole) => ({
                roleType: userRole.role.type,
                permissions: userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.key),
            }));

            return {
                userId: userWithRoles.id,
                name: userWithRoles.name,
                username: userWithRoles.username,
                roles,
                permissions: Array.from(new Set(roles.flatMap((role) => role.permissions))),
            };
        } catch (error) {
            if (error instanceof ApplicationException) {
                throw error;
            }

            throw new ApplicationException(INTERNAL_ERROR);
        }
    };
}
