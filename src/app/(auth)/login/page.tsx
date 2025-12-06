import { Metadata } from "next";

// Import Link for navigation
import { LoginForm } from "@/features/auth/components/login-form";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

// For the divider lines

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Home Worth account",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Card className="border-border/50 bg-background/80 overflow-visible rounded-2xl shadow-2xl shadow-black/10 backdrop-blur-lg dark:bg-black dark:shadow-black/50">
          <CardHeader className="p-8 pb-4 text-center">
            <h1 className="text-primary text-3xl font-bold tracking-tighter">Welcome Back</h1>
            <CardDescription className="pt-1">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <LoginForm />
          </CardContent>
        </Card>
      </div>

      {/* 3. Global Footer */}
      <footer className="text-muted-foreground/50 absolute bottom-4 text-center text-xs">
        &copy; {new Date().getFullYear()} This is an open-source boilerplate.
      </footer>
    </div>
  );
}
