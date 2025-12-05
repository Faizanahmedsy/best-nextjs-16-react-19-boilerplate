"use client";

import { loginAction } from "@/features/auth/actions/login.action";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useServerAction } from "@/hooks/use-server-action";

export function LoginForm() {
  // Smart Hook handles: 1. Loading State 2. Error Toasts 3. Error Logs
  const [state, action, isPending] = useServerAction(loginAction);

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                disabled={isPending}
                // HTML5 Validation for instant feedback
                autoComplete="email"
              />
              {state.fieldErrors?.email && (
                <p className="text-destructive text-xs">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isPending}
                autoComplete="current-password"
              />
              {state.fieldErrors?.password && (
                <p className="text-destructive text-xs">{state.fieldErrors.password[0]}</p>
              )}
            </div>

            {!state.success && state.message && (
              <p className="text-destructive text-sm font-medium">{state.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
