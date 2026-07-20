import { and, eq, lt } from "drizzle-orm";
import { chatConversation, chatMessage, type getDb } from "#/db";
import { CHAT_LIMITS } from "../schema";

type Db = ReturnType<typeof getDb>;

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Marks conversations closed after their signed browser session expires.
 */
export async function closeExpiredConversations(db: Db) {
  const now = new Date();

  await db
    .update(chatConversation)
    .set({ status: "closed" })
    .where(and(eq(chatConversation.status, "open"), lt(chatConversation.expiresAt, now)));
}

/**
 * Deletes old closed conversations and messages after the retention window.
 */
export async function deleteExpiredChatData(db: Db) {
  const cutoff = daysAgo(CHAT_LIMITS.retentionDays);

  await db.delete(chatMessage).where(lt(chatMessage.createdAt, cutoff));
  await db
    .delete(chatConversation)
    .where(and(eq(chatConversation.status, "closed"), lt(chatConversation.lastActivityAt, cutoff)));
}
