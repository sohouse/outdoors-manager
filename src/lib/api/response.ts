import type { ClientResponse } from 'hono/client'
import { ApplicationResponse } from '../types/application-response.ts'
import { ApplicationException } from '../types/application-exception.ts'
import { createErrorType } from '../types/error-type.ts'

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