import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "../login-form";

// -----------------------------------------------------------------------------
// 🛡️ WORLD CLASS MOCKING STRATEGY 🛡️
// -----------------------------------------------------------------------------
const { mockUseServerAction, mockLoginAction } = vi.hoisted(() => {
  return {
    mockUseServerAction: vi.fn(),
    mockLoginAction: vi.fn(),
  };
});

vi.mock("@/hooks/use-server-action", () => ({
  useServerAction: mockUseServerAction,
}));

vi.mock("@/features/auth/actions/login.action", () => ({
  loginAction: mockLoginAction,
}));
// -----------------------------------------------------------------------------

describe("LoginForm Component", () => {
  beforeEach(() => {
    // Reset the mock before each test to ensure isolation
    mockUseServerAction.mockReturnValue([
      { success: false }, // Default state
      vi.fn(), // Mock dispatch
      false, // isPending
    ]);
  });

  it("should render the form with correct accessible labels", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeInTheDocument();
  });

  it("should toggle password visibility when the eye icon is clicked", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText("Password", { selector: "input" });
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();
  });

  it("should display field-specific validation errors from the server", () => {
    mockUseServerAction.mockReturnValue([
      {
        success: false,
        fieldErrors: { email: ["Invalid email address"] },
      },
      vi.fn(),
      false,
    ]);

    render(<LoginForm />);
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("should display a global error message from the server", () => {
    mockUseServerAction.mockReturnValue([
      {
        success: false,
        message: "Invalid credentials. Please try again.",
      },
      vi.fn(),
      false,
    ]);

    render(<LoginForm />);
    expect(screen.getByText("Invalid credentials. Please try again.")).toBeInTheDocument();
  });

  it("should disable inputs while submitting", () => {
    // Arrange: Simulate the hook returning `isPending: true`.
    mockUseServerAction.mockReturnValue([
      { success: false },
      vi.fn(),
      true, // The action is in progress
    ]);

    render(<LoginForm />);

    // Assert: The inputs controlled by this component should be disabled.
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeDisabled();
  });
});
