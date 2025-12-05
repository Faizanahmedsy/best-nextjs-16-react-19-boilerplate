import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";
import type { LoginData } from "@/features/auth/types/auth.types";

import type { ActionState } from "@/api/server-wrapper";

type MockReturnType = [ActionState<LoginData>, (formData: FormData) => void, boolean];

const { mockUseServerAction } = vi.hoisted(() => {
  return { mockUseServerAction: vi.fn() };
});

vi.mock("@/hooks/use-server-action", () => ({
  useServerAction: mockUseServerAction,
}));

describe("LoginForm Component", () => {
  it("renders the form with accessibility labels", () => {
    const initialState: MockReturnType = [{ success: false }, vi.fn(), false];
    mockUseServerAction.mockReturnValue(initialState);

    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    const state: MockReturnType = [{ success: false }, vi.fn(), false];
    mockUseServerAction.mockReturnValue(state);

    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("Password", { selector: "input" });
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays validation errors from the server", () => {
    const errorState: MockReturnType = [
      {
        success: false,
        message: "Validation Failed",
        fieldErrors: {
          email: ["Invalid email address"],
          password: ["Password too short"],
        },
      },
      vi.fn(),
      false,
    ];
    mockUseServerAction.mockReturnValue(errorState);

    render(<LoginForm />);

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Password too short")).toBeInTheDocument();
  });

  it("displays global API error messages", () => {
    // Simulate API Error (e.g. 401)
    // The Client extracts 'messages[0]' and passes it as 'message' in ActionState
    const apiErrorState: MockReturnType = [
      {
        success: false,
        message: "No authorization header found",
      },
      vi.fn(),
      false,
    ];
    mockUseServerAction.mockReturnValue(apiErrorState);

    render(<LoginForm />);

    expect(screen.getByText("No authorization header found")).toBeInTheDocument();
  });

  it("disables inputs while submitting", () => {
    const loadingState: MockReturnType = [{ success: false }, vi.fn(), true];
    mockUseServerAction.mockReturnValue(loadingState);

    render(<LoginForm />);

    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password", { selector: "input" })).toBeDisabled();
  });
});
