import { saveRsvp } from "@/lib/invitations";
import type { Attendance } from "@/lib/invitation-types";

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

    const invitation = await saveRsvp(
      payload.code,
      payload.responses,
      payload.note ?? "",
    );
    return Response.json({ invitation });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Não foi possível confirmar." },
      { status: 400 },
    );
  }
}
