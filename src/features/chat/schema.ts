import { z } from "astro/zod";

/**
 * Product limits for the public website chat.
 *
 * Keep these conservative: there is no user account system, so the signed
 * cookie session is the only durable identity signal available to the server.
 */
export const CHAT_LIMITS = {
  messageMaxLength: 500,
  maxMessagesPerConversation: 30,
  messagesPerMinute: 5,
  messagesPerHour: 20,
  sessionDays: 30,
  retentionDays: 90,
} as const;

/**
 * Validates visitor-submitted chat messages before they are stored or sent to
 * Telegram. The trim is intentional so whitespace-only messages are rejected.
 */
export const chatSendInputSchema = z.object({
  body: z.string().trim().min(1, "Message cannot be empty").max(CHAT_LIMITS.messageMaxLength),
});

/**
 * Minimal Telegram message shape used by the webhook route.
 *
 * The bot only needs plain-text replies to forwarded visitor messages, so the
 * schema intentionally ignores every other Telegram update type.
 */
export const telegramMessageSchema = z.object({
  message_id: z.number(),
  from: z
    .object({
      id: z.number(),
      is_bot: z.boolean().optional(),
      username: z.string().optional(),
    })
    .optional(),
  text: z.string().optional(),
  reply_to_message: z
    .object({
      message_id: z.number(),
      text: z.string().optional(),
    })
    .optional(),
});

export const telegramUpdateSchema = z.object({
  update_id: z.number(),
  message: telegramMessageSchema.optional(),
  edited_message: telegramMessageSchema.optional(),
});

export type ChatSendInput = z.infer<typeof chatSendInputSchema>;
export type TelegramUpdate = z.infer<typeof telegramUpdateSchema>;
