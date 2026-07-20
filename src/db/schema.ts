import { sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamp = customType<{ data: Date; driverData: string }>({
  dataType: () => "text",
  fromDriver: (value) => new Date(`${value.replace(" ", "T").replace(/Z$/, "")}Z`),
  toDriver: (value) =>
    value
      .toISOString()
      .replace("T", " ")
      .replace(/\.\d{3}Z$/, ""),
});

export const postView = sqliteTable("post_view", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  post: text("post").notNull().unique(),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const guestbook = sqliteTable("guestbook", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  message: text("message").notNull(),
  published: timestamp("published")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const chatConversation = sqliteTable(
  "chat_conversation",
  {
    id: text("id").primaryKey(),
    secretHash: text("secret_hash").notNull(),
    status: text("status", { enum: ["open", "closed"] })
      .notNull()
      .default("open"),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    lastActivityAt: timestamp("last_activity_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [
    index("chat_conversation_status_idx").on(table.status),
    index("chat_conversation_expires_at_idx").on(table.expiresAt),
  ]
);

export const chatMessage = sqliteTable(
  "chat_message",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => chatConversation.id, { onDelete: "cascade" }),
    sender: text("sender", { enum: ["visitor", "admin", "system"] }).notNull(),
    body: text("body").notNull(),
    telegramMessageId: integer("telegram_message_id"),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("chat_message_conversation_created_idx").on(table.conversationId, table.createdAt),
    index("chat_message_telegram_message_idx").on(table.telegramMessageId),
  ]
);

export const chatTelegramMap = sqliteTable(
  "chat_telegram_map",
  {
    telegramMessageId: integer("telegram_message_id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => chatConversation.id, { onDelete: "cascade" }),
    messageId: text("message_id")
      .notNull()
      .references(() => chatMessage.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("chat_telegram_map_conversation_idx").on(table.conversationId),
    uniqueIndex("chat_telegram_map_message_idx").on(table.messageId),
  ]
);
