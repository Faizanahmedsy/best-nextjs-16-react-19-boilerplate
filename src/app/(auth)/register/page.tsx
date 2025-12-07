/**
 * @file The main server-rendered page for the Register route.
 *
 * @architecture
 * This is a Server Component. It handles metadata and the overall page layout,
 * rendering the interactive `RegisterFeature` as a client-side island.
 */
import { Metadata } from "next";

import { RegisterFeature } from "@/features/auth/components/register-feature";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { VisuallyHidden } from "@/components/shared/visually-hidden";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up to get started",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <VisuallyHidden>
        <h1>Create an Account</h1>
      </VisuallyHidden>

      <div className="w-full max-w-xl">
        <Card className="border-border/50 bg-background/80 hidden overflow-visible rounded-2xl border shadow-2xl shadow-black/10 backdrop-blur-lg sm:block dark:bg-black dark:shadow-black/50">
          <CardHeader className="p-8 pb-4 text-center">
            <h2 className="text-primary text-3xl font-bold tracking-tighter">Create an Account</h2>
            <CardDescription className="pt-1">Enter your details below to sign up</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <RegisterFeature />
          </CardContent>
        </Card>

        <div className="block sm:hidden">
          <div className="mb-6 text-center">
            <h2 className="text-primary mb-2 text-3xl font-bold tracking-tighter">
              Create an Account
            </h2>
            <p className="text-muted-foreground text-sm">Enter your details below to sign up</p>
          </div>
          <RegisterFeature />
        </div>
      </div>

      <footer className="text-foreground-muted absolute bottom-4 px-4 text-center text-xs sm:bottom-4">
        <p>&copy; {new Date().getFullYear()} This is an open-source boilerplate.</p>
      </footer>
    </main>
  );
}
