import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";

// 1. Setup the Mock with Hoisting
// This ensures the mock exists before the component imports it
const { mockUseServerAction } = vi.hoisted(() => {
  return { mockUseServerAction: vi.fn() };
});

// 2. Mock the hook module
vi.mock("@/hooks/use-server-action", () => ({
  useServerAction: mockUseServerAction,
}));

describe("LoginForm Component", () => {
  it("renders the form with accessibility labels", () => {
    // Default State
    mockUseServerAction.mockReturnValue([
      { success: false }, // state
      vi.fn(), // action
      false, // isPending
    ]);

    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    // Specific selector to distinguish input from the eye button
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    mockUseServerAction.mockReturnValue([{ success: false }, vi.fn(), false]);
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("Password", { selector: "input" });
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    // Initial: Hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click: Visible
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Check label update
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();
  });

  it("displays validation errors from the server", () => {
    mockUseServerAction.mockReturnValue([
      {
        success: false,
        fieldErrors: {
          email: ["Invalid email address"],
          password: ["Password too short"],
        },
      },
      vi.fn(),
      false,
    ]);

    render(<LoginForm />);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password too short")).toBeInTheDocument();
  });

  it("displays global error messages", () => {
    mockUseServerAction.mockReturnValue([
      {
        success: false,
        message: "Invalid credentials",
      },
      vi.fn(),
      false,
    ]);

    render(<LoginForm />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables inputs while submitting", () => {
    // Pending State = True
    mockUseServerAction.mockReturnValue([
      { success: false },
      vi.fn(),
      true, // <--- isPending is TRUE here
    ]);

    render(<LoginForm />);

    // These checks ensure you applied the disabled={isPending} fix in the component
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeDisabled();
    // Note: SubmitButton handles its own state via useFormStatus,
    // but typically we check inputs here.
  });
});
