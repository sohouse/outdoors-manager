import { Hono } from 'hono';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { activityApi } from '@/lib/features/activity/api/activity-api.ts';
import { authMiddleware } from '@/lib/middlewares/auth-middleware.ts';
import { ApplicationException } from '@/lib/types/application-exception.ts';
import {
    createErrorApplicationResponse,
    createSuccessApplicationResponse,
} from '@/lib/types/application-response.ts';
import { COMMON_RESPONSE, HTTP_STATUS } from '@/lib/types/error-type.ts';

const { getSessionMock, userRolePermissionMock, findByConditionMock } = vi.hoisted(() => ({
    getSessionMock: vi.fn(),
    userRolePermissionMock: vi.fn(),
    findByConditionMock: vi.fn(),
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
        }),
    },
}));

const buildApp = () => {
    const app = new Hono();

    app.use('/activity/*', authMiddleware);
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
    return app;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('auth middleware route behavior', () => {
    test('should return 401 when session is missing', async () => {
        getSessionMock.mockResolvedValueOnce(null);

        const res = await buildApp().request('/activity/getObjById?id=activity-1');
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.UNAUTHORIZED.status);
        expect(body.code).toBe(COMMON_RESPONSE.UNAUTHORIZED.code);
    });

    test('should return 403 when user lacks read permission', async () => {
        getSessionMock.mockResolvedValueOnce({
            user: { id: 'user-1', name: 'Will', username: 'will' },
            session: { id: 'session-1', userId: 'user-1' },
        });
        userRolePermissionMock.mockResolvedValueOnce({
            userId: 'user-1',
            name: 'Will',
            username: 'will',
            roles: [],
            permissions: [],
        });

        const res = await buildApp().request('/activity/getObjById?id=activity-1');
        const body = await res.json() as { code: number };

        expect(res.status).toBe(COMMON_RESPONSE.FORBIDDEN.status);
        expect(body.code).toBe(COMMON_RESPONSE.FORBIDDEN.code);
    });

    test('should return 404 when resource does not exist', async () => {
        getSessionMock.mockResolvedValueOnce({
            user: { id: 'user-1', name: 'Will', username: 'will' },
            session: { id: 'session-1', userId: 'user-1' },
        });
        userRolePermissionMock.mockResolvedValueOnce({
            userId: 'user-1',
            name: 'Will',
            username: 'will',
            roles: [],
            permissions: ['activity:read'],
        });
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
