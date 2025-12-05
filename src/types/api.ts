// The shape of a Successful Response (200/201)
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

// The shape of an Error Response (400/401/500)
export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  error: string;
  message: string;
  messages: string[];
  data: Record<string, never>;
}

// The Union Type (What fetch returns before we check .ok)
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
