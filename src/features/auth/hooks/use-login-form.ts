/**
 * @file This is the "Smart Hook" for the Login feature.
 *
 * @architecture
 * It encapsulates all state management, server action interactions, and event handling logic,
 * exposing a clean, simplified API to the "Dumb" presentational component.
 * This pattern (Smart Hook, Dumb Component) enhances testability, reusability, and separation of concerns.
 */

"use client";

import { type ChangeEvent, useState } from "react";

import { loginAction } from "@/features/auth/actions/login.action";
import type { LoginData } from "@/features/auth/types/auth.types";

import { useServerAction } from "@/hooks/use-server-action";

import { type ActionState } from "@/api/server-wrapper";

/**
 * Manages the complete state and logic for the login form.
 *
 * @returns An object containing state and handlers for the LoginForm component.
 */
export interface UseLoginFormReturn {
  state: ActionState<LoginData>;
  action: (formData: FormData) => void;
  isPending: boolean;

  isPasswordFocused: boolean;
  isPasswordVisible: boolean;
  isPasswordError: boolean;
  emailLength: number;

  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordFocus: () => void;
  handlePasswordBlur: () => void;
  handlePasswordVisibilityChange: (isVisible: boolean) => void;
}

/**
 * Custom hook to manage Login Form logic.
 */
export function useLoginForm(): UseLoginFormReturn {
  const [state, action, isPending] = useServerAction(loginAction);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailLength, setEmailLength] = useState(0);

  const isPasswordError = !!state.message?.toLowerCase().includes("password");

  /**
   * Handles the change event for the email input to track its length for the avatar.
   * @param e - The React change event from the input element.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  const handlePasswordVisibilityChange = (isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
  };

  return {
    state,
    action,
    isPending,
    isPasswordFocused,
    isPasswordVisible,
    isPasswordError,
    emailLength,
    handleEmailChange,
    handlePasswordFocus,
    handlePasswordBlur,
    handlePasswordVisibilityChange,
  };
}
