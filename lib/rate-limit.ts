import { database } from "@/lib/database";

export class RateLimitError extends Error {
  readonly retryAfter: number;
  constructor(retryAfter: number) {
    super("Foram efetuadas demasiadas tentativas. Aguarde alguns minutos.");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

function clientAddress(request: Request) {
  return request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function hashKey(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function enforceRateLimit(
  request: Request,
  options: { scope: string; maxAttempts: number; windowSeconds: number },
) {
  const now = Math.floor(Date.now() / 1000);
  const windowStartedAt = Math.floor(now / options.windowSeconds) * options.windowSeconds;
  const key = await hashKey(`${options.scope}:${clientAddress(request)}`);
  const row = await database().prepare(`
    INSERT INTO security_rate_limits (key, attempts, window_started_at, updated_at)
    VALUES (?, 1, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      attempts = CASE WHEN window_started_at = excluded.window_started_at THEN attempts + 1 ELSE 1 END,
      window_started_at = excluded.window_started_at,
      updated_at = excluded.updated_at
    RETURNING attempts
  `).bind(key, windowStartedAt, now).first<{ attempts: number }>();
  if ((row?.attempts ?? 1) > options.maxAttempts) {
    throw new RateLimitError(windowStartedAt + options.windowSeconds - now);
  }
}
