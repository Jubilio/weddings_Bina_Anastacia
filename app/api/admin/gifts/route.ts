import { isAdminRequest } from "@/lib/admin-auth";
import { listGiftReservationsForAdmin } from "@/lib/gift-reservations";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Acesso não autorizado." }, { status: 401 });
  try {
    return Response.json({ reservations: await listGiftReservationsForAdmin() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível carregar os presentes." }, { status: 400 });
  }
}
