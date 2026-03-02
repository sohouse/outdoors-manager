export interface PaginateCondition {
  page?: number;
  pageSize?: number;
  limit?: number;
  start?: number;
}

export interface PaginateMeta {
  totalCount: number;
  currentCount: number;
  pageSize?: number;
  totalPage?: number;
  currentPage?: number;
}

export interface PageResult<T>{
  meta: PaginateMeta;
  items: T[]
}
