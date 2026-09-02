import { env } from "cloudflare:workers";

export function database() {
  const binding = (env as unknown as { DB?: D1Database }).DB;
  if (!binding) throw new Error("A base de dados do convite não está disponível.");
  return binding;
}

let featureSetup: Promise<void> | null = null;

async function setupDatabaseFeatures() {
  const db = database();
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS gift_reservations (
        id text PRIMARY KEY NOT NULL,
        gift_key text NOT NULL,
        invitation_id text NOT NULL,
        status text DEFAULT 'reservado' NOT NULL,
        reserved_at integer DEFAULT (unixepoch()) NOT NULL,
        updated_at integer DEFAULT (unixepoch()) NOT NULL,
        FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE cascade
      )
    `),
    db.prepare(`
      CREATE UNIQUE INDEX IF NOT EXISTS gift_reservations_gift_key_unique
      ON gift_reservations (gift_key)
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS security_rate_limits (
        key text PRIMARY KEY NOT NULL,
        attempts integer DEFAULT 0 NOT NULL,
        window_started_at integer NOT NULL,
        updated_at integer NOT NULL
      )
    `),
  ]);

  try {
    await db.prepare("SELECT checked_in_at FROM invitations LIMIT 1").first();
  } catch {
    try {
      await db.prepare("ALTER TABLE invitations ADD checked_in_at integer").run();
    } catch {
      // Another Worker instance may have added the column concurrently.
      await db.prepare("SELECT checked_in_at FROM invitations LIMIT 1").first();
    }
  }
}

export async function ensureDatabaseFeatures() {
  featureSetup ??= setupDatabaseFeatures();
  try {
    await featureSetup;
  } catch (error) {
    featureSetup = null;
    throw error;
  }
}
