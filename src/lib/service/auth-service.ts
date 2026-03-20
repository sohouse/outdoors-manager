import { UseFormReturn } from "react-hook-form";
import { auth } from "../auth-client";
import { signInCheck, signUpCheck } from "@/lib/zod-check/sign-up-check";
import z from "zod";

export const signUp = async (form: UseFormReturn<z.infer<typeof signUpCheck>>) => {
    const loginKey = form.getValues('name');
    const { } = await auth.signUp.email({
        email: form.getValues('email'),
        password: form.getValues('pwd'),
        name: loginKey,
        username: loginKey,
    }, {
        onRequest: (ctc) => { },
        onSuccess: (ctc) => {
            console.log(JSON.stringify(ctc));
            alert('注册成功');
        },
        onError: (ctc) => {
            alert(ctc.error.message);
        },
    });
}


export const logIn = async (form: UseFormReturn<z.infer<typeof signInCheck>>) => {
    const loginKey = form.getValues('name');
    if (loginKey.includes('@')) {
        await auth.signIn.email({
            email: loginKey,
            password: form.getValues('pwd'),
            rememberMe: true
        }, {
            onSuccess(ctx) { },
            onError(ctx) {
                alert(ctx.error.message);
            },
        });
    } else {
        await auth.signIn.username({
            username: loginKey,
            password: form.getValues('pwd')
        }, {
            onSuccess(ctx) { },
            onError(ctx) {
                alert(ctx.error.message);
            },
        })
    }

}

export const logOut = async () => {
    await auth.signOut();
}
