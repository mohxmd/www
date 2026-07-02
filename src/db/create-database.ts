import { drizzle as drizzleHttp } from "drizzle-orm/libsql/http";
import { drizzle as drizzleSqlite3 } from "drizzle-orm/libsql/sqlite3";
import { createClient as createHttpClient } from "@libsql/client/http";
import { createClient as createSqlite3Client } from "@libsql/client/sqlite3";
import * as schema from "./schema";

type CreateDatabaseOptions = {
  authToken?: string | undefined;
  url: string;
};

export async function createDatabase({ url, authToken }: CreateDatabaseOptions) {
  if (!url.startsWith("file:")) {
    return drizzleHttp(createHttpClient({ url, ...(authToken ? { authToken } : {}) }), {
      schema,
    });
  }

  return drizzleSqlite3(createSqlite3Client({ url }), { schema });
}
