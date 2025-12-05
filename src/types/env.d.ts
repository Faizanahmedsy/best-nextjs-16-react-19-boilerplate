declare namespace NodeJS {
  interface ProcessEnv {
    // Server Side
    NODE_ENV: "development" | "production" | "test";
    // DATABASE_URL: string; // Uncomment when needed
    // AUTH_SECRET: string;  // Uncomment when needed

    // Client Side (Must start with NEXT_PUBLIC_)
    // NEXT_PUBLIC_API_URL: string;
  }
}
