import { expect, test, vi } from 'vitest';

import type { ActivityItem } from '../shared/activity.ts';
import type { ActivityPermissionContext } from '../service/activity-service.ts';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/lib/constants.ts';

const { findByConditionMock } = vi.hoisted(() => ({
    findByConditionMock: vi.fn(),
}));

vi.mock('@/lib/database/dao-register.ts', () => ({
    daoRegistry: {
        activity: () => ({
            findByCondition: findByConditionMock,
        }),
    },
}));

const { findByCondition } = await import('../service/activity-service.ts');

test('test activity list service function', async () => {
    const condition = { page: DEFAULT_PAGE, limit: DEFAULT_LIMIT };
    const currentUser = { permissions: ['activity:read'] } as ActivityPermissionContext;
    const items = [{ id: 'activity-1' }] as ActivityItem[];

    findByConditionMock.mockResolvedValueOnce({
        items,
        totalCount: 1,
    });

    const result = await findByCondition(condition, currentUser);

    expect(findByConditionMock).toHaveBeenCalledWith(condition);
    expect(result.items).toEqual(items);
    expect(result.meta).toEqual({
        totalCount: 1,
        limit: DEFAULT_LIMIT,
        totalPage: 1,
        page: DEFAULT_PAGE,
    });
});
