import { LOCAL_DATABASE_URL } from "./config";
import { initializeLocalDatabase } from "./initialize";

const url = process.env.DATABASE_URL ?? LOCAL_DATABASE_URL;

if (!url.startsWith("file:")) {
  throw new Error("db:init only accepts a local file: database URL.");
}

await initializeLocalDatabase(url);
