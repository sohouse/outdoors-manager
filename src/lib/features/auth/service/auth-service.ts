import {auth} from "../../../auth-client.ts";
import {logInCheck, signUpCheck} from "@/lib/features/auth/check/auth-check.ts";
import z from "zod";
import {ApplicationException} from "@/lib/types/application-exception.ts";
import type { ResponseType } from "@/lib/types/error-type.ts";
import {LOGIN_ERROR, LOGOUT_ERROR, USER_ALREADY_EXISTS} from "@/lib/types/error-type.ts";

type SessionUser = NonNullable<Awaited<ReturnType<typeof auth.getSession>>["data"]>["user"];

const unwrapAuthResult = (
    result: { error: { message?: string } | null },
    errorType: ResponseType
) => {
    if (result.error) {
        throw new ApplicationException(errorType, result.error.message ?? errorType.message);
    }
};

export const signUp = async (formData: z.infer<typeof signUpCheck>): Promise<boolean> => {
    const loginKey = formData.name;
    const result = await auth.signUp.email({
        email: formData.email,
        password: formData.pwd,
        name: loginKey,
        username: loginKey,
    });

    unwrapAuthResult(result, USER_ALREADY_EXISTS);
    return true;
}

export const login = async (formData: z.infer<typeof logInCheck>): Promise<boolean> => {
    const loginKey = formData.name;
    const pwd = formData.pwd;

    const result = loginKey.includes('@')
        ? await auth.signIn.email({
            email: loginKey,
            password: pwd,
            rememberMe: true
        })
        : await auth.signIn.username({
            username: loginKey,
            password: pwd
        });

    unwrapAuthResult(result, LOGIN_ERROR);
    return true;
}

export const logout = async (): Promise<boolean> => {
    const result = await auth.signOut();
    unwrapAuthResult(result, LOGOUT_ERROR);
    return true;
}

export const getCurrentSession = async (): Promise<SessionUser | null> => {
    const { data } = await auth.getSession();
    return data?.user ?? null;
}
