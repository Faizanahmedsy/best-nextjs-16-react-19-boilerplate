/**
 * @file Container component for the Register feature.
 *
 * @architecture
 * This client component acts as the bridge between the `useRegisterForm` hook (logic)
 * and the `RegisterForm` component (UI), ensuring a clean separation of concerns.
 */
"use client";

import { RegisterForm } from "@/features/auth/components/register-form";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";

/**
 * Renders the complete, interactive registration feature.
 */
export function RegisterFeature() {
  const registerProps = useRegisterForm();
  return <RegisterForm {...registerProps} />;
}
