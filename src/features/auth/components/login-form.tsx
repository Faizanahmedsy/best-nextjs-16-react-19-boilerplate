"use client";

import { loginAction } from "@/features/auth/actions/login.action";
import { SubmitButton } from "@/features/auth/components/submit-button";

import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useServerAction } from "@/hooks/use-server-action";

export function LoginForm() {
  const [state, action] = useServerAction(loginAction);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email" className={state.fieldErrors?.email ? "text-destructive" : ""}>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          autoFocus
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby="email-error"
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="text-destructive animate-in slide-in-from-top-1 text-xs">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className={state.fieldErrors?.password ? "text-destructive" : ""}
          >
            Password
          </Label>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary text-xs underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          aria-invalid={!!state.fieldErrors?.password}
          aria-describedby="password-error"
        />
        {state.fieldErrors?.password && (
          <p
            id="password-error"
            className="text-destructive animate-in slide-in-from-top-1 text-xs"
          >
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {!state.success && state.message && (
        <div className="bg-destructive/15 text-destructive animate-in zoom-in-95 rounded-md p-3 text-sm font-medium">
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
