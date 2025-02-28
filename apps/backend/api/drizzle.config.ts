import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.ts",
  out: "./utils/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
