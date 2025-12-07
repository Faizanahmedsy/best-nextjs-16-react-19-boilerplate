/**
 * @file Unit Tests for the "Dumb" RegisterForm component.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UseRegisterFormReturn } from "@/features/auth/hooks/use-register-form";

import { RegisterForm } from "../register-form";

// 1. Hoist the mock. This is crucial for it to be applied before imports.
const { useFormStatusMock } = vi.hoisted(() => {
  return { useFormStatusMock: vi.fn() };
});

// 2. Mock the 'react-dom' module to use our mock for the hook.
vi.mock("react-dom", async (importOriginal) => {
  const original = await importOriginal<typeof import("react-dom")>();
  return {
    ...original,
    useFormStatus: useFormStatusMock,
  };
});

// A factory to create a standard set of props for each test.
const createTestProps = (
  overrides: Partial<UseRegisterFormReturn> = {}
): UseRegisterFormReturn => ({
  state: { success: false },
  action: vi.fn(),
  isPending: false, // This is still needed for the <input> elements
  isPasswordVisible: false,
  handlePasswordVisibilityChange: vi.fn(),
  ...overrides,
});

describe("RegisterForm Component", () => {
  // 3. Reset the mock before each test to ensure a clean state.
  beforeEach(() => {
    useFormStatusMock.mockReturnValue({ pending: false });
  });

  it("should render all form fields with correct accessible labels", () => {
    const props = createTestProps();
    render(<RegisterForm {...props} />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
  });

  // ... (other successful tests remain unchanged)

  it("should display field-specific validation errors", () => {
    const props = createTestProps({
      state: { success: false, fieldErrors: { email: ["Invalid email"] } },
    });
    render(<RegisterForm {...props} />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("should display a global error message for cross-field validation", () => {
    const props = createTestProps({
      state: { success: false, fieldErrors: { confirmPassword: ["Passwords do not match"] } },
    });
    render(<RegisterForm {...props} />);
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("should disable all inputs and the submit button when `isPending` is true", () => {
    // ✅ THE FIX: Tell the hook to return a pending state for this specific test.
    useFormStatusMock.mockReturnValue({ pending: true });

    // We still pass the prop for the <input> elements.
    const props = createTestProps({ isPending: true });
    render(<RegisterForm {...props} />);

    // Assert inputs are disabled
    expect(screen.getByLabelText("Full Name")).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByLabelText("Confirm Password")).toBeDisabled();

    // Now, the button will correctly render its pending text because the hook is mocked.
    const button = screen.getByRole("button", { name: /signing up/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it("should call the password visibility handler when the toggle is clicked", () => {
    const props = createTestProps();
    render(<RegisterForm {...props} />);
    const visibilityToggles = screen.getAllByRole("button", { name: /show password/i });
    fireEvent.click(visibilityToggles[0]);
    expect(props.handlePasswordVisibilityChange).toHaveBeenCalledWith(true);
  });
});
