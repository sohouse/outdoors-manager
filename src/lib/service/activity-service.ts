import {ActivityConditions, ActivityItem, CreateActivityInput, UpdateActivityInput} from '@/lib/types/activity.ts';
import { PageResult, PaginateCondition, PaginateMeta } from '@/lib/types/pagination.ts';
import { daoRegistry } from '@/lib/database/IDao.tsx';

export async function deleteById(
  daoType: string,
  id: string
): Promise<boolean> {
  const daoFactory = daoRegistry[daoType]();
  return daoFactory.deleteById(id)
}

export async function findByCondition<ConditionType extends PaginateCondition>(daoType: string, condition: ConditionType): Promise<PageResult<ActivityItem>> {
  // 组装分页条件
  const daoFactory = daoRegistry[daoType]();

  const { items, totalCount } = await daoFactory.findByCondition(condition);

  const meta: PaginateMeta = {
    totalCount,
    limit: condition.limit,
    totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
    page: condition.page,
  };

  return {
    meta,
    items: items as ActivityItem[]
  };
}

export async function getObjById(daoType: string, id: string): Promise<ActivityItem | null> {
  const dao = daoRegistry[daoType]();
  try {

    const { items } = await dao.findByCondition({ id: id } as ActivityConditions);
    const [item] = items;
    return (item as ActivityItem) ?? null;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
}

export async function updateObj(daoType: string, activity: UpdateActivityInput) {
  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.editObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
}

export async function createObj(daoType: string, activity: CreateActivityInput) {

  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.insertObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}
