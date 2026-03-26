import {ActivityConditions, ActivityItem, CreateActivityInput, UpdateActivityInput} from '@/lib/types/activity.ts';
import { PageResult, PaginateCondition, PaginateMeta } from '@/lib/types/pagination.ts';
import { daoRegistry } from '../types/daoRegister';

export async function deleteById(
  id: string
): Promise<boolean> {
  // const daoFactory = daoRegistry[daoType]();
  const daoFactory = daoRegistry.activity();
  return daoFactory.deleteById(id)
}

export async function findByCondition<ConditionType extends PaginateCondition>(condition: ConditionType): Promise<PageResult<ActivityItem>> {
  // 组装分页条件
  // const daoFactory = daoRegistry[daoType]();
  const daoFactory = daoRegistry.activity();

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

export async function getObjById(id: string): Promise<ActivityItem | null> {
  // const dao = daoRegistry[daoType]();
  const dao = daoRegistry.activity();
  try {

    const { items } = await dao.findByCondition({ id: id } as ActivityConditions);
    const [item] = items;
    return (item as ActivityItem) ?? null;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
}

export async function updateObj(activity: UpdateActivityInput) {
  // const dao = daoRegistry[daoType]();
  const dao = daoRegistry.activity();
  try {
    const success = await dao.editObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
}

export async function createObj(activity: CreateActivityInput) {

  // const dao = daoRegistry[daoType]();
  const dao = daoRegistry.activity();
  try {
    const success = await dao.insertObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}
