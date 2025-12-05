import { cookies } from "next/headers";

import { logger } from "@/lib/logger";

import { type ApiErrorResponse, type ApiSuccessResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

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

  logger.info(`🚀 API Request: ${options.method || "GET"} ${path}`, {
    url: fullUrl,
    body: options.body ? JSON.parse(options.body as string) : undefined,
    headers,
  });

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
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

      const errorMessage =
        errorData.messages?.[0] ||
        errorData.message ||
        `API Error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const successData = data as ApiSuccessResponse<T>;
    logger.success(`✅ API Success: ${path}`, successData);

    return successData;
  } catch (error) {
    logger.error(`💥 Network/Fetch Error: ${path}`, error);
    throw error;
  }
}
