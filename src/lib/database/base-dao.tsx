import { PaginateCondition } from "@/lib/types/pagination.ts";

export interface BaseDao<T, I, U, Condition extends PaginateCondition> {
    findByCondition(condition: Condition): Promise<{items: T[], totalCount:number}>;
    countByCondition(condition: Condition): Promise<number>;
    insertObj(obj: I): Promise<boolean>;
    editObj(updateObj: U): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}