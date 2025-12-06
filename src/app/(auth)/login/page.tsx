import { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Home Worth account",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:p-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Card className="border-border/50 bg-background/80 hidden overflow-visible rounded-2xl border shadow-2xl shadow-black/10 backdrop-blur-lg sm:block dark:bg-black dark:shadow-black/50">
          <CardHeader className="p-8 pb-4 text-center">
            <h1 className="text-primary text-3xl font-bold tracking-tighter">Welcome Back</h1>
            <CardDescription className="pt-1">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <LoginForm />
          </CardContent>
        </Card>

        <div className="block sm:hidden">
          <div className="mb-6 text-center">
            <h1 className="text-primary mb-2 text-3xl font-bold tracking-tighter sm:text-4xl">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>

      <footer className="text-muted-foreground/50 absolute bottom-4 px-4 text-center text-xs sm:bottom-4">
        <p>&copy; {new Date().getFullYear()} This is an open-source boilerplate.</p>
      </footer>
    </div>
  );
}
