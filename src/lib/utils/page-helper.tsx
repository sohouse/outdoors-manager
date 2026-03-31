import {DEFAULT_LIMIT, DEFAULT_PAGE} from "../constants.ts";
import {PaginateCondition} from "../types/pagination.ts";

export const calcOffset = (condition: PaginateCondition): number => {
    const page = condition.page <= 0 || condition.page == undefined ? DEFAULT_PAGE : condition.page;
    const limit = condition.limit <= 0 || condition.limit == undefined ? DEFAULT_LIMIT : condition.limit;
    return (page - 1) * limit;
}