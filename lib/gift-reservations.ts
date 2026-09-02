import { database } from "@/lib/database";
import {
  GIFT_ITEMS,
  isGiftKey,
  type AdminGiftReservationView,
  type GiftReservationStatus,
  type GiftReservationView,
} from "@/lib/gifts";
import { getInvitationByCode } from "@/lib/invitations";

type GiftReservationRow = { gift_key: string; invitation_id: string; status: GiftReservationStatus };
type AdminGiftReservationRow = GiftReservationRow & {
  invitation_code: string; invitation_name: string; updated_at: number;
};
export type GiftReservationAction = "reservar" | "comprado" | "libertar";

export async function listGiftReservationsForAdmin() {
  const result = await database().prepare(`
    SELECT gift_reservations.gift_key, gift_reservations.invitation_id,
           gift_reservations.status, gift_reservations.updated_at,
           invitations.code AS invitation_code, invitations.primary_name AS invitation_name
    FROM gift_reservations
    INNER JOIN invitations ON invitations.id = gift_reservations.invitation_id
    ORDER BY gift_reservations.updated_at DESC
  `).all<AdminGiftReservationRow>();
  const giftNames = new Map(GIFT_ITEMS.map((gift) => [gift.key, gift.name]));
  return result.results.map<AdminGiftReservationView>((row) => ({
    giftKey: row.gift_key, giftName: giftNames.get(row.gift_key) ?? row.gift_key,
    invitationCode: row.invitation_code, invitationName: row.invitation_name,
    status: row.status, updatedAt: row.updated_at,
  }));
}

export async function listGiftReservations(code?: string | null) {
  const invitation = code ? await getInvitationByCode(code) : null;
  const result = await database().prepare(`
    SELECT gift_key, invitation_id, status FROM gift_reservations ORDER BY gift_key
  `).all<GiftReservationRow>();
  return {
    invitation,
    reservations: result.results.map<GiftReservationView>((row) => ({
      giftKey: row.gift_key, status: row.status, isMine: invitation?.id === row.invitation_id,
    })),
  };
}

export async function changeGiftReservation(code: string, giftKey: string, action: GiftReservationAction) {
  if (!isGiftKey(giftKey)) throw new Error("Presente inválido.");
  const invitation = await getInvitationByCode(code);
  if (!invitation) throw new Error("Convite não encontrado.");
  const db = database();
  if (action === "reservar") {
    await db.prepare(`
      INSERT INTO gift_reservations (id, gift_key, invitation_id, status, reserved_at, updated_at)
      VALUES (?, ?, ?, 'reservado', unixepoch(), unixepoch()) ON CONFLICT(gift_key) DO NOTHING
    `).bind(crypto.randomUUID(), giftKey, invitation.id).run();
    const reservation = await db.prepare(`
      SELECT gift_key, invitation_id, status FROM gift_reservations WHERE gift_key = ? LIMIT 1
    `).bind(giftKey).first<GiftReservationRow>();
    if (!reservation || reservation.invitation_id !== invitation.id) {
      throw new Error("Este presente já foi reservado por outro convidado.");
    }
    await db.prepare(`UPDATE gift_reservations SET status = 'reservado', updated_at = unixepoch() WHERE gift_key = ? AND invitation_id = ?`)
      .bind(giftKey, invitation.id).run();
  } else if (action === "comprado") {
    const result = await db.prepare(`UPDATE gift_reservations SET status = 'comprado', updated_at = unixepoch() WHERE gift_key = ? AND invitation_id = ?`)
      .bind(giftKey, invitation.id).run();
    if (result.meta.changes === 0) throw new Error("Reserve este presente antes de o marcar como comprado.");
  } else if (action === "libertar") {
    await db.prepare(`DELETE FROM gift_reservations WHERE gift_key = ? AND invitation_id = ?`)
      .bind(giftKey, invitation.id).run();
  } else {
    throw new Error("Ação inválida.");
  }
  return listGiftReservations(code);
}
