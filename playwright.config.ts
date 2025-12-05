import { defineConfig, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

/**
 * Manually reads .env.local so we don't need to install 'dotenv'
 */
function loadEnv(file: string) {
  const filePath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf-8");

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return; // Ignore comments

    const [key, ...values] = trimmed.split("=");
    if (key && values.length > 0) {
      // Join values back in case the password has an '=' in it
      const value = values.join("=").replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      process.env[key] = value;
    }
  });
}

// Load the file
loadEnv(".env.local");

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "pipe",
  },
});
