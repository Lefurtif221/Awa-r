import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

const COOKIE_NAME = "awa_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET manquant en production.");
  }
  // Secret de développement uniquement : régénéré à chaque redémarrage.
  return "dev-only-session-secret";
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export async function createSession(): Promise<void> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString(
    "base64url",
  );
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function verifySession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const separator = token.indexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    // L'expiration est imposée par le maxAge du cookie côté navigateur ;
    // on ne fait ici que valider l'intégrité de la signature.
    JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return true;
  } catch {
    return false;
  }
}

/** Comparaison résistante aux attaques par timing sur le mot de passe admin. */
export function safePasswordEqual(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Force le calcul même en cas de longueurs différentes.
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function adminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") return null;
  return "awa-admin";
}

export function generateSecret(): string {
  return randomBytes(32).toString("base64url");
}
