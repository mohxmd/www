import type { APIRoute } from "astro";
import { getDb } from "#/db";
import { errorResponse, jsonResponse } from "#/features/chat/server/http";
import { storeTelegramReply, verifyTelegramWebhookSecret } from "#/features/chat/server/telegram";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!verifyTelegramWebhookSecret(request)) {
    return errorResponse("FORBIDDEN", "Invalid Telegram webhook secret.", 403);
  }

  try {
    const result = await storeTelegramReply(getDb(), request);
    return jsonResponse({ ok: true, result });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `Telegram webhook failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return errorResponse("BAD_REQUEST", "Telegram webhook failed.", 400);
  }
};
