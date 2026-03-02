import { PaginateCondition } from "@/types/pagination";

export interface BaseDao<T, Condition extends PaginateCondition> {
    findByCondition(condition?: Condition): Promise<{items: T[], totalCount:number}>;
    insertObj(obj: T): Promise<boolean>;
    countByCondition(condition?: Condition): Promise<number>;
    editObj(updateObj: T): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}