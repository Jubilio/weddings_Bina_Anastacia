import { saveRsvp } from "@/lib/invitations";
import type { Attendance } from "@/lib/invitation-types";
import { enforceRateLimit, RateLimitError } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      code?: string;
      note?: string;
      responses?: Array<{
        inviteeId: string;
        attendance: Exclude<Attendance, "pendente">;
      }>;
    };

    if (!payload.code || !Array.isArray(payload.responses)) {
      throw new Error("Resposta incompleta.");
    }

    await enforceRateLimit(request, {
      scope: `rsvp:${payload.code}`,
      maxAttempts: 12,
      windowSeconds: 10 * 60,
    });

    const invitation = await saveRsvp(
      payload.code,
      payload.responses,
      payload.note ?? "",
    );
    return Response.json({ invitation });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível confirmar." },
      {
        status: error instanceof RateLimitError ? 429 : 400,
        headers: error instanceof RateLimitError ? { "Retry-After": String(error.retryAfter) } : undefined,
      },
    );
  }
}
