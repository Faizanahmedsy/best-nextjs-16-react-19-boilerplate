import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 1. Define Route Constants
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Check for Tokens
  const accessToken = request.cookies.get("accessToken")?.value;

  // 3. Logic: Protect Dashboard Routes
  // If user is trying to access a protected route but has no token
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    // Add ?callbackUrl to redirect back after login (UX best practice)
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Logic: Redirect Logged-In Users away from Login
  // If user is on Login page but ALREADY has a token
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. Allow request to proceed
  return NextResponse.next();
}

/**
 * Matcher Configuration
 * This filters the requests so the proxy only runs on relevant paths.
 * We explicitly ignore static assets to keep performance at 100/100.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
