/**
 * @file Unit Tests for the "Dumb" LoginForm component.
 *
 * @architecture
 * Since LoginForm is a presentational component, these tests verify its rendering logic
 * in complete isolation. We do not mock hooks here. Instead, we pass props directly
 * to simulate different states (idle, loading, error) and assert that the UI
 * renders correctly and that event handlers are called.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { UseLoginFormReturn } from "@/features/auth/hooks/use-login-form";

import { LoginForm } from "../login-form";

// 1. Create a set of default props for the dumb component.
// This makes our tests DRY and easy to read.
const createTestProps = (overrides: Partial<UseLoginFormReturn> = {}): UseLoginFormReturn => ({
  state: { success: false },
  action: vi.fn(),
  isPending: false,
  isPasswordFocused: false,
  emailLength: 0,
  isPasswordError: false,
  handleEmailChange: vi.fn(),
  handlePasswordFocus: vi.fn(),
  handlePasswordBlur: vi.fn(),
  ...overrides,
});

describe("LoginForm Component", () => {
  it("should render the form with correct accessible labels", () => {
    const props = createTestProps();
    render(<LoginForm {...props} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeInTheDocument();
  });

  it("should call the correct handlers on user interaction", () => {
    const props = createTestProps();
    render(<LoginForm {...props} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password", { selector: "input" });

    // Simulate typing in the email field
    fireEvent.change(emailInput, { target: { value: "test" } });
    expect(props.handleEmailChange).toHaveBeenCalled();

    // Simulate focusing the password field
    fireEvent.focus(passwordInput);
    expect(props.handlePasswordFocus).toHaveBeenCalled();

    // Simulate blurring the password field
    fireEvent.blur(passwordInput);
    expect(props.handlePasswordBlur).toHaveBeenCalled();
  });

  it("should display field-specific validation errors when provided", () => {
    const props = createTestProps({
      state: {
        success: false,
        fieldErrors: { email: ["Invalid email address"] },
      },
    });

    render(<LoginForm {...props} />);
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("should display a global error message when provided", () => {
    const props = createTestProps({
      state: {
        success: false,
        message: "Invalid credentials. Please try again.",
      },
    });

    render(<LoginForm {...props} />);
    expect(screen.getByText("Invalid credentials. Please try again.")).toBeInTheDocument();
  });

  it("should disable inputs when `isPending` is true", () => {
    const props = createTestProps({
      isPending: true,
    });

    render(<LoginForm {...props} />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeDisabled();
  });
});
