import { pagination } from '@/lib/utils/page-helper.tsx';
import { Activity, ActivityCondition } from '@/lib/types/activity.ts';
import { PageResult, PaginateCondition, PaginateMeta } from '@/lib/types/pagination.ts';
import { daoRegistry } from '@/lib/database/IDao.tsx';

export async function deleteById(
  daoType: string,
  id: string
): Promise<boolean> {
  const daoFactory = daoRegistry[daoType]();
  return daoFactory.deleteById(id)
}

export async function findByCondition<ConditionType extends PaginateCondition>(daoType: string, condition: ConditionType): Promise<PageResult<Activity>> {
  // 组装分页条件
  pagination(condition);
  const daoFactory = daoRegistry[daoType]();

  const { items, totalCount } = await daoFactory.findByCondition(condition);

  const meta: PaginateMeta = {
    totalCount,
    currentCount: items.length,
    pageSize: condition.limit,
    totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
    currentPage: condition.page,
  };

  return {
    meta,
    items: items as Activity[]
  };
}

export async function getObjById(daoType: string, id: string): Promise<Activity | null> {
  const dao = daoRegistry[daoType]();
  try {

    const { items } = await dao.findByCondition({ id: id } as ActivityCondition);
    return (items[0] as Activity) ?? null;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
}

export async function updateObj<Activity>(daoType: string, activity: Activity) {
  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.editObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
}

export async function createObj<Activity>(daoType: string, activity: Activity) {

  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.insertObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}
