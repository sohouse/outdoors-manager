import type { ClientResponse } from 'hono/client'
import type { ApplicationResponse } from '../types/application-response.ts'
import { ApplicationException } from '../types/application-exception.ts'
import { COMMON_RESPONSE, createResponseType, HttpStatusCode } from '../types/error-type.ts'

function isApplicationResponse(value: unknown): value is ApplicationResponse<unknown> {
    if (!value || typeof value !== 'object') {
        return false
    }

    return 'success' in value && 'code' in value && 'message' in value
}

export async function unwrapResponse<T>(
    res: ClientResponse<unknown>
): Promise<T> {
    const payload: unknown = await res.json()

    if (!isApplicationResponse(payload)) {
        throw new ApplicationException(COMMON_RESPONSE.UNKNOWN_ERROR, '响应格式不符合约定')
    }

    const result = payload

    if (!result.success) {
        const errorType = createResponseType(result.code, result.message, res.status as HttpStatusCode)
        throw new ApplicationException(errorType, result.message)
    }

    return result.content as T
}
