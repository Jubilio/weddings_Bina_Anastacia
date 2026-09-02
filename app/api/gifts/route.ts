import { changeGiftReservation, type GiftReservationAction } from "@/lib/gift-reservations";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { code?: string; giftKey?: string; action?: GiftReservationAction };
    if (!payload.code || !payload.giftKey || !payload.action) throw new Error("Pedido incompleto.");
    await enforceRateLimit(request, { scope: `gifts:${payload.code}`, maxAttempts: 30, windowSeconds: 10 * 60 });
    const result = await changeGiftReservation(payload.code, payload.giftKey, payload.action);
    return Response.json({ reservations: result.reservations });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível atualizar o presente." },
      { status: error instanceof RateLimitError ? 429 : 400,
        headers: error instanceof RateLimitError ? { "Retry-After": String(error.retryAfter) } : undefined },
    );
  }
}
