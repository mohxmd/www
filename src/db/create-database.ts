import { drizzle as drizzleWeb } from "drizzle-orm/libsql/web";
import { drizzle as drizzleSqlite3 } from "drizzle-orm/libsql/sqlite3";
import { createClient as createWebClient } from "@libsql/client/web";
import { createClient as createSqlite3Client } from "@libsql/client/sqlite3";
import * as schema from "./schema";

type CreateDatabaseOptions = {
  authToken?: string | undefined;
  url: string;
};

export async function createDatabase({ url, authToken }: CreateDatabaseOptions) {
  if (!url.startsWith("file:")) {
    return drizzleWeb(createWebClient({ url, ...(authToken ? { authToken } : {}) }), {
      schema,
    });
  }

  return drizzleSqlite3(createSqlite3Client({ url }), { schema });
}
