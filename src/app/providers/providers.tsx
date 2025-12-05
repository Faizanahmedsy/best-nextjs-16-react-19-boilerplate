"use client";

import * as React from "react";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "@/app/providers/theme-provider";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  );
}
