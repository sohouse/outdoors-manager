import { auth } from '@/lib/auth.ts';
import { userRolePermission } from '@/lib/features/role-permission/service/role-permission-service.ts';
import { createMiddleware } from 'hono/factory';
import { ApplicationResponse } from '../types/application-response.ts';
import { COMMON_ERRORS } from '../types/error-type.ts';

export const authMiddleware = createMiddleware(async (c, next) => {
    const sessionContext = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!sessionContext) {
        return c.json(new ApplicationResponse(COMMON_ERRORS.LOGIN_ERROR.code, COMMON_ERRORS.LOGIN_ERROR.message, false), 401);
    }
    const user = sessionContext.user;
    const session = sessionContext.session;
    const authz = await userRolePermission(user.id);

    c.set("user", user);
    c.set("session", session);
    c.set("authz", authz);
    c.set("permissions", authz.permissions);

    return next();
})
