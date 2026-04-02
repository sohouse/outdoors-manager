import { Hono } from "hono";

import { userRolePermission } from "@/lib/features/role-permission/service/role-permission-service.ts";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_ERRORS } from "@/lib/types/error-type.ts";

const app = new Hono();

export const rolePermissionApi = app
    .get('/currentUserRolePermission', async (context) => {
        const user = context.get('user') as { id?: string } | undefined;

        if (!user?.id) {
            throw new ApplicationException(COMMON_ERRORS.UNAUTHORIZED);
        }

        const result = await userRolePermission(user.id);
        return context.json(result, 200);
    })
    .get('/userRolePermission', async (context) => {
        const { id } = context.req.query();

        if (!id) {
            throw new ApplicationException(COMMON_ERRORS.INVALID_PARAMS);
        }

        const result = await userRolePermission(id);
        return context.json(result, 200);
    });
