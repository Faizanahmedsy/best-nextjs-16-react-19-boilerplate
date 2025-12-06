import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Simulates a browser
    globals: true, // Allows using describe/it/expect without importing
    setupFiles: ["./src/tests/setup.ts"], // Configuration file we will create next
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "e2e"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
