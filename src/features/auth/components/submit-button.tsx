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
 * 1.  **Zero Client-Side JavaScript for State:** The pending state is managed by React itself,
 *     contributing to a smaller client bundle and better performance.
 * 2.  **Decoupling:** The button doesn't need to know anything about the server action or
 *     the form's state. It's a truly "dumb," reusable component that just reacts to the
 *     form's status.
 * 3.  **Improved DX:** It automatically disables itself during submission to prevent
 *     double-clicks, a common requirement for all forms.
 */
"use client";

import * as React from "react";

// <--- Import React
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

// <--- Only import the Button component

import { cn } from "@/lib/utils";

/**
 * The props for the SubmitButton component. It infers all props from the underlying
 * Button component and adds its own custom props.
 */
interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  // <--- THE FIX
  /**
   * The text to display when the form is not in a pending state.
   * @default "Sign In"
   */
  buttonText?: string;
  /**
   * The text to display next to the spinner when the form is submitting.
   * @default "Submitting..."
   */
  pendingText?: string;
}

/**
 * ♿ **Form Submit Button**
 *
 * A specialized button for use inside forms that automatically shows a loading
 * spinner and disables itself based on the form's submission status.
 *
 * @example
 * // Inside a Server Component with a form
 * <form action={myServerAction}>
 *   <SubmitButton buttonText="Create User" pendingText="Creating..." />
 * </form>
 */
export function SubmitButton({
  buttonText = "Sign in",
  pendingText = " Signing in...",
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
