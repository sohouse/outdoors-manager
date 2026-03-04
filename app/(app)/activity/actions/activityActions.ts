'use server'

import { ActivityDao } from '@/database/activityDao';
import { pagination } from '@/utils/pageHelper';
import { Activity, ActivityCondition } from '@/types/activity';
import { PageResult, PaginateCondition, PaginateMeta } from '@/types/pagination';
import { BaseDao } from '@/database/IDao';

type DaoFactory = () => BaseDao<unknown, PaginateCondition>;
const daoRegistry: Record<string, DaoFactory> = {
  activity: () => new ActivityDao(),
}

export async function deleteById(
  daoType: string,
  id: string
): Promise<boolean> {
  const daoFactory = daoRegistry[daoType]();
  return daoFactory.deleteById(id)
}

export async function findByCondition<T, ConditionType extends PaginateCondition>(daoType: string, condition: ConditionType): Promise<PageResult<T>> {
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
    items: items as T[]
  };
}

export async function getObjById(daoType: string, id: string): Promise<Activity> {
  const dao = daoRegistry[daoType]();
  try {

    const { items } = await dao.findByCondition<Activity>({ id: id } as ActivityCondition);
    return items[0] ?? null;
  } catch (error) {
    console.error('Error fetching activity:', error);
    throw error;
  }
}

export async function updateObj<T>(daoType: string, activity: T) {
  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.editObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error updating activity:', error);
    throw error;
  }
}

export async function createObj<T>(daoType: string, activity: T) {

  const dao = daoRegistry[daoType]();
  try {
    const success = await dao.insertObj(activity);
    return { success, data: activity };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
}