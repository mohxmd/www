import { drizzle as drizzleWeb } from "drizzle-orm/libsql/web";
import { drizzle as drizzleSqlite3 } from "drizzle-orm/libsql/sqlite3";
import type { Client as LibsqlWebClient } from "@libsql/client/web";
import { createClient as createSqlite3Client } from "@libsql/client/sqlite3";
import { createClient as createServerlessClient } from "@tursodatabase/serverless/compat";
import * as schema from "./schema";

type CreateDatabaseOptions = {
  authToken?: string | undefined;
  url: string;
};

export async function createDatabase({ url, authToken }: CreateDatabaseOptions) {
  if (!url.startsWith("file:")) {
    const client = createServerlessClient({ url, ...(authToken ? { authToken } : {}) });
    return drizzleWeb(client as unknown as LibsqlWebClient, { schema });
  }

  return drizzleSqlite3(createSqlite3Client({ url }), { schema });
}
