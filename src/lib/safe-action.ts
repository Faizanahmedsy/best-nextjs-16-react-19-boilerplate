import { z } from "zod";

import { logger } from "@/lib/logger";
import { validateFormData } from "@/lib/validation";

export type ActionState<T> = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
  _debug?: any;
  _toast?: { type: "success" | "error"; message: string };
};

type ActionDefinition<TInput, TOutput> = {
  name: string;
  schema: z.ZodSchema<TInput>;
  handler: (data: TInput) => Promise<TOutput>;
  onSuccess?: (data: TOutput) => Promise<void>;
  // Options
  showSuccessToast?: boolean;
  successMessage?: string;
};

/**
 * 🏭 Create API Action
 * Mimics the 'useMutation' pattern but for Server Actions.
 */
export function createApiAction<TInput, TOutput>(definition: ActionDefinition<TInput, TOutput>) {
  // This returns the actual Server Action function
  return async (
    prevState: ActionState<TOutput>,
    formData: FormData
  ): Promise<ActionState<TOutput>> => {
    const start = performance.now();
    const { name, schema, handler, onSuccess, showSuccessToast, successMessage } = definition;

    // 1. Validation
    const validation = validateFormData(formData, schema);
    if (!validation.success) {
      return validation.errorState as ActionState<TOutput>;
    }

    try {
      // 2. Execute Handler (API Call)
      const data = await handler(validation.data);

      // 3. Execute OnSuccess (Cookies, etc.)
      if (onSuccess) {
        await onSuccess(data);
      }

      const duration = Math.round(performance.now() - start);

      // 4. Return Success State
      return {
        success: true,
        data,
        _toast: showSuccessToast
          ? { type: "success", message: successMessage || "Success" }
          : undefined,
        _debug:
          process.env.NODE_ENV === "development"
            ? {
                endpoint: name,
                payload: validation.data,
                response: data,
                duration,
                timestamp: new Date().toLocaleTimeString(),
              }
            : undefined,
      };
    } catch (error: unknown) {
      const duration = Math.round(performance.now() - start);
      logger.error(`Action Failed: ${name}`, error);

      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) errorMessage = error.message;
      if (typeof error === "string") errorMessage = error;

      return {
        success: false,
        message: errorMessage,
        _debug:
          process.env.NODE_ENV === "development"
            ? {
                endpoint: name,
                payload: validation.data,
                response: { error: errorMessage },
                duration,
                timestamp: new Date().toLocaleTimeString(),
              }
            : undefined,
      };
    }
  };
}
