import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { resolveScriptDatabaseConfig } from "./db/config";

const { url, authToken } = resolveScriptDatabaseConfig(process.env);

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
