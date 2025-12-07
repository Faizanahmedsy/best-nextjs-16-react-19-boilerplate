/**
 * @file Zod schema for the Registration form.
 *
 * @architecture
 * This schema is used for server-side validation within the Server Action.
 * The `.refine()` method provides cross-field validation to ensure passwords match.
 */
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
