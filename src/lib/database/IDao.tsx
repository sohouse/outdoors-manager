import { PaginateCondition } from "@/lib/types/pagination.ts";
import { ActivityDao } from "./activity-dao.ts";
import {ActivityItem, CreateActivityInput, UpdateActivityInput} from "@/lib/types/activity.ts";

export interface BaseDao<T, I, U, Condition extends PaginateCondition> {
    findByCondition(condition: Condition): Promise<{items: T[], totalCount:number}>;
    countByCondition(condition: Condition): Promise<number>;
    insertObj(obj: I): Promise<boolean>;
    editObj(updateObj: U): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export const daoRegistry: Record<string, () => BaseDao<unknown, unknown, unknown, PaginateCondition>> = {
  activity: () => new ActivityDao() as BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, PaginateCondition>,
}