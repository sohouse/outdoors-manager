import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prismaClient } from "./database/prisma-client.ts";
import { openAPI, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

const authSecret = process.env.BETTER_AUTH_SECRET;
const authBaseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_BASE_URL;

export const auth = betterAuth({
    secret: authSecret,
    baseURL: authBaseURL,
    database: prismaAdapter(prismaClient, {
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
        nextCookies(),
    ],
});
