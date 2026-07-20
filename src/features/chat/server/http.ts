import type { ChatErrorCode, ChatErrorResponse } from "../types";

export function jsonResponse<T>(body: T, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...init?.headers,
    },
  });
}

export function errorResponse(code: ChatErrorCode, message: string, status: number) {
  return jsonResponse<ChatErrorResponse>({ error: { code, message } }, { status });
}
