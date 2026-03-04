import { PaginateCondition } from "@/types/pagination";

export interface BaseDao<T, Condition extends PaginateCondition> {
    findByCondition<T>(condition: Condition): Promise<{items: T[], totalCount:number}>;
    countByCondition(condition: Condition): Promise<number>;
    insertObj(obj: T): Promise<boolean>;
    editObj(updateObj: T): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}