import { cookies } from "next/headers";

import "server-only";

import { logger } from "@/lib/logger";

import { is401Error, refreshAccessToken } from "@/api/token-manager";
import { type ApiErrorResponse, type ApiSuccessResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

/**
 * Extended Error type with additional properties for API errors
 */
interface ApiError extends Error {
  statusCode?: number;
  requiresReauth?: boolean;
  errorData?: ApiErrorResponse;
}

export type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  /**
   * Internal flag to prevent infinite retry loops.
   * When true, the request will NOT be retried after token refresh.
   */
  _isRetry?: boolean;
};

/**
 * 🌐 **Enhanced API Client with Automatic Token Refresh**
 *
 * This is the core HTTP client for all server-side API calls. It implements:
 *
 * **Key Features:**
 * 1. **Automatic 401 Handling**: Detects unauthorized errors and triggers token refresh
 * 2. **Smart Retry Logic**: Automatically retries failed requests after successful refresh
 * 3. **Race Condition Prevention**: Uses token manager to prevent multiple refresh calls
 * 4. **Security**: All tokens stored in HttpOnly cookies, never exposed to client
 * 5. **Performance**: Minimal overhead, parallel execution where possible
 * 6. **Type Safety**: Full TypeScript support with proper error types
 *
 * **Flow:**
 * 1. Make API request with current access token
 * 2. If 401 error → Refresh token
 * 3. If refresh succeeds → Retry original request with new token
 * 4. If refresh fails → Clear tokens and throw error (user must re-login)
 *
 * @architecture
 * This implements the "Token Refresh Interceptor" pattern:
 * - Request → 401 → Refresh → Retry → Success
 * - Used by: Google, Microsoft, Auth0, AWS Cognito, etc.
 *
 * @param endpoint - API endpoint path (e.g., "/users" or "users")
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Promise<ApiSuccessResponse<T>> - Typed API response
 * @throws Error - If request fails after retry or refresh fails
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${path}`;

  const isRetry = options._isRetry || false;
  const logPrefix = isRetry ? "🔄 [RETRY]" : "🚀";

  logger.info(`${logPrefix} API Request: ${options.method || "GET"} ${path}`, {
    url: fullUrl,
    body: options.body ? JSON.parse(options.body as string) : undefined,
    isRetry,
  });

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      cache: options.cache || "no-store",
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;

      logger.warn(`API Error ${response.status}:`, errorData);

      // 🔐 **CRITICAL: 401 Error Handling**
      // If we get a 401 and this is NOT already a retry, attempt token refresh
      if (is401Error(response.status) && !isRetry) {
        logger.warn("🔐 401 Unauthorized detected - attempting token refresh...");

        const refreshSuccess = await refreshAccessToken();

        if (refreshSuccess) {
          logger.info("✅ Token refresh successful - retrying original request...");

          // Retry the original request with the new token
          // Set _isRetry flag to prevent infinite loops
          return apiClient<T>(endpoint, {
            ...options,
            _isRetry: true,
          });
        } else {
          logger.error("❌ Token refresh failed - user must re-authenticate");

          // Refresh failed - throw a specific error
          const error = new Error("Session expired. Please log in again.") as ApiError;
          error.statusCode = 401;
          error.requiresReauth = true;
          throw error;
        }
      }

      // For non-401 errors or retry failures, throw the error
      const errorMessage =
        errorData.messages?.[0] ||
        errorData.message ||
        `API Error: ${response.status} ${response.statusText}`;

      const error = new Error(errorMessage) as ApiError;
      error.statusCode = response.status;
      error.errorData = errorData;
      throw error;
    }

    const successData = data as ApiSuccessResponse<T>;
    logger.success(`✅ API Success: ${path}`, successData);

    return successData;
  } catch (error) {
    // If this is a re-thrown error from above, just pass it through
    if (error instanceof Error && (error as ApiError).statusCode) {
      throw error;
    }

    // Network or other unexpected errors
    logger.error(`💥 Network/Fetch Error: ${path}`, error);
    throw error;
  }
}
