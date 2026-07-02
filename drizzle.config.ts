import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const useRemote = process.env.USE_REMOTE_DB === "true";
const url = useRemote
  ? process.env.TURSO_DATABASE_URL
  : (process.env.DATABASE_URL ?? "file:local.db");
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error("A Turso database URL is required when USE_REMOTE_DB=true.");
if (!url.startsWith("file:") && !authToken)
  throw new Error("A Turso auth token is required when USE_REMOTE_DB=true.");

const baseConfig = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
} as const;

export default url.startsWith("file:")
  ? defineConfig({ ...baseConfig, dialect: "sqlite", dbCredentials: { url } })
  : defineConfig({
      ...baseConfig,
      dialect: "turso",
      dbCredentials: { url, authToken: authToken! },
    });
