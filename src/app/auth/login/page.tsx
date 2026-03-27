'use client'
import {Card, CardContent, CardFooter, CardHeader} from "@/lib/components/ui/card.tsx"
import * as z from 'zod'
import {logInCheck} from '@/lib/features/auth/check/auth-check.ts'
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/lib/components/ui/field.tsx"
import {Input} from "@/lib/components/ui/input.tsx"
import {Button} from "@/lib/components/ui/button.tsx"
import {useRouter} from "next/navigation"
import Link from "next/link";
import {COMMON_ROUTES} from "@/lib/config/routes.ts";
import {honoClient} from "@/lib/api/main.ts";

const SignUp = () => {
    const route = useRouter();
    const form = useForm<z.infer<typeof logInCheck>>({
        resolver: zodResolver(logInCheck),
        defaultValues: {
            name: "",
            pwd: ""
        }
    });

    const submitForm = async () => {
        const loginFormData = form.getValues();
        const loginResult = await honoClient.api.auth['logIn'].$post(loginFormData);
        if (loginResult) {
            route.push(COMMON_ROUTES.HOME);
        } else {
            alert('登陆失败');
        }
    }

    return (
        <Card>
            <CardHeader>
                Login
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(submitForm)}>
                    <FieldGroup>
                        <Controller name="name" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>your name:</FieldLabel>
                                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                       placeholder="name or email"/>
                                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                            </Field>
                        )}/>
                        <Controller name="pwd" control={form.control} render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>your password:</FieldLabel>
                                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                       placeholder="input your password"/>
                                {fieldState.invalid && (<FieldError errors={[fieldState.error]}/>)}
                            </Field>
                        )}/>
                        <Button type="submit">Submit</Button>
                        <div className="flex flex-row justify-end">
                            <span>没有账号?</span>
                            <Link href={'/auth/sign-up'} rel="noopener noreferrer" className="text-blue-500 pl-1">
                                注册
                            </Link>
                        </div>
                    </FieldGroup>
                </form>
                <CardFooter>
                </CardFooter>
            </CardContent>

        </Card>
    );
}

export default SignUp