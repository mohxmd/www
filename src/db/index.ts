import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql/web";
import * as schema from "./schema";

function getTursoConfig() {
  if (!TURSO_DATABASE_URL) {
    throw new Error("Missing TURSO_DATABASE_URL. Set it in Vercel environment variables or .env.");
  }

  if (!TURSO_AUTH_TOKEN) {
    throw new Error("Missing TURSO_AUTH_TOKEN. Set it in Vercel environment variables or .env.");
  }

  return {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  };
}

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export const getDb = () => {
  db ??= drizzle({
    connection: getTursoConfig(),
    schema,
  });

  return db;
};

export * from "./schema";
