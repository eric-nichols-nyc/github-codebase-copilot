import { createNeonAuth } from "@neondatabase/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | null = null;

/** Returns the Neon Auth server instance, or `null` if env is not set (e.g. CI build). */
export function getNeonAuth(): ReturnType<typeof createNeonAuth> | null {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl) {
    return null;
  }
  if (!secret) {
    return null;
  }
  if (secret.length < 32) {
    return null;
  }
  if (!authInstance) {
    authInstance = createNeonAuth({
      baseUrl,
      cookies: {
        secret,
      },
    });
  }
  return authInstance;
}
