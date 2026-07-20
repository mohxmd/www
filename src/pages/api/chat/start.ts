import type { APIRoute } from "astro";
import { getDb } from "#/db";
import { ensureChatSession } from "#/features/chat/server/session";
import { listMessages } from "#/features/chat/server/messages";
import { errorResponse, jsonResponse } from "#/features/chat/server/http";
import type { ChatSessionDto } from "#/features/chat/types";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const db = getDb();
    const session = await ensureChatSession(db, cookies);
    const messages = await listMessages(db, session.conversationId);

    return jsonResponse<ChatSessionDto>({
      conversationId: session.conversationId,
      expiresAt: session.expiresAt.toISOString(),
      messages,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`Chat start failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    return errorResponse("CHAT_DISABLED", "Chat is unavailable.", 503);
  }
};
