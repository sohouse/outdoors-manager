import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./database/client";
import { openAPI, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

const NextCookiesPlugin = nextCookies();
export const auth = betterAuth({
    database: prismaAdapter(client, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    basePath: '/api/auth',
    plugins: [
        // 用户名登录插件
        username(),
        // openapi插件
        openAPI({
            path: '/reference',
            disableDefaultReference: false,
        }),
    ],
});

// nextjs的cookie仿问插件
auth.options.plugins.push(NextCookiesPlugin as any);
export interface AuthType {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
}