CREATE TABLE IF NOT EXISTS "chat_conversation" (
  "id" text PRIMARY KEY NOT NULL,
  "secret_hash" text NOT NULL,
  "status" text DEFAULT 'open' NOT NULL,
  "created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "last_activity_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expires_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "chat_conversation_status_idx"
  ON "chat_conversation" ("status");

CREATE INDEX IF NOT EXISTS "chat_conversation_expires_at_idx"
  ON "chat_conversation" ("expires_at");

CREATE TABLE IF NOT EXISTS "chat_message" (
  "id" text PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL,
  "sender" text NOT NULL,
  "body" text NOT NULL,
  "telegram_message_id" integer,
  "created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("conversation_id") REFERENCES "chat_conversation" ("id") ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS "chat_message_conversation_created_idx"
  ON "chat_message" ("conversation_id", "created_at");

CREATE INDEX IF NOT EXISTS "chat_message_telegram_message_idx"
  ON "chat_message" ("telegram_message_id");

CREATE TABLE IF NOT EXISTS "chat_telegram_map" (
  "telegram_message_id" integer PRIMARY KEY NOT NULL,
  "conversation_id" text NOT NULL,
  "message_id" text NOT NULL,
  "created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("conversation_id") REFERENCES "chat_conversation" ("id") ON DELETE cascade,
  FOREIGN KEY ("message_id") REFERENCES "chat_message" ("id") ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS "chat_telegram_map_conversation_idx"
  ON "chat_telegram_map" ("conversation_id");

CREATE UNIQUE INDEX IF NOT EXISTS "chat_telegram_map_message_idx"
  ON "chat_telegram_map" ("message_id");
