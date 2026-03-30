import type { ClientResponse } from 'hono/client'
import { ApplicationResponse } from '../types/ApplicationResponse'
import { ApplicationException } from '../types/ApplicationException'
import { createErrorType } from '../types/ErrorType'

export async function unwrapResponse<T>(
    res: ClientResponse<unknown>
): Promise<T> {
    const result = await res.json() as ApplicationResponse<T>

    if (!result.success) {
        const errorType = createErrorType(result.code, result.message)
        throw new ApplicationException(errorType, result.message)
    }

    return result.content as T
}