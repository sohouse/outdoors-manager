import { auth } from '@/lib/auth.ts';
import { userRolePermission } from '@/lib/features/role-permission/service/role-permission-service.ts';
import { createMiddleware } from 'hono/factory';
import { COMMON_RESPONSE } from '../types/error-type.ts';
import { ApplicationException } from '../types/application-exception.ts';

export const authMiddleware = createMiddleware(async (c, next) => {
    const sessionContext = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!sessionContext) {
        throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
    }
    const user = sessionContext.user;
    const session = sessionContext.session;
    // role & permission from db
    const authz = await userRolePermission(user.id);

    c.set("authz", authz);
    c.set("auth", {user, session})

    return next();
})
