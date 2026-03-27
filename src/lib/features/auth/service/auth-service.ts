import {auth} from "../../../auth-client.ts";
import {logInCheck, signUpCheck} from "@/lib/features/auth/check/auth-check.ts";
import z from "zod";
import {ApplicationException} from "@/lib/types/ApplicationException.ts";
import {LOGIN_ERROR, USER_ALREADY_EXISTS} from "@/lib/types/ErrorType.ts";

export const signUp = async (formData: z.infer<typeof signUpCheck>): Promise<boolean> => {
    const loginKey = formData.name;
    try {
        await auth.signUp.email({
            email: formData.email,
            password: formData.pwd,
            name: loginKey,
            username: loginKey,
        });
        return true;
    } catch {
        throw new ApplicationException(USER_ALREADY_EXISTS);
    }
}

export const logInMethod = async (formData: z.infer<typeof logInCheck>): Promise<boolean> => {
    const loginKey = formData.name;
    const pwd = formData.pwd;

    try {
        if (loginKey.includes('@')) {
            await auth.signIn.email({
                email: loginKey,
                password: pwd,
                rememberMe: true
            });
        } else {
            await auth.signIn.username({
                username: loginKey,
                password: pwd
            });
        }
        return true; // await 之后没有抛异常，说明成功
    } catch (error) {
        // 失败时抛出异常
        if (error instanceof ApplicationException) {
            throw error;
        }
        throw new ApplicationException(LOGIN_ERROR);
    }
}

export const logOut = async () => {
    await auth.signOut();
}
