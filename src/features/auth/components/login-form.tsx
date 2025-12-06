"use client";

import { useState } from "react";

import Link from "next/link";

import { loginAction } from "@/features/auth/actions/login.action";
import { HomeAvatar } from "@/features/auth/components/avatars/home-avatar";
import { SubmitButton } from "@/features/auth/components/submit-button";

import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useServerAction } from "@/hooks/use-server-action";

export function LoginForm() {
  const [state, action, isPending] = useServerAction(loginAction);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailLength, setEmailLength] = useState(0);

  return (
    <div className="w-full">
      <HomeAvatar
        isPasswordFocused={isPasswordFocused}
        lookAt={(emailLength / 30) * 100} // Normalize 0-30 chars to 0-100%
      />

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
            onChange={(e) => setEmailLength(e.target.value.length)}
            onFocus={() => setIsPasswordFocused(false)}
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
              // ✅ FIX: Using the solid 'text-link' color.
              className="text-link hover:text-primary focus-visible:ring-ring text-xs font-medium underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
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
