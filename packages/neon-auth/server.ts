import "server-only";
import { neonAuth } from "@neondatabase/auth/next/server";

export async function getSession() {
  return await neonAuth();
}
