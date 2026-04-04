import { activityApi } from "@/lib/features/activity/api/activity-api.ts";
import { OpenAPIHono } from '@hono/zod-openapi';
import { hc } from 'hono/client';
import { prettyJSON } from 'hono/pretty-json';
import { openapiApp } from "../features/openapi/api/openapi.ts";
import { authMiddleware } from "../middlewares/auth-middleware.ts";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { UNKNOWN_ERROR } from '@/lib/types/error-type.ts'
import { ApplicationResponse } from "@/lib/types/application-response.ts";
import { rolePermissionApi } from "../features/role-permission/api/role-permission-api.ts";

const honoService = new OpenAPIHono().basePath('/api');
// 中间件注册
honoService.use(prettyJSON());
honoService.use('/activity/*', authMiddleware);
honoService.use('/rolePermission/*', authMiddleware);

// 环绕拦截
honoService.use('*', async (c, next) => {
    const startTime = Date.now();
    await next();
    const duration = Date.now() - startTime;

    if (duration > 1000) {
        console.warn(`'慢请求' ${c.req.method} ${c.req.path} ${duration}ms`);
    }
    const originalRes = c.res;
    const status = originalRes.status;

    // 尝试解析响应体
    let data;
    try {
        data = await originalRes.clone().json();
    } catch {
        data = await originalRes.clone().text();
    }

    // 包装成功响应（状态码 200-299）
    if (status >= 200 && status < 300) {
        c.res = c.json(new ApplicationResponse(0, 'success', true, data));
    }

});

// 全局错误处理
honoService.onError((err, c) => {
    console.error(err.stack)
    if (err instanceof ApplicationException) {
        const status = err.code === 2003 ? 401
            : err.code === 2004 ? 403
                : err.code === 1002 ? 400
                    : err.code === 1003 ? 404
                        : 500;

        return c.json(new ApplicationResponse(err.code, err.message, false, err.stack), status);
    } else {
        return c.json(new ApplicationResponse(UNKNOWN_ERROR.code, UNKNOWN_ERROR.message, false, err.stack), 500);
    }
})

// 404请求注册
honoService.notFound((c) => c.json({ message: 'not found', ok: false }, 404));

// 挂载子路由
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = honoService
    .route('/activity', activityApi)
    .route('/openapi', openapiApp)
    .route('/rolePermission', rolePermissionApi);

type Routes = typeof routes;
const honoBaseURL = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

const honoClient = hc<Routes>(honoBaseURL);

export { honoService, honoClient };
