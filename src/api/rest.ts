import { type FetchOptions, apiClient } from "@/api/client";

// <--- Import it here

type QueryParams = Record<string, string | number | boolean | undefined | null>;

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
 * 🌐 REST Client
 * A sophisticated wrapper for HTTP verbs.
 */
export const Rest = {
  get: <T>(endpoint: string, params?: QueryParams, options?: FetchOptions) => {
    const url = `${endpoint}${buildQueryString(params)}`;
    // Now this is safe because 'options' matches 'apiClient' expectations
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
