import { env } from "cloudflare:workers";
import type {
  Attendance,
  Invitation,
  InvitationInput,
  Invitee,
} from "@/lib/invitation-types";

type InvitationRow = {
  id: string;
  code: string;
  primary_name: string;
  phone: string | null;
  response_note: string | null;
  responded_at: number | null;
  created_at: number;
};

type InviteeRow = {
  id: string;
  invitation_id: string;
  full_name: string;
  role: "principal" | "acompanhante";
  sort_order: number;
  attendance: Attendance;
};

function database() {
  const binding = (env as unknown as { DB?: D1Database }).DB;
  if (!binding) throw new Error("A base de dados de convidados não está disponível.");
  return binding;
}

function mapInvitee(row: InviteeRow): Invitee {
  return {
    id: row.id,
    fullName: row.full_name,
    role: row.role,
    sortOrder: row.sort_order,
    attendance: row.attendance,
  };
}

function mapInvitation(row: InvitationRow, invitees: InviteeRow[]): Invitation {
  return {
    id: row.id,
    code: row.code,
    primaryName: row.primary_name,
    phone: row.phone,
    responseNote: row.response_note,
    respondedAt: row.responded_at,
    createdAt: row.created_at,
    invitees: invitees
      .filter((invitee) => invitee.invitation_id === row.id)
      .sort((left, right) => left.sort_order - right.sort_order)
      .map(mapInvitee),
  };
}

function cleanInput(input: InvitationInput) {
  const primaryName = input.primaryName.trim();
  const companions = input.companions.map((name) => name.trim()).filter(Boolean);
  const phone = input.phone?.trim() || null;

  if (primaryName.length < 2 || primaryName.length > 120) {
    throw new Error("Indique o nome completo do convidado principal.");
  }
  
  // Permite 0 ou 1 acompanhante (convite para 1 ou 2 pessoas)
  if (companions.length > 1) {
    throw new Error("O convite permite no máximo 2 pessoas. Indique no máximo um acompanhante.");
  }
  
  if (companions.length === 1 && (companions[0].length < 2 || companions[0].length > 120)) {
    throw new Error("Indique o nome completo do acompanhante.");
  }
  
  return { primaryName, companions, phone };
}

function makeCode() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 18);
}

export async function listInvitations() {
  const db = database();
  const [invitationResult, inviteeResult] = await db.batch([
    db.prepare(`
      SELECT id, code, primary_name, phone, response_note, responded_at, created_at
      FROM invitations
      ORDER BY created_at DESC
    `),
    db.prepare(`
      SELECT id, invitation_id, full_name, role, sort_order, attendance
      FROM invitees
      ORDER BY invitation_id, sort_order
    `),
  ]);

  const invitationRows = invitationResult.results as unknown as InvitationRow[];
  const inviteeRows = inviteeResult.results as unknown as InviteeRow[];
  return invitationRows.map((row) => mapInvitation(row, inviteeRows));
}

export async function getInvitationByCode(code: string) {
  if (!/^[a-f0-9]{18}$/.test(code)) return null;
  const db = database();
  const invitation = await db
    .prepare(`
      SELECT id, code, primary_name, phone, response_note, responded_at, created_at
      FROM invitations
      WHERE code = ?
      LIMIT 1
    `)
    .bind(code)
    .first<InvitationRow>();

  if (!invitation) return null;
  const invitees = await db
    .prepare(`
      SELECT id, invitation_id, full_name, role, sort_order, attendance
      FROM invitees
      WHERE invitation_id = ?
      ORDER BY sort_order
    `)
    .bind(invitation.id)
    .all<InviteeRow>();

  return mapInvitation(invitation, invitees.results);
}

export async function createInvitation(input: InvitationInput) {
  const cleaned = cleanInput(input);
  const db = database();
  const id = crypto.randomUUID();
  const code = makeCode();
  const names = [cleaned.primaryName, ...cleaned.companions];

  await db.batch([
    db
      .prepare(`
        INSERT INTO invitations (id, code, primary_name, phone, created_at, updated_at)
        VALUES (?, ?, ?, ?, unixepoch(), unixepoch())
      `)
      .bind(id, code, cleaned.primaryName, cleaned.phone),
    ...names.map((fullName, index) =>
      db
        .prepare(`
          INSERT INTO invitees (id, invitation_id, full_name, role, sort_order, attendance)
          VALUES (?, ?, ?, ?, ?, 'pendente')
        `)
        .bind(
          crypto.randomUUID(),
          id,
          fullName,
          index === 0 ? "principal" : "acompanhante",
          index,
        ),
    ),
  ]);

  return getInvitationByCode(code);
}

export async function updateInvitation(id: string, input: InvitationInput) {
  const cleaned = cleanInput(input);
  const db = database();
  const names = [cleaned.primaryName, ...cleaned.companions];
  const existing = await db
    .prepare("SELECT code FROM invitations WHERE id = ? LIMIT 1")
    .bind(id)
    .first<{ code: string }>();
  if (!existing) throw new Error("Convite não encontrado.");

  await db.batch([
    db
      .prepare(`
        UPDATE invitations
        SET primary_name = ?, phone = ?, response_note = NULL,
            responded_at = NULL, updated_at = unixepoch()
        WHERE id = ?
      `)
      .bind(cleaned.primaryName, cleaned.phone, id),
    db.prepare("DELETE FROM invitees WHERE invitation_id = ?").bind(id),
    ...names.map((fullName, index) =>
      db
        .prepare(`
          INSERT INTO invitees (id, invitation_id, full_name, role, sort_order, attendance)
          VALUES (?, ?, ?, ?, ?, 'pendente')
        `)
        .bind(
          crypto.randomUUID(),
          id,
          fullName,
          index === 0 ? "principal" : "acompanhante",
          index,
        ),
    ),
  ]);

  return getInvitationByCode(existing.code);
}

export async function deleteInvitation(id: string) {
  const result = await database()
    .prepare("DELETE FROM invitations WHERE id = ?")
    .bind(id)
    .run();
  return result.meta.changes > 0;
}

export async function saveRsvp(
  code: string,
  responses: Array<{
    inviteeId: string;
    attendance: Exclude<Attendance, "pendente">;
  }>,
  note: string,
) {
  const invitation = await getInvitationByCode(code);
  if (!invitation) throw new Error("Convite não encontrado.");

  const allowedIds = new Set(invitation.invitees.map((invitee) => invitee.id));
  const responseIds = new Set(responses.map((response) => response.inviteeId));
  if (
    responses.length !== invitation.invitees.length ||
    responseIds.size !== invitation.invitees.length ||
    responses.some(
      (response) =>
        !allowedIds.has(response.inviteeId) ||
        !["sim", "nao"].includes(response.attendance),
    )
  ) {
    throw new Error("Confirme a presença de todas as pessoas do convite.");
  }

  const db = database();
  await db.batch([
    ...responses.map((response) =>
      db
        .prepare(`
          UPDATE invitees
          SET attendance = ?, confirmed_at = unixepoch()
          WHERE id = ? AND invitation_id = ?
        `)
        .bind(response.attendance, response.inviteeId, invitation.id),
    ),
    db
      .prepare(`
        UPDATE invitations
        SET response_note = ?, responded_at = unixepoch(), updated_at = unixepoch()
        WHERE id = ?
      `)
      .bind(note.trim().slice(0, 1000) || null, invitation.id),
  ]);

  return getInvitationByCode(code);
}
