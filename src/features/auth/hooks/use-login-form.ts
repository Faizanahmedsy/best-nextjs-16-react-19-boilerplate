/**
 * @file This is the "Smart Hook" for the Login feature.
 *
 * @architecture
 * It encapsulates all state management, server action interactions, and event handling logic,
 * exposing a clean, simplified API to the "Dumb" presentational component.
 * This pattern (Smart Hook, Dumb Component) enhances testability, reusability, and separation of concerns.
 */
"use client";

import { useState, useTransition } from "react";

import { loginAction } from "@/features/auth/actions/login.action";

import { useServerAction } from "@/hooks/use-server-action";

/**
 * Manages the complete state and logic for the login form.
 *
 * @returns An object containing state and handlers for the LoginForm component.
 */
export function useLoginForm() {
  const [state, action, isActionPending] = useServerAction(loginAction);

  // A local transition can be used for optimistic UI updates if needed,
  // but here we mainly rely on the server action's pending state.
  const [isTransitionPending] = useTransition();

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [emailLength, setEmailLength] = useState(0);

  /**
   * Handles the change event for the email input to track its length for the avatar.
   * @param e - The React change event from the input element.
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailLength(e.target.value.length);
  };

  /**
   * Sets the password focus state to true, triggering the avatar's "cover eyes" animation.
   */
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  /**
   * Sets the password focus state to false, triggering the avatar's "uncover eyes" animation.
   */
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  // The total pending state combines the server action and any local transitions.
  const isPending = isActionPending || isTransitionPending;

  return {
    state,
    action,
    isPending,
    isPasswordFocused,
    emailLength,
    handleEmailChange,
    handlePasswordFocus,
    handlePasswordBlur,
  };
}

// Export the return type of the hook for strong typing in the component
export type UseLoginFormReturn = ReturnType<typeof useLoginForm>;
