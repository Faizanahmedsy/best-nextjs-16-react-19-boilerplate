// scripts/check-env.mjs
import { styleText } from "util";

const requiredServerEnvs = [
  "DATABASE_URL",
  // "AUTH_SECRET",
];

const requiredClientEnvs = [
  // "NEXT_PUBLIC_API_URL",
];

let missing = [];

[...requiredServerEnvs, ...requiredClientEnvs].forEach((key) => {
  if (!process.env[key]) {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error(styleText("red", "\n❌ STARTUP ERROR: Missing required environment variables:\n"));
  missing.forEach((key) => {
    console.error(styleText("red", `   - ${key}`));
  });
  console.error(styleText("yellow", "\nPlease check your .env.local file.\n"));
  process.exit(1);
}

console.log(styleText("green", "✅ Environment variables verified."));
