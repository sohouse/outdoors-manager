import { Hono } from "hono";

import { invalidateRolePermissionCache, userRolePermission } from "@/lib/features/role-permission/service/role-permission-service.ts";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts";

const app = new Hono();

export const rolePermissionApi = app
    .get('/currentUserRolePermission', async (context) => {
        const {userId} = context.get('authz');

        if (!userId) {
            throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
        }

        const result = await userRolePermission(userId);
        return context.json(result);
    })
    .get('/userRolePermission', async (context) => {
        const { id } = context.req.query();

        if (!id) {
            throw new ApplicationException(COMMON_RESPONSE.INVALID_PARAMS);
        }

        const result = await userRolePermission(id);
        return context.json(result);
    })
    .delete('/cache', async (context) => {
        const { id, type, name } = context.req.query();
        const {userId} = context.get('authz');
        const targetUserId = id ?? userId;
        const targetType = type === 'role' || type === 'permission' ? type : undefined;

        if (!targetUserId) {
            throw new ApplicationException(COMMON_RESPONSE.INVALID_PARAMS, 'userId is required');
        }

        if (type && !targetType) {
            throw new ApplicationException(COMMON_RESPONSE.INVALID_PARAMS, 'type must be role or permission');
        }

        const deletedKeys = await invalidateRolePermissionCache({
            userId: targetUserId,
            type: targetType,
            name,
        });

        return context.json({
            userId: targetUserId,
            type: targetType ?? 'all',
            name: name ?? null,
            deletedKeys,
        });
    });
