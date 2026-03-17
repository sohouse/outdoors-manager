'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/lib/components/ui/card.tsx"
import * as z from 'zod'
import { signInCheck } from '@/lib/validators/sign-up-check.ts'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field.tsx"
import { Input } from "@/lib/components/ui/input.tsx"
import { Button } from "@/lib/components/ui/button.tsx"
import { authClient } from "@/lib/auth-client"
import { auth } from "@/lib/auth"
import { useRouter } from "next/navigation"

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
    const loginKey = form.getValues('name');
    if (loginKey.includes('@')) {
      await auth.signIn.email({
        email: loginKey,
        password: form.getValues('pwd'),
        rememberMe: true
      }, {
        onSuccess(ctx) { loginSuccess(); },
        onError(ctx) {
          alert(ctx.error.message);
        },
      });
    } else {
      await auth.signIn.username({
        username: loginKey,
        password: form.getValues('pwd')
      }, {
        onSuccess(ctx) { loginSuccess() },
        onError(ctx) {
          alert(ctx.error.message);
        },
      })
    }

  }

  const loginSuccess = () => {
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
            <Controller name="name" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>your name:</FieldLabel>
                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid} placeholder="name or email" />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            )} />
            <Controller name="pwd" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>your password:</FieldLabel>
                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid} placeholder="input your password" />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            )} />
            <Button type="submit">Submit</Button>
          </FieldGroup>
        </form>
        <CardFooter>
        </CardFooter>
      </CardContent>

    </Card>
  )
}

export default SignUp