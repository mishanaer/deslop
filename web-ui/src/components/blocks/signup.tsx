"use client"

import { useId, type ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function SignupBlock({ className, ...props }: ComponentProps<"div">) {
  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmationId = useId()

  return (
    <div
      className={cn("flex w-full items-center justify-center p-6 md:p-10", className)}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your information below to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={nameId}>Full name</FieldLabel>
                <Input id={nameId} placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor={emailId}>Email</FieldLabel>
                <Input id={emailId} type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
                <Input id={passwordId} type="password" required />
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={confirmationId}>Confirm password</FieldLabel>
                <Input id={confirmationId} type="password" required />
              </Field>
              <Field>
                <Button type="submit">Create account</Button>
                <Button variant="outline" type="button">Sign up with Google</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export { SignupBlock }
