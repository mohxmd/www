import type { ChatMessageDto, ChatSendResponse, ChatSessionDto } from "../types";

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as (T & ApiErrorPayload) | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Request failed with status ${response.status}.`);
  }

  if (!payload) throw new Error("Empty server response.");
  return payload;
}

export async function startChat() {
  const response = await fetch("/api/chat/start", { method: "POST" });
  return parseJsonResponse<ChatSessionDto>(response);
}

export async function loadMessages() {
  const response = await fetch("/api/chat/messages");
  return parseJsonResponse<{ messages: ChatMessageDto[] }>(response);
}

export async function resumeChat() {
  const response = await fetch("/api/chat/messages");
  if (response.status === 401) return { messages: [] };
  return parseJsonResponse<{ messages: ChatMessageDto[] }>(response);
}

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
