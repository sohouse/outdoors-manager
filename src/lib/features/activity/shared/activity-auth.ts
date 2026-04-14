import { canManageOwnedResource, UserRolePermission } from "../../role-permission/shared/role-permission"
import { ActivityVO } from "./activity"

export const canDeleteActivity = (activity: ActivityVO, authz: UserRolePermission | null) => {
    if (!authz) {
        return false;
    }

    return canManageOwnedResource({
        permissions: authz.permissions,
        ownPermission: 'activity:delete.own',
        anyPermission: 'activity:delete.any',
        ownerId: activity.creator_id,
        user: {
            userId: authz.userId,
            name: authz.name,
            username: authz.username,
        },
    });
}

export const canEditActivity = (authz: UserRolePermission | null, activity: ActivityVO) => {
    if (!authz) {
        return false;
    }

    const canEdit = canManageOwnedResource({
        permissions: authz.permissions,
        ownPermission: 'activity:update.own',
        anyPermission: 'activity:update.any',
        ownerId: activity.creator_id,
        user: {
            userId: authz.userId,
            name: authz.name,
            username: authz.username,
        },
    });
    return canEdit;
}
