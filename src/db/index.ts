import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { resolveRuntimeDatabaseConfig } from "../../db/config";

import * as schema from "./schema";

const { url, authToken } = resolveRuntimeDatabaseConfig({
  databaseUrlOverride: process.env.DATABASE_URL,
  isDev: import.meta.env.DEV,
  tursoUrl: TURSO_DATABASE_URL,
  tursoAuthToken: TURSO_AUTH_TOKEN,
});
const client = createClient({ url, ...(authToken ? { authToken } : {}) });

export const db = drizzle(client, { schema });
export * from "./schema";
