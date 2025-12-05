"use client";

import * as React from "react";

import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  readonly children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* 
        Later, we will wrap this with:
        <QueryClientProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </QueryClientProvider>
      */}
      {children}
    </ThemeProvider>
  );
}
