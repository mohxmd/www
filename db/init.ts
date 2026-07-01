import { initializeLocalDatabase } from "./initialize";

const url = process.env.DATABASE_URL ?? "file:local.db";

if (!url.startsWith("file:")) {
  throw new Error("db:init only accepts a local file: database URL.");
}

await initializeLocalDatabase(url);
