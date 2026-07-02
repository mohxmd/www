import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { createDatabase as createResolvedDatabase } from "./create-database";

const url =
  TURSO_DATABASE_URL ??
  process.env.TURSO_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "file:local.db";
const authToken = url.startsWith("file:")
  ? undefined
  : (TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN);

const createRuntimeDatabase = async () => {
  if (process.env.VERCEL === "1" && url.startsWith("file:")) {
    throw new Error(
      "Missing Turso runtime configuration. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel."
    );
  }

  return createResolvedDatabase({ url, authToken });
};

let databasePromise: ReturnType<typeof createRuntimeDatabase> | undefined;

export const getDb = () => {
  databasePromise ??= createRuntimeDatabase();
  return databasePromise;
};

export * from "./schema";
