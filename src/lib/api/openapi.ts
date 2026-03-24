import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { editActivityCheck } from "@/lib/zod-check/activity-check";


// 创建独立的 OpenAPIHono 实例
const openapiApp = new OpenAPIHono();

const ErrorSchema = z.object({
    error: z.string(),
    message: z.string(),
});

// GET 路由 - query 参数自动验证
const getActivityRoute = createRoute({
    method: 'get',
    path: '/api/activity/getObjById',
    tags: ['Activity'],
    summary: 'Get activity by ID',
    description: 'Retrieve a activity by their ID',
    request: {
        query: z.object({
            id: z.string().min(1, 'ID is required').openapi({
                param: {
                    name: 'id',
                    in: 'query',
                    description: 'UUID by activity'
                },
                example: '0728b236-1e9f-4bdf-8eef-9dc19c27d1df'
            }),
        }),
    },
    responses: {
        200: {
            description: 'Activity found',
            content: { 'application/json': { schema: editActivityCheck } },
        },
        404: {
            description: 'Activity not found',
            content: { 'application/json': { schema: ErrorSchema } },
        },
    },
});

openapiApp.openapi(getActivityRoute, async (c) => {
    const { id } = c.req.valid('query');

    // 业务逻辑
    const activity = { id, title: 'John', error: '', message: 'success' };

    if (!activity) {
        return c.json({ error: 'Not Found', message: 'Activity not found' }, 404);
    }

    return c.json(activity, 200);
});

// 生成 OpenAPI 文档
openapiApp.doc('/json', {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'API with Zod validation',
    },
});

// UI 文档
openapiApp.get('/', async (c) => {
    const swaggerHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.SwaggerUIBundle({ url: '/api/openapi/json', dom_id: '#swagger-ui' })
  </script>
</body>
</html>`;
    return c.html(swaggerHtml);
});

// 导出 routes，供 main.ts 用 app.route() 挂载
export {openapiApp};