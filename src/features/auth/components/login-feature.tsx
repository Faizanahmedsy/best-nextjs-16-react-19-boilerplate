/**
 * @file Container component for the Login feature.
 *
 * @architecture
 * This component acts as the bridge between the "Smart Hook" and the "Dumb Component".
 * Its sole purpose is to instantiate the hook and pass its props to the presentational layer,
 * keeping the logic and view completely separate.
 */
"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";

/**
 * Renders the complete, interactive login feature.
 */
export function LoginFeature() {
  const loginProps = useLoginForm();
  return <LoginForm {...loginProps} />;
}
