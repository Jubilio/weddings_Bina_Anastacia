import { createAdminCookie, passwordIsValid } from "@/lib/admin-auth";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await enforceRateLimit(request, { scope: "admin-login", maxAttempts: 10, windowSeconds: 15 * 60 });
    const payload = (await request.json()) as { password?: string };
    if (!payload.password || !(await passwordIsValid(payload.password))) {
      return Response.json({ error: "Senha incorreta." }, { status: 401 });
    }

    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": await createAdminCookie() } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível entrar." },
      {
        status: error instanceof RateLimitError ? 429 : 500,
        headers: error instanceof RateLimitError ? { "Retry-After": String(error.retryAfter) } : undefined,
      },
    );
  }
}
