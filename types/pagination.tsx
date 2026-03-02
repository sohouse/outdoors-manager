export interface PaginateMeta {
    // 总数量
    totalCount?: number;
    // 当前页数量
    currentCount?: number;
    // 页大小
    pageSize?: number;
    // 总页数
    totalPage?: number;
    // 当前页
    currentPage?: number;
}

export interface PaginateCondition {
    page?: number;
    limit?: number;
}

export interface PageResult<T> {
    meta: PaginateMeta;
    items: T[]
}