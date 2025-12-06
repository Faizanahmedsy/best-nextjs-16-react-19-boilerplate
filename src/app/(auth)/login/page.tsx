import { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Login",
  description: "Access your Home Worth account",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <h1 className="text-primary text-3xl font-bold tracking-tighter">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
        </div>

        {/* The Card is now just for desktop styling */}
        <Card className="border-border/50 bg-background/80 hidden overflow-visible rounded-2xl border shadow-2xl shadow-black/10 backdrop-blur-lg sm:block dark:bg-black dark:shadow-black/50">
          <CardContent className="p-8">
            <LoginForm />
          </CardContent>
        </Card>

        {/* On mobile, the form appears without a card */}
        <div className="block sm:hidden">
          <LoginForm />
        </div>
      </div>

      <footer className="text-muted-foreground absolute bottom-4 px-4 text-center text-xs sm:bottom-4">
        <p>&copy; {new Date().getFullYear()} This is an open-source boilerplate.</p>
      </footer>
    </main>
  );
}
