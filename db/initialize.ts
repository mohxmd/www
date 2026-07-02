import { createClient } from "@libsql/client/sqlite3";

export async function initializeLocalDatabase(url: string) {
  const client = createClient({ url });

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT,
      message TEXT NOT NULL,
      published TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS post_view (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      post TEXT NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS post_view_post_unique ON post_view (post);
  `);

  client.close();
}
