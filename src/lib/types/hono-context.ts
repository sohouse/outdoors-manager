import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission.ts'
import { Session, User } from 'better-auth'

export type AuthContextValue = {
    user: User
    session: Session
}

declare module 'hono' {
    interface ContextVariableMap {
        auth: AuthContextValue
        authz: UserRolePermission
    }
}

export {}
