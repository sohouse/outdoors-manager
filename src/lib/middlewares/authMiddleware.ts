import { auth } from '@/lib/auth.ts';
import { createMiddleware } from 'hono/factory';
import { ApplicationResponse } from '../types/ApplicationResponse';
import { COMMON_ERRORS } from '../types/ErrorType';

export const authMiddleware = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        return c.json(new ApplicationResponse(COMMON_ERRORS.LOGIN_ERROR.code, COMMON_ERRORS.LOGIN_ERROR.message, false), 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
})
