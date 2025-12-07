/**
 * @file This is the "Dumb" Presentational Component for the Register feature.
 *
 * @architecture
 * It is completely stateless and receives all its data and event handlers as props from a "Smart Hook".
 * Its sole responsibility is to render the UI based on the props it receives.
 * This separation makes the component highly reusable, testable, and easy to reason about.
 */
"use client";

import Link from "next/link";

import { SubmitButton } from "@/features/auth/components/submit-button";
import type { UseRegisterFormReturn } from "@/features/auth/hooks/use-register-form";

import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm(props: UseRegisterFormReturn) {
  const { state, action, isPending, handlePasswordVisibilityChange } = props;

  return (
    <div className="mx-auto w-full max-w-md">
      <form action={action} className="grid grid-cols-1 gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name" className={state.fieldErrors?.name ? "text-destructive" : ""}>
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            autoComplete="name"
            disabled={isPending}
          />
          {state.fieldErrors?.name && (
            <p className="text-destructive text-xs">{state.fieldErrors.name[0]}</p>
          )}
        </div>

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
            disabled={isPending}
          />
          {state.fieldErrors?.email && (
            <p className="text-destructive text-xs">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="password"
            className={state.fieldErrors?.password ? "text-destructive" : ""}
          >
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            disabled={isPending}
            onVisibilityChange={handlePasswordVisibilityChange}
          />
          {state.fieldErrors?.password && (
            <p className="text-destructive text-xs">{state.fieldErrors.password[0]}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label
            htmlFor="confirmPassword"
            className={state.fieldErrors?.confirmPassword ? "text-destructive" : ""}
          >
            Confirm Password
          </Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            disabled={isPending}
          />
          {state.fieldErrors?.confirmPassword && (
            <p className="text-destructive text-xs">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>

        {!state.success && state.message && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm font-medium">
            {state.message}
          </div>
        )}

        <div className="pt-2">
          <SubmitButton buttonText="Sign up" pendingText="Signing up..." />
        </div>
      </form>

      <div className="mt-6">
        <Link
          href="/login"
          className="border-primary/20 text-link-muted hover:border-primary/40 hover:bg-primary/5 block w-full rounded-lg border-2 border-dashed p-3 text-center text-sm"
        >
          Already have an account?{" "}
          <span className="text-primary-foreground-alt font-semibold">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
