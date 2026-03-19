'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/lib/components/ui/card.tsx"
import * as z from 'zod'
import { signInCheck } from '@/lib/validators/sign-up-check.ts'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field.tsx"
import { Input } from "@/lib/components/ui/input.tsx"
import { Button } from "@/lib/components/ui/button.tsx"
import { useRouter } from "next/navigation"
import { logIn } from "@/lib/service/auth-service"
import Link from "next/link";

const SignUp = () => {
  const route = useRouter();
  const form = useForm<z.infer<typeof signInCheck>>({
    resolver: zodResolver(signInCheck),
    defaultValues: {
      name: "",
      pwd: ""
    }
  });

  const submitForm = async () => {
    await logIn(form);
    route.push('/');
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
                            <Link href={'/auth/sign-up'} rel="noopener noreferrer" className="text-blue-500 pl-1" >
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