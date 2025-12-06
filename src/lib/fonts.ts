import { Geist, Geist_Mono, Lexend } from "next/font/google";

// 1. Import Lexend

export const fontSans = Geist({
  variable: "--font-geist-sans", // Keep Geist as a fallback/mono option
  subsets: ["latin"],
});

export const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2. Configure Lexend as the main display font
export const fontLexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Import necessary weights
});
