import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
  });

  test("should login successfully and redirect", async ({ page }) => {
    if (!email || !password) {
      console.warn(
        "⚠️ Skipping Login Test: E2E_TEST_EMAIL or E2E_TEST_PASSWORD not set in .env.local"
      );
      test.skip();
      return;
    }

    await page.goto("/login");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password", { exact: true }).fill("wrongpassword");

    await page.getByRole("button", { name: "Sign in" }).click();

    const errorMsg = page.locator("main").getByText(/Invalid|Unauthorized/i);
    await expect(errorMsg).toBeVisible();
  });
});
