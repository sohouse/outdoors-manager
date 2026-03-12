/**
 * 分页查询条件对象
 */
export interface PaginateCondition {
  page?: number;
  limit?: number;
  start?: number;
}

/**
 * 分页返回对象
 */
export interface PaginateMeta {
  totalCount: number;
  currentCount: number;
  pageSize?: number;
  totalPage?: number;
  currentPage?: number;
}

/**
 * 列表返回对象
 */
export interface PageResult<T>{
  meta: PaginateMeta;
  items: T[]
}
