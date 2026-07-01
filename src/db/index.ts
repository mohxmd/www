import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";

import * as schema from "./schema";

const localUrl = "file:local.db";
const url =
  process.env.DATABASE_URL ?? (import.meta.env.DEV ? localUrl : (TURSO_DATABASE_URL ?? localUrl));
const authToken = TURSO_AUTH_TOKEN;
const client = createClient({ url, ...(authToken ? { authToken } : {}) });

export const db = drizzle(client, { schema });
export * from "./schema";
