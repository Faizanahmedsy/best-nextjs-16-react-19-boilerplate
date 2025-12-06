import { isRedirectError } from "next/dist/client/components/redirect-error";

import { z } from "zod";

import { logger } from "@/lib/logger";
import { validateFormData } from "@/lib/validation";

/**
 * Defines the shape of the state object returned by a Server Action.
 * This is used by `useServerAction` to manage form state.
 * @template T The expected data type on a successful action.
 */
export type ActionState<T> = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
  /*
   * Development-only debug information for inspecting action behavior.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _debug?: any;
  _toast?: { type: "success" | "error" | "warning"; message: string };
};

/**
 * Configuration object for the `createApiAction` factory.
 * @template TInput The type of the validated form data.
 * @template TOutput The type of the data returned by the handler.
 */
type ActionDefinition<TInput, TOutput> = {
  /** A descriptive name for the action, used for logging. */
  name: string;
  /** The Zod schema to validate the FormData against. */
  schema: z.ZodSchema<TInput>;
  /** The core logic of the action (e.g., calling an external API). */
  handler: (data: TInput) => Promise<TOutput>;
  /** An optional callback that runs after a successful handler execution (e.g., setting cookies, revalidating cache). */
  onSuccess?: (data: TOutput) => Promise<void>;
  /** If true, a success toast will be signaled in the action state. Defaults to false. */
  showSuccessToast?: boolean;
  /** A custom message for the success toast. Defaults to "Success". */
  successMessage?: string;
};

/**
 * **Server Action Factory**
 *
 * A higher-order function to create robust, type-safe, and reusable Server Actions.
 * It standardizes validation, error handling, logging, and state management.
 *
 * @architecture
 * This factory mimics the pattern of a mutation library like TanStack Query (`useMutation`)
 * but is designed specifically for Next.js Server Actions that interact with forms.
 * It centralizes all the boilerplate logic required for a production-grade action.
 *
 * @param definition - The configuration object that defines the action's behavior.
 * @returns An asynchronous Server Action function compatible with the `action` prop on `<form>` elements.
 *
 * @example
 * export const loginAction = createApiAction({
 *   name: "Login User",
 *   schema: loginSchema,
 *   handler: async (data) => api.auth.login(data),
 *   onSuccess: async (data) => createSession(data.tokens),
 * });
 */
export function createApiAction<TInput, TOutput>(definition: ActionDefinition<TInput, TOutput>) {
  /**
   * The returned Server Action function.
   * @param prevState - The previous state of the action, provided by `useActionState`.
   * @param formData - The `FormData` submitted from the client form.
   * @returns A new `ActionState` object reflecting the outcome of the action.
   */
  return async (
    prevState: ActionState<TOutput>,
    formData: FormData
  ): Promise<ActionState<TOutput>> => {
    const start = performance.now();
    const { name, schema, handler, onSuccess, showSuccessToast, successMessage } = definition;

    const validation = validateFormData(formData, schema);
    if (!validation.success) {
      return validation.errorState as ActionState<TOutput>;
    }

    try {
      const data = await handler(validation.data);

      if (onSuccess) {
        await onSuccess(data);
      }

      const duration = Math.round(performance.now() - start);

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
      // Note: Next.js's `redirect()` works by throwing a specific error. If we don't
      // catch it and re-throw it, the redirect will be blocked, and the user
      // will be stuck on the form.
      if (isRedirectError(error)) {
        throw error;
      }

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
