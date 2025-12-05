/* eslint-disable no-console */
/**
 * A "World Class" lightweight logger for Server Actions.
 * It uses ANSI codes for colors to make logs readable in the VS Code terminal.
 */

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

function getTimestamp() {
  return new Date().toISOString().split("T")[1].slice(0, -1); // HH:mm:ss.ms
}

// Helper to hide passwords/tokens in logs
function sanitize(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitized: Record<string, unknown> = { ...data };
  const sensitiveKeys = ["password", "token", "accessToken", "refreshToken", "authorization"];

  Object.keys(sanitized).forEach((key) => {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "***REDACTED***";
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitize(sanitized[key]);
    }
  });

  return sanitized;
}

export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.cyan}ℹ INFO${COLORS.reset}: ${message}`
    );
    if (data) {
      console.log(`${COLORS.dim}${JSON.stringify(sanitize(data), null, 2)}${COLORS.reset}`);
    }
  },

  success: (message: string, data?: unknown) => {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.green}✔ SUCCESS${COLORS.reset}: ${message}`
    );
    if (data) {
      console.log(`${COLORS.dim}${JSON.stringify(sanitize(data), null, 2)}${COLORS.reset}`);
    }
  },

  warn: (message: string, data?: unknown) => {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.yellow}⚠ WARN${COLORS.reset}: ${message}`
    );
    if (data) {
      console.log(`${COLORS.yellow}${JSON.stringify(sanitize(data), null, 2)}${COLORS.reset}`);
    }
  },

  error: (message: string, error?: unknown) => {
    console.log(
      `${COLORS.dim}[${getTimestamp()}]${COLORS.reset} ${COLORS.red}✖ ERROR${COLORS.reset}: ${message}`
    );
    if (error) {
      if (error instanceof Error) {
        console.log(`${COLORS.red}${error.stack || error.message}${COLORS.reset}`);
      } else {
        console.log(`${COLORS.red}${JSON.stringify(error, null, 2)}${COLORS.reset}`);
      }
    }
  },
};
