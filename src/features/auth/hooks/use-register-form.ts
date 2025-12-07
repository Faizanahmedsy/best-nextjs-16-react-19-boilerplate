/**
 * @file This is the "Smart Hook" for the Register feature.
 *
 * @architecture
 * It encapsulates all state management, server action interactions, and event handling logic,
 * exposing a clean, simplified API to the "Dumb" presentational component (`RegisterForm`).
 */
"use client";

import { useState } from "react";

import { registerAction } from "@/features/auth/actions/register.action";

import { useServerAction } from "@/hooks/use-server-action";

import { type ActionState } from "@/lib/safe-action";

/**
 * The return type for the `useRegisterForm` hook, providing all necessary props
 * for the `RegisterForm` component.
 */
export interface UseRegisterFormReturn {
  state: ActionState<unknown>;
  action: (formData: FormData) => void;
  isPending: boolean;
  isPasswordVisible: boolean;
  handlePasswordVisibilityChange: (isVisible: boolean) => void;
}

/**
 * Custom hook to manage the state and logic of the Registration Form.
 */
export function useRegisterForm(): UseRegisterFormReturn {
  const [state, action, isPending] = useServerAction(registerAction);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordVisibilityChange = (isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
  };

  return {
    state,
    action,
    isPending,
    isPasswordVisible,
    handlePasswordVisibilityChange,
  };
}
