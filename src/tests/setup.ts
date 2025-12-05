import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatically unmount components after each test to prevent leaks
afterEach(() => {
  cleanup();
});
