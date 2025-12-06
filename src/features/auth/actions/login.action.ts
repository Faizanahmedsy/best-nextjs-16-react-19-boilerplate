"use server";

import { redirect } from "next/navigation";

import { loginSchema } from "@/features/auth/schemas/login.schema";
import type { LoginData } from "@/features/auth/types/auth.types";

import { createApiAction } from "@/lib/safe-action";
import { createSession } from "@/lib/session";

import { API_ENDPOINTS } from "@/api/endpoints";
import { http } from "@/api/http";

export const loginAction = createApiAction({
  name: "Login User",
  schema: loginSchema,

  handler: async ({ email, password }) => {
    const response = await http.post<LoginData>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  onSuccess: async (data) => {
    await createSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    redirect("/dashboard");
  },
});
