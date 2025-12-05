"use client";

import { useActionState, useEffect } from "react";

import { toast } from "sonner";

import type { ActionState } from "@/api/server-wrapper";

export function useServerAction<T, P>(
  action: (state: ActionState<T>, payload: P) => Promise<ActionState<T>>,
  initialState: ActionState<T> = { success: false }
) {
  const [state, dispatch, isPending] = useActionState(action, initialState);

  useEffect(() => {
    if (state._toast) {
      const { type, message } = state._toast;
      if (type === "success") toast.success(message);
      if (type === "error") toast.error(message);
      if (type === "warning") toast.warning(message);
    }

    if (process.env.NODE_ENV === "development" && state._debug) {
      const { endpoint, payload, response, duration, timestamp } = state._debug;
      const isError = !state.success;
      const color = isError ? "red" : "#10b981";
      const icon = isError ? "❌" : "✅";

      /* eslint-disable no-console */
      console.groupCollapsed(
        `%c${icon} Server Action: ${endpoint} %c(${duration}ms) @ ${timestamp}`,
        `color: ${color}; font-weight: bold; font-size: 12px;`,
        "color: gray; font-weight: normal;"
      );
      console.log("%c📥 Payload (Sent)", "color: #3b82f6; font-weight: bold;", payload);
      if (isError) {
        console.error("%c📤 Error Response", "color: red; font-weight: bold;", response);
      } else {
        console.log("%c📤 Response (Received)", "color: #10b981; font-weight: bold;", response);
      }
      console.groupEnd();
      /* eslint-enable no-console */
    }
  }, [state]);

  return [state, dispatch, isPending] as const;
}
