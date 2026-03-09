import { daoRegistry } from '@/database/IDao';
import {Hono} from 'hono';

const app = new Hono();
// 具体的业务处理方法
export const activityApi = app.get('/list', async(c) => {
  const daoFactory = daoRegistry['activity']();

  const { items, totalCount } = await daoFactory.findByCondition({});

    return c.json({data: {message: items}})
})