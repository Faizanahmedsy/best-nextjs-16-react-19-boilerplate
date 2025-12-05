import fs from "fs";
import path from "path";
import { styleText } from "util";

/**
 * Helper to manually parse a .env file
 * (Because Node.js doesn't load .env files automatically)
 */
function loadEnv(filename) {
  const fullPath = path.join(process.cwd(), filename);
  if (!fs.existsSync(fullPath)) return {};

  const content = fs.readFileSync(fullPath, "utf-8");
  const env = {};

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    // Ignore comments and empty lines
    if (!trimmed || trimmed.startsWith("#")) return;

    // Split by the first "=" sign
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    // Remove quotes if present
    const cleanValue = value.replace(/^['"](.*)['"]$/, "$1");

    env[key] = cleanValue;
  });

  return env;
}

// 1. Load Environment Variables (Priority: .env.local > .env > System)
const envLocal = loadEnv(".env.local");
const envDefault = loadEnv(".env");

// Combine them into a single object for checking
// We also include process.env to check for system variables (like in Vercel CI)
const effectiveEnv = { ...process.env, ...envDefault, ...envLocal };

const requiredServerEnvs = [
  // "DATABASE_URL",
];

const requiredClientEnvs = ["NEXT_PUBLIC_API_URL"];

let missing = [];

// 2. Perform the Check
[...requiredServerEnvs, ...requiredClientEnvs].forEach((key) => {
  if (!effectiveEnv[key]) {
    missing.push(key);
  }
});

// 3. Report Errors
if (missing.length > 0) {
  console.error(styleText("red", "\n❌ STARTUP ERROR: Missing required environment variables:\n"));
  missing.forEach((key) => {
    console.error(styleText("red", `   - ${key}`));
  });
  console.error(styleText("yellow", "\nPlease check your .env.local file or system variables.\n"));
  process.exit(1);
}

console.log(styleText("green", "✅ Environment variables verified."));
