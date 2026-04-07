import { SUCCESS_RESPONSE } from "./error-type";
import type { ResponseType } from "./error-type";

export interface ApplicationResponse<T> {
    code: number;
    message: string;
    success: boolean;
    content?: T;
}

export const createSuccessApplicationResponse = <T>(
    content: T,
    message?: string,
): ApplicationResponse<T> => {
    return {
        code:SUCCESS_RESPONSE.code, 
        message: message ?? SUCCESS_RESPONSE.message, 
        success:true, 
        content,
    }
}

export function createErrorApplicationResponse(errorType: ResponseType, message?: string): ApplicationResponse<null>;
export function createErrorApplicationResponse(code: number, message: string): ApplicationResponse<null>;
export function createErrorApplicationResponse(
    codeOrErrorType: number | ResponseType,
    message?: string
): ApplicationResponse<null> {
    if (typeof codeOrErrorType !== 'number') {
        return {
            success: false,
            code: codeOrErrorType.code,
            message: message ?? codeOrErrorType.message,
            content: null,
        };
    }

    return {
        success: false,
        code: codeOrErrorType,
        message: message ?? '',
        content: null,
    };
}
