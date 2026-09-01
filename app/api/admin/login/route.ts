import { createAdminCookie, passwordIsValid } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
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
      { status: 500 },
    );
  }
}
