import { daoRegistry } from "@/database/IDao";
import { Activity } from "@/types/activity";
import { simpleObjCover } from "@/utils/ObjectHelper";
import { PaginateMeta } from "@/types/pagination";
import { pagination } from "@/utils/pageHelper";
import { Hono } from "hono";

const app = new Hono();
export const activityApi = app
  .get('/findByCondition', async (context) => {
    try {
      const query = context.req.query();
      const queryCondition = {} as Activity;
      const condition = simpleObjCover(query, queryCondition as unknown as Record<string, unknown>);

      pagination(condition);
      const daoFactory = daoRegistry['activity']();
      const { items, totalCount } = await daoFactory.findByCondition(condition);

      const meta: PaginateMeta = {
        totalCount,
        currentCount: items.length,
        pageSize: condition.limit,
        totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
        currentPage: condition.page,
      };

      const vitifyResult = context.json({
        meta,
        items: items as Activity[]
      }, 200);;
      return vitifyResult;
    } catch (error) {
      console.error(error);
      // return c.json(createErrorResult('查询文章分页数据失败', error), 500);
    }
  })
  .get('/getObjById', async (context) => {
      try {
          const query = context.req.query();
          const limit = query.limit ? Number(query.limit) : undefined;
          const result = await queryPostTotalPages(limit);
          return context.json({ result }, 200);
      } catch (error) {
          return context.json(createErrorResult('查询页面总数失败', error), 500);
      }
  })
  // .get('/:item', async (c) => {
  //     try {
  //         const { item } = c.req.param();
  //         const result = await queryPostItem(item);
  //         if (!isNil(result)) return c.json(result, 200);
  //         return c.json(createErrorResult('文章不存在'), 404);
  //     } catch (error) {
  //         return c.json(createErrorResult('查询文章失败', error), 500);
  //     }
  // })
  // .get('/byid/:id', async (c) => {
  //     try {
  //         const { id } = c.req.param();
  //         const result = await queryPostItemById(id);
  //         if (!isNil(result)) return c.json(result, 200);
  //         return c.json(createErrorResult('文章不存在'), 404);
  //     } catch (error) {
  //         return c.json(createErrorResult('查询文章失败', error), 500);
  //     }
  // })
  // .get('/byslug/:slug', async (c) => {
  //     try {
  //         const { slug } = c.req.param();
  //         const result = await queryPostItemBySlug(slug);
  //         return c.json(result, 200);
  //     } catch (error) {
  //         return c.json(createErrorResult('查询文章失败', error), 500);
  //     }
  // })
  // .post('/', async (c) => {
  //     try {
  //         const body = await c.req.json();
  //         const result = await createPostItem(body);
  //         return c.json(result, 201);
  //     } catch (error) {
  //         return c.json(createErrorResult('创建文章失败', error), 500);
  //     }
  // })
  // .patch(
  //     '/:id',
  //     async (c) => {
  //         try {
  //             const { id } = c.req.param();
  //             const body = await c.req.json();
  //             const result = await updatePostItem(id, body);
  //             return c.json(result, 200);
  //         } catch (error) {
  //             return c.json(createErrorResult('更新文章失败', error), 500);
  //         }
  //     },
  // )
  // .delete('/:id', async (c) => {
  //     try {
  //         const { id } = c.req.param();
  //         const result = await deletePostItem(id);
  //         return c.json(result, 200);
  //     } catch (error) {
  //         return c.json(createErrorResult('删除文章失败', error), 500);
  //     }
  // })
  ;