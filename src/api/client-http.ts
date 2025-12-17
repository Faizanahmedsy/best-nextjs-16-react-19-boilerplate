"use client";

/**
 * **Client-Side API Client**
 *
 * Lightweight API client for client-side data fetching.
 * Does NOT use server-only modules like token-manager.
 *
 * @architecture
 * - Client-side only (no "server-only" imports)
 * - Uses fetch API directly
 * - Handles authentication via cookies (automatic)
 * - Type-safe with generics
 *
 * @see For server-side API calls, use src/api/http.ts
 */

/**
 * Client-side fetch wrapper
 */
export async function clientFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Use the local proxy
  const url = `/api/proxy${endpoint}`;

  // Construct the actual backend URL for debugging purposes
  // This helps the developer see where the request is actually going
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      // Try to parse the error response as JSON
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || `HTTP ${response.status}`;

      // 🚨 RICH ERROR LOGGING 🚨
      // This will show up beautifully in the browser console
      const groupLabel = `🔴 API Error: ${options?.method || "GET"} ${endpoint}`;
      console.groupCollapsed(groupLabel);
      console.log("%cBackend URL:", "font-weight: bold; color: #ef4444;", backendUrl);
      console.log("%cProxy URL:", "font-weight: bold; color: #888;", url);
      console.log("%cStatus:", "font-weight: bold;", response.status, response.statusText);
      console.log("%cResponse Body:", "font-weight: bold;", errorData || "No JSON body");
      console.log("%cRequest Options:", "font-weight: bold;", options);
      console.groupEnd();

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Re-throw the error so the caller can handle it (e.g., show a toast)
    throw error;
  }
}

/**
 * Client-side HTTP methods
 */
export const clientHttp = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) => {
    const queryString = params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : "";

    return clientFetch<T>(`${endpoint}${queryString}`, {
      method: "GET",
    });
  },

  post: <T>(endpoint: string, body: unknown) => {
    return clientFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  patch: <T>(endpoint: string, body: unknown) => {
    return clientFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  put: <T>(endpoint: string, body: unknown) => {
    return clientFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete: <T>(endpoint: string) => {
    return clientFetch<T>(endpoint, {
      method: "DELETE",
    });
  },
};
