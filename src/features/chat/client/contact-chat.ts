import type { ChatMessageDto, ChatSendResponse, ChatSessionDto } from "../types";

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

/**
 * Parses chat API responses and normalizes server errors for the Alpine UI.
 */
async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as (T & ApiErrorPayload) | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}.`);
  }

  if (!payload) throw new Error("Empty server response.");
  return payload;
}

/**
 * Creates a server-side conversation and signed HTTP-only cookie.
 */
export async function startChat() {
  const response = await fetch("/api/chat/start", { method: "POST" });
  return parseJsonResponse<ChatSessionDto>(response);
}

/**
 * Loads messages for an existing authenticated chat session.
 */
export async function loadMessages() {
  const response = await fetch("/api/chat/messages");
  return parseJsonResponse<{ messages: ChatMessageDto[] }>(response);
}

/**
 * Attempts to restore a chat session without creating a new DB conversation.
 */
export async function resumeChat() {
  const response = await fetch("/api/chat/messages");
  if (response.status === 401) return { messages: [] };
  return parseJsonResponse<{ messages: ChatMessageDto[] }>(response);
}

/**
 * Sends a visitor message and lets the server handle storage, rate limits, and
 * optional Telegram forwarding.
 */
export async function sendMessage(body: string) {
  const response = await fetch("/api/chat/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });

  return parseJsonResponse<ChatSendResponse>(response);
}

declare global {
  interface Window {
    contactChatApi: {
      startChat: typeof startChat;
      resumeChat: typeof resumeChat;
      loadMessages: typeof loadMessages;
      sendMessage: typeof sendMessage;
    };
  }
}

window.contactChatApi = { startChat, resumeChat, loadMessages, sendMessage };
