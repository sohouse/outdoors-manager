import { DaoFindResult } from "../features/activity/shared/activity";

export interface BaseDao<T, I, U, Condition> {
    findByCondition(condition: Condition): Promise<DaoFindResult<T>>;
    countByCondition(condition: Condition): Promise<number>;
    insertObj(obj: I): Promise<boolean>;
    editObj(updateObj: U): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}