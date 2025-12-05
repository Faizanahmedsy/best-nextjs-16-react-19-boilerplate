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
  } catch (error: unknown) {
    const duration = Math.round(performance.now() - start);

    logger.error(`Action Failed: ${endpoint}`, error);

    let safeErrorMessage = "An unexpected error occurred";
    let safeErrorStack = undefined;

    if (error instanceof Error) {
      safeErrorMessage = error.message;
      safeErrorStack = error.stack;
    } else if (typeof error === "string") {
      safeErrorMessage = error;
    }

    const finalMessage = errorMessage || safeErrorMessage;

    return {
      success: false,
      message: finalMessage,
      _toast: showErrorToast ? { type: "error", message: finalMessage } : undefined,
      _debug:
        process.env.NODE_ENV === "development"
          ? {
              endpoint,
              payload,
              response: { error: safeErrorMessage, stack: safeErrorStack },
              duration,
              timestamp: new Date().toLocaleTimeString(),
            }
          : undefined,
    };
  }
}
