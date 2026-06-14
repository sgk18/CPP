import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "cpp_admin_session";

function getExpectedHash(): string {
  // Fallback to SHA-256 of 'admin123' if not set in environment:
  // admin123 SHA-256: 240be518abb0227c412f719e729a177259174846110fbc2db484fa5cf8d73b22
  return process.env.ADMIN_PASSWORD_HASH || "240be518abb0227c412f719e729a177259174846110fbc2db484fa5cf8d73b22";
}

export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function signSession(): Promise<string> {
  const hash = getExpectedHash();
  // Create a session token by signing a static identifier using the hash as the key
  return crypto.createHmac("sha256", hash).update("cpp-authenticated-session").digest("hex");
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME)?.value;
  if (!session) return false;

  const expected = await signSession();
  return session === expected;
}

export async function login(password: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  const expectedHash = getExpectedHash();

  if (inputHash !== expectedHash) {
    return false;
  }

  const session = await signSession();
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day session
  });

  return true;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
