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

function LoginBlock({ className, ...props }: ComponentProps<"div">) {
  const emailId = useId()
  const passwordId = useId()

  return (
    <div
      className={cn("flex w-full items-center justify-center p-6 md:p-10", className)}
      {...props}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => event.preventDefault()}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={emailId}>Email</FieldLabel>
                <Input id={emailId} type="email" placeholder="m@example.com" required />
              </Field>
              <Field>
                <div className="flex items-center gap-4">
                  <FieldLabel htmlFor={passwordId}>Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id={passwordId} type="password" required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <Button variant="outline" type="button">Login with Google</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export { LoginBlock }
