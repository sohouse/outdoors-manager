import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
import { openAPI } from "better-auth/plugins"

export const authClient = createAuthClient({
    baseURL: 'http://localhost:3000',
    plugins: [
        usernameClient(),
        openAPI({
            // path: '/reference',
            disableDefaultReference: false,
        }),
    ]
})