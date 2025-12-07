/**
 * @file Server Action for user registration.
 *
 * @architecture
 * This action uses the `createApiAction` factory for consistent validation and state management.
 * The handler is currently a mock that simulates a delay before succeeding.
 * On success, it redirects the user to the main dashboard.
 */
"use server";

import { redirect } from "next/navigation";

import { registerSchema } from "@/features/auth/schemas/register.schema";

import { createApiAction } from "@/lib/safe-action";

/**
 * A mock handler that simulates a successful API call.
 * In a real application, this would call the backend registration endpoint.
 */
const mockApiCall = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const registerAction = createApiAction({
  name: "Register User",
  schema: registerSchema,

  // This handler is static for now, simulating a successful registration.
  handler: async () => {
    await mockApiCall();
    // In a real app, you would return data from your API here.
    return { success: true };
  },

  onSuccess: async () => {
    // After a successful registration, send the user to the dashboard.
    redirect("/dashboard");
  },
});
