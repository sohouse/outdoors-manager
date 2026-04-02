import { RolePermissionDao } from "@/lib/features/role-permission/dao/role-permission-dao.ts";
import { UserRolePermission } from "@/lib/features/role-permission/shared/role-permission.ts";

const rolePermissionDao = new RolePermissionDao();

export const userRolePermission = async (id: string): Promise<UserRolePermission> => {
    return rolePermissionDao.getUserRolePermission(id);
};
