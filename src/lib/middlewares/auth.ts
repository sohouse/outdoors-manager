import { createMiddleware } from 'hono/factory'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.redirect('/')
        return c.json({ error: "未登录" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
})