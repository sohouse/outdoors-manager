import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/client"

export const auth = createAuthClient({
    baseURL: 'http://localhost:3000',
    plugins: [
        usernameClient(),
    ]
})