import { createNeonAuth } from "@neondatabase/auth/next/server";

function readNeonAuthConfig() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl?.trim() || !secret?.trim()) {
    throw new Error(
      "Set NEON_AUTH_BASE_URL and NEON_AUTH_COOKIE_SECRET (32+ chars). See .env.example.",
    );
  }
  if (secret.length < 32) {
    throw new Error("NEON_AUTH_COOKIE_SECRET must be at least 32 characters.");
  }
  return { baseUrl: baseUrl.trim(), cookies: { secret } };
}

export const auth = createNeonAuth(readNeonAuthConfig());
