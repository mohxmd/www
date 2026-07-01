import { sql } from "drizzle-orm";
import { customType, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = customType<{ data: Date; driverData: string }>({
  dataType: () => "text",
  fromDriver: (value) => new Date(`${value.replace(" ", "T").replace(/Z$/, "")}Z`),
  toDriver: (value) => value.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, ""),
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
  published: timestamp("published").notNull().default(sql`CURRENT_TIMESTAMP`),
});
