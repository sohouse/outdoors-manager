export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]
/**
 * 错误类型接口
 */
export interface ResponseType {
  /**
   * 返回码
   */
  code: number;
  /**
   * 信息
   */
  message: string;

  /**
   * 状态码
   */
  status: HttpStatusCode;
}


/**
 * 创建错误类型的辅助函数
 */
export const createResponseType = (code: number, message: string, status?: HttpStatusCode): ResponseType => ({
  code,
  message,
  status: status ?? HTTP_STATUS.INTERNAL_SERVER_ERROR
});

/**
 * 通用错误常量
 */
export const COMMON_RESPONSE = {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: createResponseType(1000, '未知异常'),
  INTERNAL_ERROR: createResponseType(1001, '服务器内部错误'),
  INVALID_PARAMS: createResponseType(1002, '参数错误', HTTP_STATUS.BAD_REQUEST),
  NOT_FOUND: createResponseType(1003, '资源不存在', HTTP_STATUS.NOT_FOUND),

  // 认证相关错误 (2000-2999)
  LOGIN_ERROR: createResponseType(2000, '登录失败', HTTP_STATUS.UNAUTHORIZED),
  TOKEN_INVALID: createResponseType(2001, 'Token 无效', HTTP_STATUS.UNAUTHORIZED),
  TOKEN_EXPIRED: createResponseType(2002, 'Token 已过期', HTTP_STATUS.UNAUTHORIZED),
  UNAUTHORIZED: createResponseType(2003, '未授权', HTTP_STATUS.UNAUTHORIZED),
  FORBIDDEN: createResponseType(2004, '禁止访问', HTTP_STATUS.FORBIDDEN),
  LOGOUT_ERROR: createResponseType(2005, '登出失败', HTTP_STATUS.UNAUTHORIZED),

  // 用户相关错误 (3000-3999)
  USER_NOT_FOUND: createResponseType(3000, '用户不存在', HTTP_STATUS.NOT_FOUND),
  USER_ALREADY_EXISTS: createResponseType(3001, '用户已存在', HTTP_STATUS.BAD_REQUEST),
  PASSWORD_ERROR: createResponseType(3002, '密码错误', HTTP_STATUS.BAD_REQUEST),

  // 业务相关错误 (4000-4999)
  BUSINESS_ERROR: createResponseType(4000, '业务错误', HTTP_STATUS.BAD_REQUEST),

  // 正确返回
  SUCCESS_RESPONSE: createResponseType(0, '请求成功', HTTP_STATUS.OK),
} as const;

/**
 * 导出常用错误（方便直接使用）
 */
export const {
  UNKNOWN_ERROR,
  INTERNAL_ERROR,
  INVALID_PARAMS,
  NOT_FOUND,
  LOGIN_ERROR,
  LOGOUT_ERROR,
  TOKEN_INVALID,
  TOKEN_EXPIRED,
  UNAUTHORIZED,
  FORBIDDEN,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS,
  PASSWORD_ERROR,
  BUSINESS_ERROR,
  SUCCESS_RESPONSE
} = COMMON_RESPONSE;