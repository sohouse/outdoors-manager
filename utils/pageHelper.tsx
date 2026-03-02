import { PaginateCondition } from "@/types/pagination";
import { isNil } from 'lodash';

export const pagination = (condition: PaginateCondition) => {
    const limit = isNil(condition.limit) || condition.limit < 1 ? 5 : condition.limit
    const page = isNil(condition.page) || condition.page < 1 ? 1 : condition.page;

    const start = (page - 1) * limit;
    
    condition.start = start;
    condition.limit = limit;
    condition.page = page;
}