/**
 * 错误类型接口
 */
export interface ErrorType {
  /**
   * 错误码
   */
  code: number;
  /**
   * 错误信息
   */
  message: string;
}

/**
 * 创建错误类型的辅助函数
 */
export const createErrorType = (code: number, message: string): ErrorType => ({
  code,
  message,
});

/**
 * 通用错误常量
 */
export const COMMON_ERRORS = {
  // 通用错误 (1000-1999)
  UNKNOWN_ERROR: createErrorType(1000, '未知异常'),
  INTERNAL_ERROR: createErrorType(1001, '服务器内部错误'),
  INVALID_PARAMS: createErrorType(1002, '参数错误'),
  NOT_FOUND: createErrorType(1003, '资源不存在'),

  // 认证相关错误 (2000-2999)
  LOGIN_ERROR: createErrorType(2000, '登录失败'),
  TOKEN_INVALID: createErrorType(2001, 'Token 无效'),
  TOKEN_EXPIRED: createErrorType(2002, 'Token 已过期'),
  UNAUTHORIZED: createErrorType(2003, '未授权'),
  FORBIDDEN: createErrorType(2004, '禁止访问'),
  LOGOUT_ERROR: createErrorType(2005, '登出失败'),

  // 用户相关错误 (3000-3999)
  USER_NOT_FOUND: createErrorType(3000, '用户不存在'),
  USER_ALREADY_EXISTS: createErrorType(3001, '用户已存在'),
  PASSWORD_ERROR: createErrorType(3002, '密码错误'),

  // 业务相关错误 (4000-4999)
  BUSINESS_ERROR: createErrorType(4000, '业务错误'),
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
} = COMMON_ERRORS;