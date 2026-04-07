
import type { HttpStatusCode, ResponseType } from './error-type.ts';

/**
 * 应用异常类
 * @example
 * throw new ApplicationException(LOGIN_ERROR);
 * throw new ApplicationException(CUSTOM_ERROR, '自定义覆盖消息');
 */
export class ApplicationException extends Error {
  /**
   * 业务错误码
   */
  public readonly code: number;

  /**
   * 原始错误类型
   */
  public readonly errorType: ResponseType;

  public readonly status: HttpStatusCode;

  constructor(errorType: ResponseType, message?: string) {
    super(message ?? errorType.message);
    this.code = errorType.code;
    this.errorType = errorType;
    this.name = 'ApplicationException';
    this.status = errorType.status;

    // 在支持的环境中捕获堆栈轨迹
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}