import {
  TELEGRAM_ADMIN_USER_ID,
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_WEBHOOK_SECRET,
} from "astro:env/server";
import { eq } from "drizzle-orm";
import { chatMessage, chatTelegramMap, type getDb } from "#/db";
import { telegramUpdateSchema } from "../schema";

type Db = ReturnType<typeof getDb>;

type TelegramSendMessageResponse = {
  ok: boolean;
  result?: {
    message_id: number;
  };
  description?: string;
};

/**
 * Verifies Telegram's webhook secret header.
 *
 * In production this must match the `secret_token` used with `setWebhook`.
 * Development allows missing secrets so local webhook testing remains possible.
 */
export function verifyTelegramWebhookSecret(request: Request) {
  if (!TELEGRAM_WEBHOOK_SECRET) return import.meta.env.DEV;
  return request.headers.get("X-Telegram-Bot-Api-Secret-Token") === TELEGRAM_WEBHOOK_SECRET;
}

function isTelegramConfigured() {
  return Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_ADMIN_USER_ID);
}

/**
 * Forwards a visitor message to the configured Telegram admin chat.
 *
 * The returned Telegram message id is stored so an admin reply can be mapped
 * back to the correct website conversation.
 */
export async function sendTelegramVisitorMessage(conversationId: string, body: string) {
  if (!isTelegramConfigured()) {
    return { delivered: false, telegramMessageId: null };
  }

  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_ADMIN_USER_ID,
      text: [
        "New website chat",
        `Conversation: ${conversationId}`,
        "",
        body,
        "",
        "Reply to this Telegram message to answer on the website.",
      ].join("\n"),
      disable_web_page_preview: true,
    }),
  });

  const payload = (await response.json().catch(() => null)) as TelegramSendMessageResponse | null;
  if (!response.ok || !payload?.ok || !payload.result?.message_id) {
    throw new Error(payload?.description ?? "Telegram sendMessage failed.");
  }

  return { delivered: true, telegramMessageId: payload.result.message_id };
}

/**
 * Stores the relation between a Telegram message and a website chat message.
 */
export async function storeTelegramMessageMap(
  db: Db,
  telegramMessageId: number | null,
  conversationId: string,
  messageId: string
) {
  if (!telegramMessageId) return;

  await db
    .insert(chatTelegramMap)
    .values({ telegramMessageId, conversationId, messageId })
    .onConflictDoNothing();
}

/**
 * Stores an admin reply received from Telegram.
 *
 * Only replies from `TELEGRAM_ADMIN_USER_ID` to a previously forwarded message
 * are accepted. Other Telegram updates are ignored.
 */
export async function storeTelegramReply(db: Db, request: Request) {
  const update = telegramUpdateSchema.parse(await request.json());
  const message = update.message;

  if (!message?.text || !message.reply_to_message) {
    return { stored: false, reason: "ignored" as const };
  }

  if (!TELEGRAM_ADMIN_USER_ID || String(message.from?.id) !== TELEGRAM_ADMIN_USER_ID) {
    return { stored: false, reason: "forbidden" as const };
  }

  const map = await db
    .select()
    .from(chatTelegramMap)
    .where(eq(chatTelegramMap.telegramMessageId, message.reply_to_message.message_id))
    .get();

  if (!map) return { stored: false, reason: "not_found" as const };

  const reply = {
    id: crypto.randomUUID(),
    conversationId: map.conversationId,
    sender: "admin" as const,
    body: message.text,
    telegramMessageId: message.message_id,
    createdAt: new Date(),
  };

  await db.insert(chatMessage).values(reply);
  await storeTelegramMessageMap(db, message.message_id, map.conversationId, reply.id);

  return { stored: true, conversationId: map.conversationId };
}
