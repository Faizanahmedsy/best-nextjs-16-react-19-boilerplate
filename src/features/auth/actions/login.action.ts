"use server";

import { redirect } from "next/navigation";

// Schemas & Types
import { loginSchema } from "@/features/auth/schemas/login.schema";
import type { LoginData } from "@/features/auth/types/auth.types";

import type { ActionState } from "@/lib/safe-action";
import { createSession } from "@/lib/session";

import { API_ENDPOINTS } from "@/api/endpoints";
// Infrastructure
import { http } from "@/api/http";

/**
 * **Server Action: Authenticate User**
 *
 * This action orchestrates the entire login flow by composing reusable,
 * single-responsibility modules.
 *
 * @param prevState - The previous state from `useServerAction`.
 * @param formData - The `FormData` submitted by the login form.
 * @returns A new `ActionState` object to update the UI.
 */
export async function loginAction(
  prevState: ActionState<LoginData>,
  formData: FormData
): Promise<ActionState<LoginData>> {
  // The http.post method, when used in Action Mode, handles everything:
  // 1. Validates `formData` against `loginSchema`.
  // 2. If valid, calls the handler function with the typed data.
  // 3. If invalid, returns a structured error state for the UI.
  // 4. Catches errors from the handler and returns a standardized error state.
  // 5. On success, calls the `onSuccess` callback for side-effects.
  return await http.post(API_ENDPOINTS.AUTH.LOGIN, formData, loginSchema, {
    /**
     * This callback runs ONLY after a successful API call.
     * It's the perfect place for server-side side-effects.
     * @param data - The `LoginData` returned from the API.
     */
    onSuccess: async (data) => {
      // A. Set HttpOnly cookies for the session.
      await createSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      // B. Redirect to the dashboard for the fastest possible navigation.
      redirect("/dashboard");
    },
  });
}
