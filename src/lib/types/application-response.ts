import { SUCCESS_RESPONSE } from "./error-type";

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
    return {code:SUCCESS_RESPONSE.code, message: message ?? SUCCESS_RESPONSE.message, success:true, content}
}

export function createErrorApplicationResponse<T>(
    code: number,
    message: string,
): ApplicationResponse<T>  {
    return {code, message, success: false}
}