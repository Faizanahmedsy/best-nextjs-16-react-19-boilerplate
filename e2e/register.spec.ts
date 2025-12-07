/**
 * @file E2E tests for the user registration flow.
 *
 * @architecture
 * These tests simulate a real user interacting with the live application.
 * They cover the "happy path" (successful registration and redirect) as well as
 * common failure scenarios like validation errors.
 */
import { expect, test } from "@playwright/test";

test.describe("Registration Flow", () => {
  // Use unique data for each test run to avoid conflicts
  const testUser = {
    name: `Test User ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: "Password123",
  };

  test("should register a new user successfully and redirect to the dashboard", async ({
    page,
  }) => {
    await page.goto("/register");

    // Expect the heading to be visible
    await expect(page.getByRole("heading", { name: "Create an Account" })).toBeVisible();

    // Fill out the form
    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByLabel("Confirm Password").fill(testUser.password);

    // Click the submission button
    await page.getByRole("button", { name: "Create Account" }).click();

    // Assert that the page redirects to the dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("should show a validation error if passwords do not match", async ({ page }) => {
    await page.goto("/register");

    // Fill out the form with mismatched passwords
    await page.getByLabel("Full Name").fill(testUser.name);
    await page.getByLabel("Email").fill(testUser.email);
    await page.getByLabel("Password").fill(testUser.password);
    await page.getByLabel("Confirm Password").fill("wrongpassword");

    // Click the submission button
    await page.getByRole("button", { name: "Create Account" }).click();

    // Assert that the error message is visible
    const errorMsg = page.getByText("Passwords do not match");
    await expect(errorMsg).toBeVisible();

    // Assert that we are still on the register page
    await expect(page).toHaveURL(/\/register/);
  });

  test("should navigate to the login page when the 'Sign in' link is clicked", async ({ page }) => {
    await page.goto("/register");

    // Click the link to go to the login page
    await page.getByRole("link", { name: /already have an account/i }).click();

    // Assert the URL has changed and the login heading is visible
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
  });
});
