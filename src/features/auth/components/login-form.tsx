/**
 * @file This is the "Dumb" Presentational Component for the Login feature.
 *
 * @architecture
 * It is completely stateless and receives all its data and event handlers as props from a "Smart Hook".
 * Its sole responsibility is to render the UI based on the props it receives.
 * This separation makes the component highly reusable, testable, and easy to reason about.
 */
"use client";

import Link from "next/link";

import type { UseLoginFormReturn } from "@/features/auth/hooks/use-login-form";

import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { HomeAvatar } from "./avatars/home-avatar";
import { SubmitButton } from "./submit-button";

/**
 * The presentational component for the login form.
 * @param props - The state and handlers provided by the `useLoginForm` hook.
 */
export function LoginForm(props: UseLoginFormReturn) {
  const {
    state,
    action,
    isPending,
    isPasswordFocused,
    emailLength,
    handleEmailChange,
    handlePasswordFocus,
    handlePasswordBlur,
    isPasswordError,
  } = props;

  return (
    <div className="w-full">
      <HomeAvatar isPasswordFocused={isPasswordFocused} lookAt={(emailLength / 30) * 100} />
      <form action={action} className="mt-2 grid gap-4 sm:gap-5">
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
            aria-invalid={!!state.fieldErrors?.email}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            className="placeholder:text-placeholder h-11 sm:h-10"
            onChange={handleEmailChange}
            onFocus={handlePasswordBlur} // Uncover eyes when typing email
          />
          {state.fieldErrors?.email && (
            <p
              id="email-error"
              className="text-destructive animate-in slide-in-from-top-1 text-xs"
              role="alert"
            >
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="password"
              className={state.fieldErrors?.password ? "text-destructive" : ""}
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className={cn(
                "text-link hover:text-primary focus-visible:ring-ring text-xs font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                isPasswordError && "animate-pulse-link"
              )}
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.password}
            aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
            className="placeholder:text-placeholder h-11 sm:h-10"
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          {state.fieldErrors?.password && (
            <p
              id="password-error"
              className="text-destructive animate-in slide-in-from-top-1 text-xs"
              role="alert"
            >
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        {!state.success && state.message && (
          <div
            className="bg-destructive/15 text-destructive animate-in zoom-in-95 rounded-md p-3 text-sm font-medium"
            role="alert"
            aria-live="polite"
          >
            {state.message}
          </div>
        )}
        <SubmitButton />
      </form>
      <div className="mt-4 flex flex-col items-center gap-4 text-sm sm:mt-6">
        <Link
          href="/register"
          className="border-primary/20 text-link-muted hover:border-primary/40 hover:bg-primary/5 focus-visible:ring-ring w-full rounded-lg border-2 border-dashed p-3 text-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:p-3.5"
        >
          New to the platform?{" "}
          <span className="text-primary-foreground-alt font-semibold">Sign up here</span>
        </Link>
      </div>
    </div>
  );
}
