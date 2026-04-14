'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/lib/components/ui/card.tsx"
import * as z from 'zod'
import { logInCheck } from '@/lib/features/auth/check/auth-check.ts'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field.tsx"
import { Input } from "@/lib/components/ui/input.tsx"
import { Button } from "@/lib/components/ui/button.tsx"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { COMMON_ROUTES } from "@/lib/config/routes.ts";
import { useState } from "react"
import { ApplicationException } from "@/lib/types/application-exception.ts"
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts"
import ErrorAlert from "@/lib/components/web/ErrorAlert"
import { login } from "@/lib/features/auth/service/auth-service.ts";

const SignUp = () => {
    const route = useRouter();
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null);
    const form = useForm<z.infer<typeof logInCheck>>({
        resolver: zodResolver(logInCheck),
        defaultValues: {
            name: "",
            pwd: ""
        }
    });

    const submitForm = async () => {
        try {
            const loginFormData = form.getValues();
            await login(loginFormData);
            route.push(COMMON_ROUTES.HOME);
            route.refresh();
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '登陆失败';
            const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code;
            setErrorInfo({ title: code, desc: message });
        }
    }

    return (
        errorInfo ?
            <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} /> :
            <Card>
                <CardHeader>
                    Login
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(submitForm)}>
                        <FieldGroup>
                            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                默认账号：admin；密码：a1234567
                            </div>
                            <Controller name="name" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>your name:</FieldLabel>
                                    <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                        placeholder="name or email" />
                                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                </Field>
                            )} />
                            <Controller name="pwd" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>your password:</FieldLabel>
                                    <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                        placeholder="input your password" />
                                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                </Field>
                            )} />
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
