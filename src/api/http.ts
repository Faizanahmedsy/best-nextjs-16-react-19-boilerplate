import { isRedirectError } from "next/dist/client/components/redirect-error";

import { z } from "zod";

import { logger } from "@/lib/logger";
import type { ActionState } from "@/lib/safe-action";
import { validateFormData } from "@/lib/validation";

import { type FetchOptions, apiClient } from "@/api/client";
import type { ApiSuccessResponse } from "@/types/api";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Builds a query string from an object, automatically filtering out null/undefined values.
 * @param params - The object to convert.
 * @returns A URL-encoded query string (e.g., "?page=1&limit=10").
 */
function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * 🌐 **HTTP Client & Server Action Factory**
 *
 * This is the "World Class" heart of the application's network layer. It provides:
 * 1. Simple, type-safe methods for standard REST operations (`get`, `patch`, etc.).
 * 2. An overloaded `post` method that doubles as a powerful Server Action factory,
 *    handling validation, callbacks, and state management automatically.
 *
 * @architecture This unified client abstracts away the low-level `fetch` and boilerplate
 * logic, allowing Server Actions to be declarative and focused on business logic.
 */
export const http = {
  /**
   * Performs a GET request.
   * @param endpoint - The API endpoint path.
   * @param params - Optional query parameters.
   * @param options - Optional `fetch` options.
   */
  get: <T>(endpoint: string, params?: QueryParams, options?: FetchOptions) => {
    const url = `${endpoint}${buildQueryString(params)}`;
    return apiClient<T>(url, { method: "GET", ...options });
  },

  /**
   * Performs a POST request. This method is overloaded for maximum reusability.
   *
   * **Mode 1: Simple API Call**
   * Use when you just need to send a JSON payload.
   * @example await http.post("/users", { name: "John" });
   *
   * **Mode 2: Full Server Action Handler**
   * Use in your action files to process `FormData`. It handles validation,
   * error state, logging, and callbacks automatically.
   * @example
   * return await http.post(
   *   API_ENDPOINTS.AUTH.LOGIN,
   *   formData,
   *   loginSchema,
   *   { onSuccess: async (data) => createSession(data) }
   * );
   */
  async post<TResponse, TPayload = unknown>(
    endpoint: string,
    payload: TPayload | FormData,
    schemaOrOptions?: z.ZodSchema<TPayload> | FetchOptions,
    callbacks?: {
      onSuccess?: (data: TResponse) => Promise<void>;
    }
  ): Promise<ApiSuccessResponse<TResponse> | ActionState<TResponse>> {
    // --- SERVER ACTION MODE ---
    if (payload instanceof FormData && schemaOrOptions && "parse" in schemaOrOptions) {
      const schema = schemaOrOptions as z.ZodSchema<TPayload>;
      const start = performance.now();

      const validation = validateFormData(payload, schema);
      if (!validation.success) {
        return validation.errorState as ActionState<TResponse>;
      }

      const validatedPayload = validation.data;

      try {
        const response = await apiClient<TResponse>(endpoint, {
          method: "POST",
          body: JSON.stringify(validatedPayload),
        });

        if (callbacks?.onSuccess) {
          await callbacks.onSuccess(response.data as TResponse);
        }

        const duration = Math.round(performance.now() - start);

        return {
          success: true,
          data: response.data,
          _debug:
            process.env.NODE_ENV === "development"
              ? { payload: validatedPayload, response: response.data, duration }
              : undefined,
        };
      } catch (error: unknown) {
        if (isRedirectError(error)) throw error;

        const duration = Math.round(performance.now() - start);
        logger.error(`Action Failed: ${endpoint}`, error);

        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) errorMessage = error.message;

        return {
          success: false,
          message: errorMessage,
          _debug:
            process.env.NODE_ENV === "development"
              ? { payload: validatedPayload, response: { error: errorMessage }, duration }
              : undefined,
        };
      }
    }

    // --- SIMPLE API CALL MODE ---
    return apiClient<TResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Other methods remain simple as they are less likely to be used in complex form actions
  patch: <TResponse, TPayload = unknown>(
    endpoint: string,
    payload: TPayload,
    options?: FetchOptions
  ) => {
    return apiClient<TResponse>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(payload),
      ...options,
    });
  },

  delete: <T>(endpoint: string, options?: FetchOptions) => {
    return apiClient<T>(endpoint, { method: "DELETE", ...options });
  },
};
