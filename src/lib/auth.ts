import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./database/client";
import { openAPI, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';

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
        nextCookies(),
    ],
});