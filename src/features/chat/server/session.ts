import { CHAT_COOKIE_SECRET } from "astro:env/server";
import { eq } from "drizzle-orm";
import type { APIContext } from "astro";
import { chatConversation, type getDb } from "#/db";
import { CHAT_LIMITS } from "../schema";

const COOKIE_NAME = "chat_session";
const textEncoder = new TextEncoder();

type Db = ReturnType<typeof getDb>;
type AstroCookies = APIContext["cookies"];

type CookiePayload = {
  conversationId: string;
  secret: string;
};

export type ChatSession = {
  conversationId: string;
  secret: string;
  expiresAt: Date;
};

function getCookieSecret() {
  if (CHAT_COOKIE_SECRET) return CHAT_COOKIE_SECRET;
  if (import.meta.env.DEV) return "dev-only-chat-cookie-secret";
  throw new Error("Missing CHAT_COOKIE_SECRET.");
}

function base64UrlEncode(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? textEncoder.encode(input) : new Uint8Array(input);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(input: string) {
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
}

async function hmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getCookieSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(message));
  return base64UrlEncode(signature);
}

async function sha256(message: string) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(message));
  return base64UrlEncode(digest);
}

async function signPayload(payload: CookiePayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

async function verifyCookie(value: string | undefined): Promise<CookiePayload | null> {
  if (!value) return null;

  const [encodedPayload, signature] = value.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = await hmac(encodedPayload);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<CookiePayload>;
    if (!payload.conversationId || !payload.secret) return null;
    return { conversationId: payload.conversationId, secret: payload.secret };
  } catch {
    return null;
  }
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function setSessionCookie(cookies: AstroCookies, value: string) {
  cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    sameSite: "lax",
    path: "/",
    maxAge: CHAT_LIMITS.sessionDays * 24 * 60 * 60,
  });
}

export async function getChatSession(db: Db, cookies: AstroCookies): Promise<ChatSession | null> {
  const payload = await verifyCookie(cookies.get(COOKIE_NAME)?.value);
  if (!payload) return null;

  const conversation = await db
    .select()
    .from(chatConversation)
    .where(eq(chatConversation.id, payload.conversationId))
    .get();

  if (!conversation || conversation.status !== "open") return null;
  if (conversation.secretHash !== (await sha256(payload.secret))) return null;
  if (conversation.expiresAt.getTime() <= Date.now()) return null;

  return {
    conversationId: conversation.id,
    secret: payload.secret,
    expiresAt: conversation.expiresAt,
  };
}

export async function ensureChatSession(db: Db, cookies: AstroCookies): Promise<ChatSession> {
  const existingSession = await getChatSession(db, cookies);
  if (existingSession) return existingSession;

  const now = new Date();
  const conversationId = crypto.randomUUID();
  const secret = crypto.randomUUID() + crypto.randomUUID();
  const expiresAt = addDays(now, CHAT_LIMITS.sessionDays);

  await db.insert(chatConversation).values({
    id: conversationId,
    secretHash: await sha256(secret),
    status: "open",
    createdAt: now,
    lastActivityAt: now,
    expiresAt,
  });

  setSessionCookie(cookies, await signPayload({ conversationId, secret }));

  return { conversationId, secret, expiresAt };
}

export async function touchChatSession(db: Db, cookies: AstroCookies, session: ChatSession) {
  const now = new Date();
  const expiresAt = addDays(now, CHAT_LIMITS.sessionDays);

  await db
    .update(chatConversation)
    .set({ lastActivityAt: now, expiresAt })
    .where(eq(chatConversation.id, session.conversationId));

  setSessionCookie(
    cookies,
    await signPayload({ conversationId: session.conversationId, secret: session.secret })
  );

  return { ...session, expiresAt };
}
