import "server-only";

/** Placeholder DB entrypoint; app DB client lives under `@/lib/db`. */
export function getDbClient(): never {
  throw new Error("src/lib/db.getDbClient: not implemented — use `@/lib/db`");
}
