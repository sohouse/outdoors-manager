import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission.ts'

declare module 'hono' {
    interface ContextVariableMap {
        user: {
            id: string
            name?: string
            username?: string | null
        }
        session: {
            id: string
            userId: string
        }
        authz: UserRolePermission
        permissions: string[]
    }
}

export {}
