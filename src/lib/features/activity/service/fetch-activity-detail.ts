import { headers } from 'next/headers'

import { honoClient } from '@/lib/api/main.ts'
import { unwrapResponse } from '@/lib/api/response'
import { ActivityVO } from '@/lib/features/activity/shared/activity.ts'

export async function fetchActivityDetail(id: string): Promise<ActivityVO> {
    const requestHeaders = Object.fromEntries((await headers()).entries())
    const res = await honoClient.api.activity['getObjById'].$get(
        { query: { id } },
        { headers: requestHeaders }
    )

    return unwrapResponse<ActivityVO>(res)
}
