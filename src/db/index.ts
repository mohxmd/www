import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import * as schema from "./schema";

const url =
  process.env.DATABASE_URL ??
  (import.meta.env.DEV ? "file:local.db" : (TURSO_DATABASE_URL ?? "file:local.db"));
const authToken = url.startsWith("file:") ? undefined : TURSO_AUTH_TOKEN;

export const db = await (async () => {
  if (import.meta.env.PROD) {
    const [{ createClient }, { drizzle }] = await Promise.all([
      import("@libsql/client/http"),
      import("drizzle-orm/libsql/http"),
    ]);
    return drizzle(createClient({ url, ...(authToken ? { authToken } : {}) }), { schema });
  }
  const [{ createClient }, { drizzle }] = await Promise.all([
    import("@libsql/client/sqlite3"),
    import("drizzle-orm/libsql/sqlite3"),
  ]);
  return drizzle(createClient({ url }), { schema });
})();

export * from "./schema";
