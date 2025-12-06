import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// 3. NOW, it is safe to import the component.
// By the time this line runs, the mock for `useFormStatus` is already in place.
import { SubmitButton } from "../submit-button";

// 1. Hoist the mock. This creates the 'useFormStatusMock' variable BEFORE anything else.
const { useFormStatusMock } = vi.hoisted(() => {
  return { useFormStatusMock: vi.fn() };
});

// 2. Tell Vitest to use this mock whenever 'react-dom' is imported.
vi.mock("react-dom", async (importOriginal) => {
  const original = await importOriginal<typeof import("react-dom")>();
  return {
    ...original,
    useFormStatus: useFormStatusMock,
  };
});

describe("SubmitButton Component", () => {
  it("should render 'Sign in' and be enabled when not pending", () => {
    // Arrange
    useFormStatusMock.mockReturnValue({ pending: false });

    render(<SubmitButton />);

    const button = screen.getByRole("button", { name: "Sign in" });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should render 'Signing in...' and be disabled when pending", () => {
    // Arrange
    useFormStatusMock.mockReturnValue({ pending: true });

    render(<SubmitButton />);

    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
