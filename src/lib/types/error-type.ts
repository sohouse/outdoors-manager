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
}

/**
 * 创建错误类型的辅助函数
 */
export const createResponseType = (code: number, message: string): ResponseType => ({
  code,
  message,
});

/**
 * 通用错误常量
 */
export const COMMON_RESPONSE = {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: createResponseType(1000, '未知异常'),
  INTERNAL_ERROR: createResponseType(1001, '服务器内部错误'),
  INVALID_PARAMS: createResponseType(1002, '参数错误'),
  NOT_FOUND: createResponseType(1003, '资源不存在'),

  // 认证相关错误 (2000-2999)
  LOGIN_ERROR: createResponseType(2000, '登录失败'),
  TOKEN_INVALID: createResponseType(2001, 'Token 无效'),
  TOKEN_EXPIRED: createResponseType(2002, 'Token 已过期'),
  UNAUTHORIZED: createResponseType(2003, '未授权'),
  FORBIDDEN: createResponseType(2004, '禁止访问'),
  LOGOUT_ERROR: createResponseType(2005, '登出失败'),

  // 用户相关错误 (3000-3999)
  USER_NOT_FOUND: createResponseType(3000, '用户不存在'),
  USER_ALREADY_EXISTS: createResponseType(3001, '用户已存在'),
  PASSWORD_ERROR: createResponseType(3002, '密码错误'),

  // 业务相关错误 (4000-4999)
  BUSINESS_ERROR: createResponseType(4000, '业务错误'),

  // 正确返回
  SUCCESS_RESPONSE: createResponseType(0, '请求成功'),
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