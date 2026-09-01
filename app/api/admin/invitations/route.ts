import { isAdminRequest } from "@/lib/admin-auth";
import {
  createInvitation,
  deleteInvitation,
  listInvitations,
  updateInvitation,
} from "@/lib/invitations";
import type { InvitationInput } from "@/lib/invitation-types";

export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
}

function failure(error: unknown) {
  return Response.json(
    { error: error instanceof Error ? error.message : "Ocorreu um erro inesperado." },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  try {
    return Response.json({ invitations: await listInvitations() });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  try {
    const input = (await request.json()) as InvitationInput;
    return Response.json({ invitation: await createInvitation(input) }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  try {
    const payload = (await request.json()) as InvitationInput & { id?: string };
    if (!payload.id) throw new Error("Convite não encontrado.");
    return Response.json({
      invitation: await updateInvitation(payload.id, payload),
    });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest(request))) return unauthorized();
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) throw new Error("Convite não encontrado.");
    return Response.json({ deleted: await deleteInvitation(id) });
  } catch (error) {
    return failure(error);
  }
}
