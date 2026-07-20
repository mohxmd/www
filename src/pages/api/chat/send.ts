import { eq } from "drizzle-orm";
import type { APIRoute } from "astro";
import { chatMessage, getDb } from "#/db";
import { chatSendInputSchema } from "#/features/chat/schema";
import { errorResponse, jsonResponse } from "#/features/chat/server/http";
import { createInitialSystemReply, toMessageDto } from "#/features/chat/server/messages";
import { checkChatRateLimit } from "#/features/chat/server/rate-limit";
import { ensureChatSession, touchChatSession } from "#/features/chat/server/session";
import {
  sendTelegramVisitorMessage,
  storeTelegramMessageMap,
} from "#/features/chat/server/telegram";
import type { ChatSendResponse } from "#/features/chat/types";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const input = chatSendInputSchema.parse(await request.json());
    const db = getDb();
    const session = await ensureChatSession(db, cookies);
    const rateLimit = await checkChatRateLimit(db, session.conversationId);

    if (!rateLimit.allowed) {
      return errorResponse("RATE_LIMITED", rateLimit.message, 429);
    }

    const message = {
      id: crypto.randomUUID(),
      conversationId: session.conversationId,
      sender: "visitor" as const,
      body: input.body,
      telegramMessageId: null,
      createdAt: new Date(),
    };

    await db.insert(chatMessage).values(message);
    const systemMessage = await createInitialSystemReply(db, session.conversationId);

    let deliveredToTelegram = false;
    try {
      const telegram = await sendTelegramVisitorMessage(session.conversationId, input.body);
      deliveredToTelegram = telegram.delivered;

      if (telegram.telegramMessageId) {
        await db
          .update(chatMessage)
          .set({ telegramMessageId: telegram.telegramMessageId })
          .where(eq(chatMessage.id, message.id));
        await storeTelegramMessageMap(
          db,
          telegram.telegramMessageId,
          session.conversationId,
          message.id
        );
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Telegram delivery failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    await touchChatSession(db, cookies, session);

    return jsonResponse<ChatSendResponse>({
      message: toMessageDto(message),
      ...(systemMessage ? { systemMessage } : {}),
      deliveredToTelegram,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Chat send failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    return errorResponse("BAD_REQUEST", "Message could not be sent.", 400);
  }
};
