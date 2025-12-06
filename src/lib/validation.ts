import * as z from "zod";

import type { ActionState } from "@/api/server-wrapper";

/**
 * Validates a `FormData` object against a Zod schema.
 *
 * This helper handles the Zod v4 error formatting using `z.treeifyError`
 * and maps it to a flat structure suitable for UI field errors.
 *
 * @template T - The inferred output type of the Zod schema.
 * @param formData - The raw FormData from the Server Action.
 * @param schema - The Zod schema to validate against.
 * @returns An object containing either the parsed data or a standardized error state.
 */
export function validateFormData<T>(
  formData: FormData,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errorState: ActionState<unknown> } {
  const rawData = Object.fromEntries(formData);
  const validatedFields = schema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);
    const fieldErrors: Record<string, string[]> = {};

    // Transform Zod v4 error tree into a flat string array map
    Object.entries(errorTree).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map(String);
      }
    });

    return {
      success: false,
      errorState: {
        success: false,
        message: "Please check your inputs.",
        fieldErrors,
      },
    };
  }

  return { success: true, data: validatedFields.data };
}
