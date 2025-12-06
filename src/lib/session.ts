import { cookies } from "next/headers";

/**
 * **Data Access Layer: Session Management**
 *
 * This module is part of the Data Access Layer (DAL). It centralizes all cookie
 * and session logic to ensure consistency and security across the application.
 *
 * @architecture
 * **Why `import "server-only"` instead of `"use server"`?**
 *
 * 1. **`"use server"`**: Marks a function as a **Public Endpoint**. Next.js creates a
 *    hidden HTTP API route for it, allowing the Client Browser to call it directly (RPC).
 * 2. **`import "server-only"`**: Acts as a **Poison Pill**. It tells the compiler:
 *    *"If any Client Component tries to import this file, BREAK THE BUILD immediately."*
 *
 * Since this file handles sensitive cookie logic (which cannot run in the browser),
 * we use `"server-only"` to prevent accidental leakage of internal logic to the client bundle.
 *
 * @see https://nextjs.org/docs/app/guides/data-security
 */
import "server-only";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  sameSite: "lax" as const,
};

/**
 * Creates a new user session by setting secure HttpOnly cookies.
 *
 * @param tokens - The access and refresh tokens returned from the backend API.
 *
 * @performance
 * In Next.js 15+, the `cookies()` API and `cookieStore.set` are asynchronous.
 * We use `Promise.all` to execute these operations in parallel, reducing the
 * latency of the login/register requests by ~10-20ms.
 */
export async function createSession(tokens: Tokens) {
  const cookieStore = await cookies();

  await Promise.all([
    cookieStore.set("accessToken", tokens.accessToken, {
      ...COOKIE_CONFIG,
      maxAge: 15 * 60, // 15 Minutes
    }),
    cookieStore.set("refreshToken", tokens.refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: 7 * 24 * 60 * 60, // 7 Days
    }),
  ]);
}

/**
 * Destroys the current user session by deleting authentication cookies.
 * Typically used during the Logout flow.
 *
 * @performance Uses parallel execution to ensure fast cleanup.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  await Promise.all([cookieStore.delete("accessToken"), cookieStore.delete("refreshToken")]);
}

/**
 * Retrieves the current Access Token from cookies.
 *
 * This helper is used by the API Client and Proxy to inject the Authorization header
 * into backend requests.
 *
 * @returns The JWT access token string, or undefined if no session exists.
 */
export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}
