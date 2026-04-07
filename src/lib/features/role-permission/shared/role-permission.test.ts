import { describe, expect, test } from 'vitest';

import {
    canManageOwnedResource,
    isOwner,
    type PermissionUserLike,
} from './role-permission.ts';

const createUser = (overrides?: Partial<PermissionUserLike>): PermissionUserLike => ({
    userId: 'user-1',
    name: 'Will',
    username: 'will',
    ...overrides,
});

describe('isOwner', () => {
    test('should return true when ownerId matches current user id', () => {
        expect(isOwner({ ownerId: 'user-1', user: createUser() })).toBe(true);
    });

    test('should return false when ownerId does not match current user id', () => {
        expect(isOwner({ ownerId: 'other-user', user: createUser() })).toBe(false);
    });

    test('should return false when ownerId is missing', () => {
        expect(isOwner({ ownerId: null, user: createUser() })).toBe(false);
    });

    test('should still return false when name and username are empty because ownership no longer falls back to names', () => {
        expect(
            isOwner({
                ownerId: 'other-user',
                user: createUser({ name: undefined, username: null }),
            })
        ).toBe(false);
    });
});

describe('canManageOwnedResource', () => {
    test('should allow owner with own permission', () => {
        expect(
            canManageOwnedResource({
                permissions: ['activity:update.own'],
                ownPermission: 'activity:update.own',
                anyPermission: 'activity:update.any',
                ownerId: 'user-1',
                user: createUser(),
            })
        ).toBe(true);
    });

    test('should allow any permission regardless of ownership', () => {
        expect(
            canManageOwnedResource({
                permissions: ['activity:update.any'],
                ownPermission: 'activity:update.own',
                anyPermission: 'activity:update.any',
                ownerId: 'other-user',
                user: createUser(),
            })
        ).toBe(true);
    });

    test('should reject non-owner with own permission only', () => {
        expect(
            canManageOwnedResource({
                permissions: ['activity:update.own'],
                ownPermission: 'activity:update.own',
                anyPermission: 'activity:update.any',
                ownerId: 'other-user',
                user: createUser(),
            })
        ).toBe(false);
    });
});
