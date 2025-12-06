"use client";

import { useState } from "react";

import Link from "next/link";

// <--- Import useState
import { loginAction } from "@/features/auth/actions/login.action";
import { HomeAvatar } from "@/features/auth/components/avatars/home-avatar";
import { SubmitButton } from "@/features/auth/components/submit-button";

import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useServerAction } from "@/hooks/use-server-action";

// <--- Import the Avatar

export function LoginForm() {
  const [state, action, isPending] = useServerAction(loginAction);

  // 1. Interactive State
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailLength, setEmailLength] = useState(0);

  return (
    <div className="w-full">
      {/* 2. The Avatar sits ON TOP of the form */}
      <HomeAvatar
        isPasswordFocused={isPasswordFocused}
        lookAt={(emailLength / 30) * 100} // Normalize 0-30 chars to 0-100%
      />

      <form action={action} className="mt-2 grid gap-4">
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
            aria-describedby="email-error"
            // 3. Track Typing
            onChange={(e) => setEmailLength(e.target.value.length)}
            onFocus={() => setIsPasswordFocused(false)}
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
            disabled={isPending}
            aria-invalid={!!state.fieldErrors?.password}
            aria-describedby="password-error"
            // 4. Track Focus
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
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
      <div className="mt-4 flex flex-col items-center gap-4 text-sm">
        <Link
          href="/register"
          className="border-primary/20 text-muted-foreground w-full rounded-lg border-2 border-dashed p-3 text-center transition-colors"
        >
          New to the platform? <span className="text-primary font-semibold">Sign up here</span>
        </Link>
      </div>
    </div>
  );
}
