import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const fallbackDb = (globalThis as { DB?: unknown }).DB ?? (env as { DB?: unknown })?.DB;

  if (!fallbackDb) {
    return null;
  }

  return drizzle(fallbackDb as Parameters<typeof drizzle>[0], { schema });
}
