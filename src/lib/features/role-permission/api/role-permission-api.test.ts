import { Hono } from 'hono';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ApplicationException } from '@/lib/types/application-exception.ts';
import { createErrorApplicationResponse } from '@/lib/types/application-response.ts';
import { COMMON_RESPONSE, HTTP_STATUS } from '@/lib/types/error-type.ts';

const { userRolePermissionMock, invalidateRolePermissionCacheMock } = vi.hoisted(() => ({
    userRolePermissionMock: vi.fn(),
    invalidateRolePermissionCacheMock: vi.fn(),
}));

vi.mock('@/lib/features/role-permission/service/role-permission-service.ts', () => ({
    userRolePermission: userRolePermissionMock,
    invalidateRolePermissionCache: invalidateRolePermissionCacheMock,
}));

const { rolePermissionApi } = await import('./role-permission-api.ts');

const buildApp = (authz?: { userId?: string }) => {
    const app = new Hono();

    if (authz) {
        app.use('/rolePermission/*', async (c, next) => {
            c.set('authz', {
                userId: authz.userId ?? '',
                name: 'Will',
                username: 'will',
                roles: [],
                permissions: [],
            });

            await next();
        });
    }

    app.onError((err, c) => {
        if (err instanceof ApplicationException) {
            return c.json(createErrorApplicationResponse(err.errorType, err.message), err.status);
        }

        return c.json(createErrorApplicationResponse(COMMON_RESPONSE.UNKNOWN_ERROR), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    app.route('/rolePermission', rolePermissionApi);
    return app;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('rolePermissionApi', () => {
    test('currentUserRolePermission should read user id from authz context', async () => {
        const expected = {
            userId: 'user-1',
            name: 'Will',
            username: 'will',
            roles: [],
            permissions: ['activity:read'],
        };
        userRolePermissionMock.mockResolvedValueOnce(expected);

        const res = await buildApp({ userId: 'user-1' }).request('/rolePermission/currentUserRolePermission');

        expect(res.status).toBe(200);
        expect(userRolePermissionMock).toHaveBeenCalledWith('user-1');
        expect(await res.json()).toEqual(expected);
    });

    test('userRolePermission should return bad request when id is missing', async () => {
        const res = await buildApp({ userId: 'user-1' }).request('/rolePermission/userRolePermission');
        const body = await res.json() as { code: number; message: string; success: boolean };

        expect(res.status).toBe(COMMON_RESPONSE.INVALID_PARAMS.status);
        expect(body.code).toBe(COMMON_RESPONSE.INVALID_PARAMS.code);
    });

    test('cache delete should fall back to authz userId and validate type', async () => {
        invalidateRolePermissionCacheMock.mockResolvedValueOnce(2);

        const res = await buildApp({ userId: 'user-1' }).request('/rolePermission/cache?type=permission&name=activity:read', {
            method: 'DELETE',
        });

        expect(res.status).toBe(200);
        expect(invalidateRolePermissionCacheMock).toHaveBeenCalledWith({
            userId: 'user-1',
            type: 'permission',
            name: 'activity:read',
        });
    });

    test('cache delete should return bad request for invalid type', async () => {
        const res = await buildApp({ userId: 'user-1' }).request('/rolePermission/cache?type=invalid', {
            method: 'DELETE',
        });
        const body = await res.json() as { code: number; message: string; success: boolean };

        expect(res.status).toBe(COMMON_RESPONSE.INVALID_PARAMS.status);
        expect(body.code).toBe(COMMON_RESPONSE.INVALID_PARAMS.code);
        expect(body.message).toBe('type must be role or permission');
    });
});
