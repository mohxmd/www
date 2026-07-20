import type { APIRoute } from "astro";
import { getDb } from "#/db";
import { getChatSession } from "#/features/chat/server/session";
import { listMessages } from "#/features/chat/server/messages";
import { errorResponse, jsonResponse } from "#/features/chat/server/http";

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const db = getDb();
    const session = await getChatSession(db, cookies);
    if (!session) return errorResponse("UNAUTHORIZED", "Chat session not found.", 401);

    return jsonResponse({ messages: await listMessages(db, session.conversationId) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Chat messages failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return errorResponse("SERVER_ERROR", "Messages are unavailable.", 500);
  }
};
