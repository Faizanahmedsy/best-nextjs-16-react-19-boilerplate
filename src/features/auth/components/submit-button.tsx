/**
 * @file A form submission button that automatically handles pending states.
 *
 * @architecture
 * **Why use `useFormStatus`?**
 * This component leverages the `useFormStatus` hook from `react-dom`, which is a new
 * feature in React 19. It provides the pending state of a parent `<form>` without
 * any client-side state management (`useState`).
 *
 * **Benefits:**
 * 1.  **Zero Client-Side JavaScript for State:** The pending state is managed by React itself.
 * 2.  **Decoupling:** The button is a truly "dumb," reusable component.
 * 3.  **Improved DX:** Automatically disables itself during submission.
 */
"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  buttonText?: string;
  pendingText?: string;
}

export function SubmitButton({
  buttonText = "Sign in",
  pendingText = "Signing in...",
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={cn("w-full font-semibold", className)}
      disabled={pending}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}
