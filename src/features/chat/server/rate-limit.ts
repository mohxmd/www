import { and, count, eq, gte } from "drizzle-orm";
import { chatMessage, type getDb } from "#/db";
import { CHAT_LIMITS } from "../schema";

type Db = ReturnType<typeof getDb>;

export type RateLimitResult =
  | { allowed: true }
  | {
      allowed: false;
      message: string;
    };

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000);
}

async function countVisitorMessagesSince(db: Db, conversationId: string, since: Date) {
  const result = await db
    .select({ value: count() })
    .from(chatMessage)
    .where(
      and(
        eq(chatMessage.conversationId, conversationId),
        eq(chatMessage.sender, "visitor"),
        gte(chatMessage.createdAt, since)
      )
    )
    .get();

  return result?.value ?? 0;
}

export async function checkChatRateLimit(db: Db, conversationId: string): Promise<RateLimitResult> {
  const totalMessages = await countVisitorMessagesSince(db, conversationId, new Date(0));
  if (totalMessages >= CHAT_LIMITS.maxMessagesPerConversation) {
    return {
      allowed: false,
      message: "This chat reached the message limit. Please use Telegram for follow-up.",
    };
  }

  const lastMinute = await countVisitorMessagesSince(db, conversationId, minutesAgo(1));
  if (lastMinute >= CHAT_LIMITS.messagesPerMinute) {
    return { allowed: false, message: "Too many messages. Please wait a minute." };
  }

  const lastHour = await countVisitorMessagesSince(db, conversationId, minutesAgo(60));
  if (lastHour >= CHAT_LIMITS.messagesPerHour) {
    return { allowed: false, message: "Too many messages. Please try again later." };
  }

  return { allowed: true };
}
