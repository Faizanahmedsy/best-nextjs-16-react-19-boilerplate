"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import type { LoginData } from "@/features/auth/types/auth.types";

import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { type ActionState, createServerAction } from "@/api/server-wrapper";

export async function loginAction(
  prevState: ActionState<LoginData>,
  formData: FormData
): Promise<ActionState<LoginData>> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please check your inputs.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // 1. Run the Logic
  const result = await createServerAction(
    "Login User",
    async () => {
      // A. API Call (Fastest possible fetch)
      const response = await apiClient<LoginData>(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // B. Parallel Cookie Setting (Saves ~10-20ms)
      const { accessToken, refreshToken } = response.data;
      const cookieStore = await cookies();
      const isProduction = process.env.NODE_ENV === "production";

      await Promise.all([
        cookieStore.set("accessToken", accessToken, {
          httpOnly: true,
          secure: isProduction,
          path: "/",
          maxAge: 15 * 60,
          sameSite: "lax",
        }),
        cookieStore.set("refreshToken", refreshToken, {
          httpOnly: true,
          secure: isProduction,
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "lax",
        }),
      ]);

      return response.data;
    },
    { email, password },
    {
      // Disable Success Toast (Speed Optimization)
      showSuccessToast: false,
      showErrorToast: true,
    }
  );

  // 2. Immediate Server Redirect (The "Fast" Part)
  // If success, we kill the process here and send 303 to browser.
  // Logs will NOT show for success, but will show for errors.
  if (result.success) {
    redirect("/dashboard");
  }

  return result;
}
