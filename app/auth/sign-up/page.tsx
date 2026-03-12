'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/lib/components/ui/card"
import * as z from 'zod'
import { signUpCheck } from "./sign-up-check"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field"
import { Input } from "@/lib/components/ui/input"
import { Button } from "@/lib/components/ui/button"

const SignUp = () => {
  const form = useForm<z.infer<typeof signUpCheck>>({
    resolver: zodResolver(signUpCheck),
    defaultValues: {
      name: "",
      email: "",
      pwd: ""
    }
  });

  const submitForm = () => {
      console.log('aaa')
  }

  return (
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
                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid} placeholder="input your name" />
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            )} />
            <Controller name="email" control={form.control} render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>your email:</FieldLabel>
                <Input {...field} id="sign-up-name" aria-invalid={fieldState.invalid} placeholder="input your email" />
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