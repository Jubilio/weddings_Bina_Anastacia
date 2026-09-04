"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Gift, LockKeyhole, ShoppingBag, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GiftReservationStatus, GiftReservationView } from "@/lib/gifts";
import { toast } from "sonner";

type GiftItem = { key: string; name: string };
type GiftAction = "reservar" | "comprado" | "libertar";

export function GiftRegistry({ gifts, initialReservations, invitationCode }: {
  gifts: GiftItem[]; initialReservations: GiftReservationView[]; invitationCode: string | null;
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const reservationByGift = useMemo(() => new Map(reservations.map((item) => [item.giftKey, item])), [reservations]);

  async function updateGift(giftKey: string, action: GiftAction) {
    if (!invitationCode) return;
    setBusyKey(giftKey);
    try {
      const response = await fetch("/api/gifts", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: invitationCode, giftKey, action }) });
      const data = await response.json() as { reservations?: GiftReservationView[]; error?: string };
      if (!response.ok || !data.reservations) throw new Error(data.error ?? "Não foi possível atualizar o presente.");
      setReservations(data.reservations);
      toast.success(action === "reservar" ? "Presente reservado" : action === "comprado" ? "Presente confirmado" : "Reserva libertada", {
        description: action === "reservar" ? "A opção ficou guardada em seu nome." : action === "comprado" ?
          "Muito obrigado por fazer parte deste momento." : "O presente voltou a ficar disponível.",
      });
    } catch (error) {
      toast.error("Não foi possível atualizar o presente", { description: error instanceof Error ? error.message : "Tente novamente." });
    } finally { setBusyKey(null); }
  }

  return <section className="gift-registry" aria-labelledby="gift-registry-title">
    <div className="gift-registry-intro"><Gift aria-hidden="true" /><div>
      <h3 id="gift-registry-title">Escolha um presente</h3>
      <p>{invitationCode ? "Reserve uma opção para evitar presentes repetidos. Apenas o casal saberá quem fez a reserva." :
        "Abra esta lista através do seu link personalizado para reservar um presente."}</p>
    </div></div>
    <ol className="gift-registry-list">{gifts.map((gift, index) => {
      const reservation = reservationByGift.get(gift.key); const busy = busyKey === gift.key;
      return <li key={gift.key} className={`gift-registry-item ${reservation ? `is-${reservation.status}` : "is-available"}`}>
        <span className="gift-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div className="gift-registry-copy"><strong>{gift.name}</strong><small>{giftStatus(reservation?.status, reservation?.isMine)}</small></div>
        <div className="gift-registry-actions">
          {!invitationCode ? <span className="gift-locked"><LockKeyhole aria-hidden="true" /> Link necessário</span> :
          !reservation ? <Button type="button" size="sm" disabled={busy} onClick={() => updateGift(gift.key, "reservar")}><Gift aria-hidden="true" /> {busy ? "A reservar…" : "Reservar"}</Button> :
          reservation.isMine ? <>{reservation.status === "reservado" ?
            <Button type="button" size="sm" disabled={busy} onClick={() => updateGift(gift.key, "comprado")}><ShoppingBag aria-hidden="true" /> Marcar comprado</Button> :
            <span className="gift-owned"><Check aria-hidden="true" /> Comprado por si</span>}
            <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => updateGift(gift.key, "libertar")}><Undo2 aria-hidden="true" /> Libertar</Button></> :
          <span className="gift-unavailable"><Check aria-hidden="true" /> {reservation.status === "comprado" ? "Já oferecido" : "Reservado"}</span>}
        </div>
      </li>;
    })}</ol>
  </section>;
}

function giftStatus(status?: GiftReservationStatus, isMine?: boolean) {
  if (!status) return "Disponível para reserva";
  if (isMine && status === "comprado") return "Já confirmou a compra deste presente";
  if (isMine) return "Reservado por si";
  return status === "comprado" ? "Este presente já foi oferecido" : "Reservado por outro convidado";
}

export function ContributionCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopied(true); toast.success("Dados copiados", { description: "A informação está pronta para utilizar." }); window.setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); toast.error("Não foi possível copiar", { description: "Selecione e copie os dados manualmente." }); }
  }
  return <Button type="button" size="sm" variant="outline" onClick={copy}>
    {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copiado" : "Copiar"}
  </Button>;
}
