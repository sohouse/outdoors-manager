/**
 * 分页查询条件对象
 */
export interface PaginateCondition {
  /**
   * 第几页
   */
  page: number;
  /**
   * 查询多少条数据
   */
  limit: number;
}

/**
 * 分页返回对象
 */
export interface PaginateMeta {
  /**
   * 总条数
   */
  totalCount: number;
  /**
   * 当前limit
   */
  limit: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 当前第几页
   */
  page: number;
}

/**
 * 列表返回对象
 */
export interface PageResult<T>{
  meta: PaginateMeta;
  items: T[]
}
