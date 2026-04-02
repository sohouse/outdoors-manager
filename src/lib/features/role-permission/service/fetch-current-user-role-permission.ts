import { headers } from 'next/headers'

import { honoClient } from '@/lib/api/main.ts'
import { unwrapResponse } from '@/lib/api/response.ts'
import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission.ts'

export async function fetchCurrentUserRolePermission(): Promise<UserRolePermission> {
    const requestHeaders = Object.fromEntries((await headers()).entries())
    const res = await honoClient.api.rolePermission.currentUserRolePermission.$get(
        {},
        { headers: requestHeaders }
    )

    return unwrapResponse<UserRolePermission>(res)
}
