import { PaginateCondition } from "@/lib/types/pagination.ts";
import { ActivityDao } from "./activity-dao.ts";

export interface BaseDao<T, Condition extends PaginateCondition> {
    findByCondition(condition: Condition): Promise<{items: T[], totalCount:number}>;
    countByCondition(condition: Condition): Promise<number>;
    insertObj(obj: T): Promise<boolean>;
    editObj(updateObj: T): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export const daoRegistry: Record<string, () => BaseDao<unknown, PaginateCondition>> = {
  activity: () => new ActivityDao() as BaseDao<unknown, PaginateCondition>,
}