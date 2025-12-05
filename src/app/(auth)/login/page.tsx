import { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your account",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-400 p-4">
      <Card className="w-full max-w-sm overflow-visible border-0 shadow-none sm:border sm:shadow-sm">
        {/* Added overflow-visible above */}

        <CardHeader className="pb-2">
          {" "}
          {/* Reduce padding slightly */}
          <h1 className="text-center text-2xl font-semibold tracking-tight">Welcome Back</h1>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
