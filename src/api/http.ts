import { type FetchOptions, apiClient } from "@/api/client";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Clean Query String Builder
 * Removes null/undefined values to keep URLs clean.
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
 * 🌐 HTTP Client
 * A robust wrapper for REST operations.
 */
export const http = {
  get: <T>(endpoint: string, params?: QueryParams, options?: FetchOptions) => {
    const url = `${endpoint}${buildQueryString(params)}`;
    return apiClient<T>(url, { method: "GET", ...options });
  },

  getById: <T>(
    baseEndpoint: string,
    id: string | number,
    params?: QueryParams,
    options?: FetchOptions
  ) => {
    const url = `${baseEndpoint}/${id}${buildQueryString(params)}`;
    return apiClient<T>(url, { method: "GET", ...options });
  },

  post: <TResponse, TPayload = unknown>(
    endpoint: string,
    payload: TPayload,
    options?: FetchOptions
  ) => {
    return apiClient<TResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      ...options,
    });
  },

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

  put: <TResponse, TPayload = unknown>(
    endpoint: string,
    payload: TPayload,
    options?: FetchOptions
  ) => {
    return apiClient<TResponse>(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
      ...options,
    });
  },

  delete: <T>(endpoint: string, options?: FetchOptions) => {
    return apiClient<T>(endpoint, { method: "DELETE", ...options });
  },
};
