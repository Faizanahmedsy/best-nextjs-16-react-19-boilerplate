import { describe, expect, it } from "vitest";

import { loginSchema } from "@/features/auth/schemas/login.schema";

describe("Login Schema Validation", () => {
  it("should validate a correct email and password", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail on invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("should fail on empty password", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
