import { and, asc, count, eq } from "drizzle-orm";
import { chatMessage, type getDb } from "#/db";
import type { ChatMessageDto } from "../types";

type Db = ReturnType<typeof getDb>;
const FIRST_REPLY_BODY = "Aye, got it. I'll reply here when I'm around.";

/**
 * Converts a database chat row into the stable shape returned by API routes.
 */
export function toMessageDto(message: typeof chatMessage.$inferSelect): ChatMessageDto {
  return {
    id: message.id,
    sender: message.sender,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
  };
}

/**
 * Lists messages in chronological order for one authenticated conversation.
 */
export async function listMessages(db: Db, conversationId: string) {
  const messages = await db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.conversationId, conversationId))
    .orderBy(asc(chatMessage.createdAt))
    .all();

  return messages.map(toMessageDto);
}

/**
 * Creates the one-time acknowledgement shown after the first visitor message.
 *
 * It is stored as a system message so the user still sees it after reloads, but
 * repeated visitor messages in the same conversation do not create duplicates.
 */
export async function createInitialSystemReply(db: Db, conversationId: string) {
  const existingSystemMessages = await db
    .select({ value: count() })
    .from(chatMessage)
    .where(and(eq(chatMessage.conversationId, conversationId), eq(chatMessage.sender, "system")))
    .get();

  if ((existingSystemMessages?.value ?? 0) > 0) return null;

  const reply = {
    id: crypto.randomUUID(),
    conversationId,
    sender: "system" as const,
    body: FIRST_REPLY_BODY,
    telegramMessageId: null,
    createdAt: new Date(),
  };

  await db.insert(chatMessage).values(reply);
  return toMessageDto(reply);
}
