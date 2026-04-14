import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ActivityStatus, ActivityTypes, type ActivityItem } from '../shared/activity.ts';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/lib/constants.ts';
import { UserRolePermission } from '../../role-permission/shared/role-permission.ts';
import { ApplicationException } from '@/lib/types/application-exception.ts';
import { COMMON_RESPONSE } from '@/lib/types/error-type.ts';

const { findByConditionMock, editObjMock, deleteByIdMock } = vi.hoisted(() => ({
    findByConditionMock: vi.fn(),
    editObjMock: vi.fn(),
    deleteByIdMock: vi.fn(),
}));

vi.mock('@/lib/database/dao-register.ts', () => ({
    daoRegistry: {
        activity: () => ({
            findByCondition: findByConditionMock,
            editObj: editObjMock,
            deleteById: deleteByIdMock,
        }),
    },
}));

const { deleteById, findByCondition, getObjById, updateObj } = await import('../service/activity-service.ts');

const createUser = (permissions: string[], overrides?: Partial<UserRolePermission>): UserRolePermission => ({
    userId: 'user-1',
    name: 'Will',
    username: 'will',
    roles: [],
    permissions,
    ...overrides,
});

const createActivity = (overrides?: Partial<ActivityItem>): ActivityItem => ({
    id: 'activity-1',
    title: 'Weekend Hiking',
    author: 'Will',
    creator_id: 'user-1',
    ...overrides,
} as ActivityItem);

beforeEach(() => {
    vi.clearAllMocks();
});

test('test activity list service function', async () => {
    const condition = { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT };
    const items = [{ id: 'activity-1' }] as ActivityItem[];

    findByConditionMock.mockResolvedValueOnce({
        items,
        totalCount: 1,
    });

    const result = await findByCondition(condition);

    expect(findByConditionMock).toHaveBeenCalledWith(condition);
    expect(result.items).toEqual(items);
    expect(result.meta).toEqual({
        totalCount: 1,
        limit: DEFAULT_LIMIT,
        totalPage: 1,
        page: DEFAULT_PAGE,
    });
});

describe('activity ownership authorization', () => {
    test('deleteById should throw unauthorized when user is anonymous', async () => {
        await expect(deleteById('activity-1')).rejects.toMatchObject({
            code: COMMON_RESPONSE.UNAUTHORIZED.code,
            status: COMMON_RESPONSE.UNAUTHORIZED.status,
        } satisfies Partial<ApplicationException>);
    });

    test('deleteById should allow owner with own permission', async () => {
        const currentUser = createUser(['activity:read', 'activity:delete.own']);
        const activity = createActivity();

        findByConditionMock.mockResolvedValueOnce({ items: [activity], totalCount: 1 });
        deleteByIdMock.mockResolvedValueOnce(true);

        const result = await deleteById(activity.id, currentUser);

        expect(result).toBe(true);
        expect(deleteByIdMock).toHaveBeenCalledWith(activity.id);
    });

    test('deleteById should allow non-owner with any permission', async () => {
        const currentUser = createUser(['activity:read', 'activity:delete.any'], { userId: 'admin-1' });
        const activity = createActivity({ creator_id: 'owner-1' });

        findByConditionMock.mockResolvedValueOnce({ items: [activity], totalCount: 1 });
        deleteByIdMock.mockResolvedValueOnce(true);

        const result = await deleteById(activity.id, currentUser);

        expect(result).toBe(true);
        expect(deleteByIdMock).toHaveBeenCalledWith(activity.id);
    });

    test('deleteById should throw forbidden for non-owner with own permission only', async () => {
        const currentUser = createUser(['activity:read', 'activity:delete.own'], { userId: 'user-2' });
        const activity = createActivity({ creator_id: 'owner-1' });

        findByConditionMock.mockResolvedValueOnce({ items: [activity], totalCount: 1 });

        await expect(deleteById(activity.id, currentUser)).rejects.toMatchObject({
            code: COMMON_RESPONSE.FORBIDDEN.code,
            status: COMMON_RESPONSE.FORBIDDEN.status,
        } satisfies Partial<ApplicationException>);
    });

    test('updateObj should preserve author for owner scoped update', async () => {
        const currentUser = createUser(['activity:read', 'activity:update.own']);
        const currentActivity = createActivity({ author: 'Original Author' });
        const payload = {
            id: currentActivity.id,
            title: 'Updated Title',
            author: 'Tampered Author',
            type: ActivityTypes.徒步,
            status: ActivityStatus.报名中,
        };

        findByConditionMock.mockResolvedValueOnce({ items: [currentActivity], totalCount: 1 });
        editObjMock.mockResolvedValueOnce(true);

        const result = await updateObj(payload, currentUser);

        expect(editObjMock).toHaveBeenCalledWith({
            ...payload,
            author: 'Original Author',
        });
        expect(result).toEqual({
            success: true,
            data: {
                ...payload,
                author: 'Original Author',
            },
        });
    });

    test('updateObj should allow author change for any scoped update', async () => {
        const currentUser = createUser(['activity:read', 'activity:update.any'], { userId: 'admin-1' });
        const currentActivity = createActivity({ creator_id: 'owner-1', author: 'Original Author' });
        const payload = {
            id: currentActivity.id,
            title: 'Updated Title',
            author: 'Changed By Admin',
            type: ActivityTypes.徒步,
            status: ActivityStatus.报名中,
        };

        findByConditionMock.mockResolvedValueOnce({ items: [currentActivity], totalCount: 1 });
        editObjMock.mockResolvedValueOnce(true);

        const result = await updateObj(payload, currentUser);

        expect(editObjMock).toHaveBeenCalledWith(payload);
        expect(result).toEqual({
            success: true,
            data: payload,
        });
    });

    test('updateObj should throw unauthorized when user is anonymous', async () => {
        await expect(
            updateObj({
                id: 'activity-1',
                title: 'Updated Title',
                type: ActivityTypes.徒步,
                status: ActivityStatus.报名中,
            })
        ).rejects.toMatchObject({
            code: COMMON_RESPONSE.UNAUTHORIZED.code,
            status: COMMON_RESPONSE.UNAUTHORIZED.status,
        } satisfies Partial<ApplicationException>);
    });
});

test('getObjById should throw not found when activity does not exist', async () => {
    const currentUser = createUser(['activity:read']);

    findByConditionMock.mockResolvedValueOnce({ items: [], totalCount: 0 });

    await expect(getObjById('missing-id', currentUser)).rejects.toMatchObject({
        code: COMMON_RESPONSE.NOT_FOUND.code,
        status: COMMON_RESPONSE.NOT_FOUND.status,
    } satisfies Partial<ApplicationException>);
});
