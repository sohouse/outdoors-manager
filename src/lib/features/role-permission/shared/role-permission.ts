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
    id: string;
    name?: string;
    username?: string | null;
}

export const hasPermission = (permissions: string[], permission: string): boolean => {
    return permissions.includes(permission);
};

export const hasAnyPermission = (permissions: string[], requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) => hasPermission(permissions, permission));
};

export const isOwner = ({
    ownerId,
    ownerName,
    user,
}: {
    ownerId?: string | null;
    ownerName?: string | null;
    user: PermissionUserLike;
}): boolean => {
    if (ownerId && ownerId === user.id) {
        return true;
    }

    return Boolean(ownerName && [user.name, user.username].filter(Boolean).includes(ownerName));
};

export const canManageOwnedResource = ({
    permissions,
    ownPermission,
    anyPermission,
    ownerId,
    ownerName,
    user,
}: {
    permissions: string[];
    ownPermission: string;
    anyPermission: string;
    ownerId?: string | null;
    ownerName?: string | null;
    user: PermissionUserLike;
}): boolean => {
    if (hasPermission(permissions, anyPermission)) {
        return true;
    }

    return hasPermission(permissions, ownPermission) && isOwner({ ownerId, ownerName, user });
};
