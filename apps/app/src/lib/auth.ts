import "server-only";

/** Placeholder auth helpers. */
export async function requireAuthSession(): Promise<never> {
  throw new Error("src/lib/auth.requireAuthSession: not implemented");
}
