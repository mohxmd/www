import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import * as schema from "./schema";

const url =
  TURSO_DATABASE_URL ??
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:local.db";
const authToken = url.startsWith("file:")
  ? undefined
  : (TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN);

if (process.env.VERCEL === "1" && url.startsWith("file:")) {
  throw new Error(
    "Missing Turso runtime configuration. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel."
  );
}

export const db = await (async () => {
  if (!url.startsWith("file:")) {
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
