export interface UserPermissionRole {
    roleType: string;
    permissions: string[];
}

export interface UserRolePermission {
    userId: string;
    name?: string;
    username?: string | null;
    roles: UserPermissionRole[];
    permissions: string[];
}

export interface PermissionUserLike {
    userId: string;
    name?: string;
    username?: string | null;
}

export const hasPermission = (permissions: string[], permission: string): boolean => {
    return permissions.includes(permission);
};

export const hasAnyPermission = (permissions: string[], requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) => hasPermission(permissions, permission));
};

// check resource owner
export const isOwner = ({
    ownerId,
    user,
}: {
    ownerId?: string | null;
    user: PermissionUserLike;
}): boolean => {
    return Boolean(ownerId && ownerId === user.userId);
};

// check resource role, different with isOwner, include anyPermission check
export const canManageOwnedResource = ({
    permissions,
    ownPermission,
    anyPermission,
    ownerId,
    user,
}: {
    permissions: string[];
    ownPermission: string;
    anyPermission: string;
    ownerId?: string | null;
    user: PermissionUserLike;
}): boolean => {
    if (hasPermission(permissions, anyPermission)) {
        return true;
    }

    return hasPermission(permissions, ownPermission) && isOwner({ ownerId, user });
};