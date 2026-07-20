export type ChatSender = "visitor" | "admin" | "system";
export type ChatStatus = "open" | "closed";

export type ChatMessageDto = {
  id: string;
  sender: ChatSender;
  body: string;
  createdAt: string;
};

export type ChatSessionDto = {
  conversationId: string;
  expiresAt: string;
  messages: ChatMessageDto[];
};

export type ChatSendResponse = {
  message: ChatMessageDto;
  systemMessage?: ChatMessageDto;
  deliveredToTelegram: boolean;
};

export type ChatErrorCode =
  | "BAD_REQUEST"
  | "CHAT_DISABLED"
  | "FORBIDDEN"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "TELEGRAM_DISABLED"
  | "UNAUTHORIZED";

export type ChatErrorResponse = {
  error: {
    code: ChatErrorCode;
    message: string;
  };
};
