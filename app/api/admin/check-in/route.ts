import { isAdminRequest } from "@/lib/admin-auth";
import { getInvitationByCode, setInvitationCheckIn } from "@/lib/invitations";

export const dynamic = "force-dynamic";
function unauthorized() { return Response.json({ error: "Acesso não autorizado." }, { status: 401 }); }

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return Response.json({ error: "Indique o código do convite." }, { status: 400 });
  const invitation = await getInvitationByCode(code);
  if (!invitation) return Response.json({ error: "Convite não encontrado." }, { status: 404 });
  return Response.json({ invitation });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  try {
    const payload = await request.json() as { code?: string; checkedIn?: boolean };
    if (!payload.code || typeof payload.checkedIn !== "boolean") throw new Error("Pedido incompleto.");
    return Response.json({ invitation: await setInvitationCheckIn(payload.code, payload.checkedIn) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível registar a entrada." }, { status: 400 });
  }
}
