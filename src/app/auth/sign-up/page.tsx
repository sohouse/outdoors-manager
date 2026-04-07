'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/lib/components/ui/card.tsx"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field.tsx"
import { Input } from "@/lib/components/ui/input.tsx"
import { Button } from "@/lib/components/ui/button.tsx"
import { signUpCheck } from "@/lib/features/auth/check/auth-check.ts"
import z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { ACTIVITY_ROUTES } from "@/lib/config/routes.ts";
import { useState } from "react"
import ErrorAlert from "@/lib/components/web/ErrorAlert"
import { ApplicationException } from "@/lib/types/application-exception.ts"
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts"
import { signUp } from "@/lib/features/auth/service/auth-service.ts"

const SignUp = () => {
    const form = useForm<z.infer<typeof signUpCheck>>({
        resolver: zodResolver(signUpCheck),
        defaultValues: {
            name: "",
            email: "",
            pwd: ""
        }
    });

    const route = useRouter();
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null);
    const submitForm = async () => {
        try {
            const signUpData = form.getValues();
            await signUp(signUpData);
            route.push(ACTIVITY_ROUTES.LIST);
            route.refresh();
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '注册失败';
            const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code;
            setErrorInfo({ title: code, desc: message });
        }
    }

    return (
        errorInfo ?
            <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} /> :
            <Card>
                <CardHeader>
                    Create your own account
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(submitForm)}>
                        <FieldGroup>
                            <Controller name="name" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>your name:</FieldLabel>
                                    <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                        placeholder="input your name" />
                                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                                </Field>
                            )} />
                            <Controller name="email" control={form.control} render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>your email:</FieldLabel>
                                    <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid}
                                        placeholder="input your email" />
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
                                <span>已有账号?</span>
                                <Link href={'/auth/login'} rel="noopener noreferrer" className="text-blue-500 pl-1">
                                    登陆
                                </Link>
                            </div>
                        </FieldGroup>
                    </form>
                    <CardFooter>
                    </CardFooter>
                </CardContent>

            </Card>
    )
}

export default SignUp
