import { logger } from "@/lib/logger";

export type ActionState<T = unknown> = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
  _toast?: {
    type: "success" | "error" | "warning";
    message: string;
  };
  _debug?: {
    endpoint: string;
    payload: unknown;
    response: unknown;
    duration: number;
    timestamp: string;
  };
};

type ActionOptions = {
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
};

export async function createServerAction<T>(
  endpoint: string,
  logic: () => Promise<T>,
  payload?: unknown,
  options: ActionOptions = {}
): Promise<ActionState<T>> {
  const start = performance.now();

  // Default Options
  const { showSuccessToast = false, showErrorToast = true, successMessage, errorMessage } = options;

  try {
    const result = await logic();
    const duration = Math.round(performance.now() - start);

    return {
      success: true,
      data: result,
      _toast: showSuccessToast
        ? { type: "success", message: successMessage || "Operation successful" }
        : undefined,
      _debug:
        process.env.NODE_ENV === "development"
          ? {
              endpoint,
              payload,
              response: result,
              duration,
              timestamp: new Date().toLocaleTimeString(),
            }
          : undefined,
    };
  } catch (error: any) {
    const duration = Math.round(performance.now() - start);

    logger.error(`Action Failed: ${endpoint}`, error);

    const errorMsg = errorMessage || error.message || "An unexpected error occurred";

    return {
      success: false,
      message: errorMsg,
      _toast: showErrorToast ? { type: "error", message: errorMsg } : undefined,
      _debug:
        process.env.NODE_ENV === "development"
          ? {
              endpoint,
              payload,
              response: { error: error.message, stack: error.stack },
              duration,
              timestamp: new Date().toLocaleTimeString(),
            }
          : undefined,
    };
  }
}
