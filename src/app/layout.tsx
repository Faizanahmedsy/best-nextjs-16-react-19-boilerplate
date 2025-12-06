import type { Metadata, Viewport } from "next";

import { fontLexend, fontMono, fontSans } from "@/lib/fonts";

import "@/app/globals.css";
import { Providers } from "@/app/providers/providers";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Super Admin",
    template: "%s | Super Admin",
  },
  description: "High-performance Next.js 16 Enterprise Boilerplate",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${fontSans.variable} ${fontMono.variable} ${fontLexend.variable} text-foreground selection:bg-primary/20 selection:text-primary min-h-screen w-full overflow-x-hidden font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
