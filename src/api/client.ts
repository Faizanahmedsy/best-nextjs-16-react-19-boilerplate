import { cookies } from "next/headers";

import { logger } from "@/lib/logger";

import { type ApiResponse } from "@/types/api";

// <--- Import the logger

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
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

  // 1. LOG THE REQUEST
  logger.info(`🚀 API Request: ${options.method || "GET"} ${path}`, {
    url: fullUrl,
    body: options.body ? JSON.parse(options.body as string) : undefined,
    headers, // Logger will redact the token automatically
  });

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // 2. LOG THE RAW STATUS
    if (!response.ok) {
      logger.warn(`API Response Status: ${response.status} ${response.statusText}`);
    }

    // Try to parse JSON, but handle HTML errors (common with 404s/500s)
    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text }; // Fallback if API returns HTML error page
    }

    if (!response.ok) {
      // 3. LOG THE ERROR DETAILS
      logger.error(`❌ API Error Response:`, data);
      throw new Error(data.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // 4. LOG SUCCESS
    logger.success(`✅ API Success: ${path}`, data);

    return data as ApiResponse<T>;
  } catch (error) {
    // 5. LOG NETWORK/FETCH ERRORS
    logger.error(`💥 Network/Fetch Error: ${path}`, error);
    throw error;
  }
}
