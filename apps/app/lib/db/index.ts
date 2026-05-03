import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { cache } from "react";
import { notes } from "./schema";

neonConfig.fetchConnectionCache = true;

export const getDb = cache(() => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(url);
  return drizzle(sql, { schema: { notes } });
});
