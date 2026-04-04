import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/client"

const authBaseURL = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = createAuthClient({
    baseURL: authBaseURL,
    plugins: [
        usernameClient(),
    ]
})
