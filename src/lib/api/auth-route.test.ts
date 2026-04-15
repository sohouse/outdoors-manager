import { Hono } from 'hono';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { activityApi } from '@/lib/features/activity/api/activity-api.ts';
import { rolePermissionApi } from '@/lib/features/role-permission/api/role-permission-api.ts';
import { authMiddleware } from '@/lib/middlewares/auth-middleware.ts';
import { ApplicationException } from '@/lib/types/application-exception.ts';
import {
    createErrorApplicationResponse,
    createSuccessApplicationResponse,
} from '@/lib/types/application-response.ts';
import { COMMON_RESPONSE, HTTP_STATUS } from '@/lib/types/error-type.ts';

const { getSessionMock, userRolePermissionMock, findByConditionMock, insertObjMock } = vi.hoisted(() => ({
    getSessionMock: vi.fn(),
    userRolePermissionMock: vi.fn(),
    findByConditionMock: vi.fn(),
    insertObjMock: vi.fn(),
}));

vi.mock('@/lib/auth.ts', () => ({
    auth: {
        api: {
            getSession: getSessionMock,
        },
    },
}));

vi.mock('@/lib/features/role-permission/service/role-permission-service.ts', () => ({
    userRolePermission: userRolePermissionMock,
}));

vi.mock('@/lib/database/dao-register.ts', () => ({
    daoRegistry: {
        activity: () => ({
            findByCondition: findByConditionMock,
            editObj: vi.fn(),
            deleteById: vi.fn(),
            insertObj: insertObjMock,
        }),
    },
}));

const buildApp = () => {
    const app = new Hono();

    app.use('/rolePermission/*', authMiddleware);
    app.use('*', async (c, next) => {
        await next();

        const originalRes = c.res;
        if (originalRes.status >= 200 && originalRes.status < 300) {
            let data: unknown;
            try {
                data = await originalRes.clone().json();
            } catch {
                data = await originalRes.clone().text();
            }
            c.res = c.json(createSuccessApplicationResponse(data));
        }
    });

    app.onError((err, c) => {
        if (err instanceof ApplicationException) {
            return c.json(createErrorApplicationResponse(err.errorType, err.message), err.status);
        }

        return c.json(createErrorApplicationResponse(COMMON_RESPONSE.UNKNOWN_ERROR), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    app.route('/activity', activityApi);
    app.route('/rolePermission', rolePermissionApi);
    return app;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('auth middleware route behavior', () => {
    test('should allow anonymous read for activity detail route', async () => {
        findByConditionMock.mockResolvedValueOnce({
            items: [{
                id: 'activity-1',
                title: 'Weekend Hiking',
                type: 1,
                status: 1,
                start_time: new Date('2026-04-01T09:00:00.000Z'),
                end_time: new Date('2026-04-01T12:00:00.000Z'),
                create_time: new Date('2026-04-01T08:00:00.000Z'),
                author: 'Will',
            }],
            totalCount: 1,
        });

        const res = await buildApp().request('/activity/getObjById?id=activity-1');

        expect(res.status).toBe(200);
    });

    test('should return 401 when anonymous user updates activity', async () => {
        const res = await buildApp().request('/activity/updateObj', {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: 'activity-1', title: 'Updated title' }),
        });
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.UNAUTHORIZED.status);
        expect(body.code).toBe(COMMON_RESPONSE.UNAUTHORIZED.code);
    });

    test('should return 401 when anonymous user creates activity', async () => {
        const res = await buildApp().request('/activity/createObj', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                title: 'New activity',
                type: 1,
                status: 1,
                start_time: '2026-04-20T09:00:00.000Z',
                end_time: '2026-04-20T12:00:00.000Z',
            }),
        });
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.UNAUTHORIZED.status);
        expect(body.code).toBe(COMMON_RESPONSE.UNAUTHORIZED.code);
    });

    test('should return 401 when session is missing for protected role permission route', async () => {
        getSessionMock.mockResolvedValueOnce(null);

        const res = await buildApp().request('/rolePermission/currentUserRolePermission');
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.UNAUTHORIZED.status);
        expect(body.code).toBe(COMMON_RESPONSE.UNAUTHORIZED.code);
    });

    test('should return 404 when resource does not exist', async () => {
        findByConditionMock.mockResolvedValueOnce({
            items: [],
            totalCount: 0,
        });

        const res = await buildApp().request('/activity/getObjById?id=missing-id');
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.NOT_FOUND.status);
        expect(body.code).toBe(COMMON_RESPONSE.NOT_FOUND.code);
    });
});
