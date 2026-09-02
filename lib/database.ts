import { env } from "cloudflare:workers";

export function database() {
  const binding = (env as unknown as { DB?: D1Database }).DB;
  if (!binding) throw new Error("A base de dados do convite não está disponível.");
  return binding;
}
