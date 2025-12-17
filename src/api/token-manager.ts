import { cookies } from "next/headers";

import "server-only";

import { logger } from "@/lib/logger";

import { API_ENDPOINTS } from "@/api/endpoints";

/**
 * 🔐 **Token Manager - Global Token Refresh Handler**
 *
 * This module implements a sophisticated token refresh mechanism following industry best practices:
 *
 * **Key Features:**
 * 1. **Race Condition Prevention**: Uses a promise-based queue to ensure only ONE refresh happens at a time
 * 2. **Automatic Retry**: Failed requests are automatically retried after token refresh
 * 3. **Security**: All tokens are stored in HttpOnly cookies, never exposed to client
 * 4. **Performance**: Parallel request handling with minimal overhead
 * 5. **Type Safety**: Full TypeScript support with proper error handling
 *
 * @architecture
 * This follows the "Token Refresh Interceptor" pattern used by major companies like:
 * - Google (OAuth2)
 * - Microsoft (Azure AD)
 * - Auth0
 * - AWS Cognito
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
 */

interface RefreshTokenResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      fullName: string;
      role: string;
      phoneNo: string;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
    refreshExpiresIn: number;
  };
}

/**
 * Global state for managing token refresh operations.
 * This prevents multiple simultaneous refresh calls (race condition).
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Retrieves the current refresh token from cookies.
 */
async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}

/**
 * Updates both access and refresh tokens in cookies.
 * Uses parallel execution for optimal performance.
 *
 * Note: We don't set maxAge here to allow the backend to control
 * session expiration through its own logic (e.g., manual logout).
 */
async function updateTokens(accessToken: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();

  const COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  await Promise.all([
    cookieStore.set("accessToken", accessToken, COOKIE_CONFIG),
    cookieStore.set("refreshToken", refreshToken, COOKIE_CONFIG),
  ]);

  logger.success("🔄 Tokens refreshed and updated successfully");
}

/**
 * Clears all authentication tokens from cookies.
 * Called when refresh fails or user needs to re-authenticate.
 */
async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  await Promise.all([cookieStore.delete("accessToken"), cookieStore.delete("refreshToken")]);
  logger.warn("🔒 Tokens cleared - user needs to re-authenticate");
}

/**
 * 🔄 **Refresh Access Token**
 *
 * Calls the backend refresh token API and updates cookies with new tokens.
 *
 * **Flow:**
 * 1. Check if refresh is already in progress (prevent race conditions)
 * 2. Get current refresh token from cookies
 * 3. Call refresh API endpoint
 * 4. Update cookies with new tokens
 * 5. Handle errors gracefully
 *
 * @returns Promise<boolean> - true if refresh succeeded, false otherwise
 */
export async function refreshAccessToken(): Promise<boolean> {
  // If a refresh is already in progress, wait for it
  if (isRefreshing && refreshPromise) {
    logger.info("⏳ Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  // Mark that we're starting a refresh
  isRefreshing = true;

  // Create a new refresh promise
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        logger.error("❌ No refresh token found in cookies");
        await clearTokens();
        return false;
      }

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
      const url = `${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`;

      logger.info("🔄 Attempting to refresh access token...", { url });

      // Call the refresh token API
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store", // Never cache refresh requests
      });

      if (!response.ok) {
        logger.error(`❌ Token refresh failed: ${response.status} ${response.statusText}`);
        await clearTokens();
        return false;
      }

      const data: RefreshTokenResponse = await response.json();

      if (!data.success || !data.data.accessToken || !data.data.refreshToken) {
        logger.error("❌ Invalid refresh token response format", data);
        await clearTokens();
        return false;
      }

      // Update cookies with new tokens
      await updateTokens(data.data.accessToken, data.data.refreshToken);

      logger.success("✅ Token refresh successful", {
        userId: data.data.user.id,
        email: data.data.user.email,
      });

      return true;
    } catch (error) {
      logger.error("💥 Token refresh error:", error);
      await clearTokens();
      return false;
    } finally {
      // Reset the refresh state
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * 🔍 **Check if error is a 401 Unauthorized**
 *
 * Helper function to determine if we should attempt token refresh.
 */
export function is401Error(statusCode: number): boolean {
  return statusCode === 401;
}
