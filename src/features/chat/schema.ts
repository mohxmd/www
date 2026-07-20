import { z } from "astro/zod";

export const CHAT_LIMITS = {
  messageMaxLength: 500,
  maxMessagesPerConversation: 30,
  messagesPerMinute: 5,
  messagesPerHour: 20,
  sessionDays: 30,
  retentionDays: 90,
} as const;

export const chatSendInputSchema = z.object({
  body: z.string().trim().min(1, "Message cannot be empty").max(CHAT_LIMITS.messageMaxLength),
});

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
    })
    .optional(),
});

export const telegramUpdateSchema = z.object({
  update_id: z.number(),
  message: telegramMessageSchema.optional(),
});

export type ChatSendInput = z.infer<typeof chatSendInputSchema>;
export type TelegramUpdate = z.infer<typeof telegramUpdateSchema>;
