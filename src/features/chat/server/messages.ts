import { asc, eq } from "drizzle-orm";
import { chatMessage, type getDb } from "#/db";
import type { ChatMessageDto } from "../types";

type Db = ReturnType<typeof getDb>;

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
