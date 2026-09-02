"use client";

import { useState, useSyncExternalStore } from "react";
import { CalendarDays, CheckCircle2, Download, Printer, TicketCheck, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { formatInvitationCode } from "@/lib/invitation-code";
import type { Invitation } from "@/lib/invitation-types";

function centeredText(context: CanvasRenderingContext2D, text: string, y: number, font: string, color: string) {
  context.font = font; context.fillStyle = color; context.textAlign = "center"; context.fillText(text, 540, y);
}
function subscribeToOrigin() { return () => undefined; }

export function InvitationPass({ invitation }: { invitation: Invitation }) {
  const [downloadMessage, setDownloadMessage] = useState("");
  const origin = useSyncExternalStore(subscribeToOrigin, () => window.location.origin, () => "");
  const passUrl = origin ? `${origin}/?convite=${invitation.code}` : "";
  const attendingCount = invitation.invitees.filter((person) => person.attendance === "sim").length;

  async function downloadPass() {
    const qr = document.getElementById(`pass-qr-${invitation.code}`);
    if (!(qr instanceof SVGSVGElement)) { setDownloadMessage("Não foi possível preparar o passe. Tente novamente."); return; }
    try {
      const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1350;
      const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas indisponível");
      context.fillStyle = "#f7f2e8"; context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#b9954d"; context.lineWidth = 5; context.strokeRect(42, 42, 996, 1266);
      centeredText(context, "ANASTÁCIA & BINA", 135, "600 34px Georgia, serif", "#b07b25");
      centeredText(context, "PASSE DIGITAL DO CONVITE", 202, "700 46px Georgia, serif", "#2f4a3c");
      centeredText(context, "19 DE DEZEMBRO DE 2026", 255, "500 24px Arial, sans-serif", "#6a6a61");
      invitation.invitees.forEach((person, index) => {
        centeredText(context, person.fullName, 355 + index * 82, "700 38px Georgia, serif", "#2f352e");
        centeredText(context, person.attendance === "sim" ? "PRESENÇA CONFIRMADA" : "NÃO COMPARECE",
          393 + index * 82, "600 20px Arial, sans-serif", person.attendance === "sim" ? "#2f684b" : "#8b4741");
      });
      const svg = new XMLSerializer().serializeToString(qr);
      const imageUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const image = new Image();
      await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("QR Code indisponível")); image.src = imageUrl; });
      context.drawImage(image, 350, 590, 380, 380); URL.revokeObjectURL(imageUrl);
      centeredText(context, formatInvitationCode(invitation.code), 1040, "700 30px ui-monospace, monospace", "#2f352e");
      centeredText(context, "Apresente este passe na entrada do salão.", 1110, "24px Arial, sans-serif", "#6a6a61");
      centeredText(context, "Conservatório · 10h  |  Academia Militar · 14h", 1160, "22px Arial, sans-serif", "#6a6a61");
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 1));
      if (!blob) throw new Error("Passe indisponível");
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url;
      anchor.download = `passe-${invitation.primaryName.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}.png`;
      anchor.click(); URL.revokeObjectURL(url); setDownloadMessage("Passe guardado no dispositivo.");
    } catch { setDownloadMessage("Não foi possível guardar o passe. Use a opção de imprimir."); }
  }

  return <article className="invitation-pass" aria-labelledby="invitation-pass-title">
    <div className="pass-heading"><div className="pass-icon" aria-hidden="true"><TicketCheck /></div>
      <p className="detail-kicker">Identificação oficial</p><h3 id="invitation-pass-title">Passe Digital do Convite</h3>
      <p>Apresente este passe na entrada do salão, caso seja solicitado pela organização.</p>
      {invitation.checkedInAt ? <span className="pass-checkin-badge"><CheckCircle2 aria-hidden="true" /> Entrada registada</span> : null}
    </div>
    <div className="pass-content"><div className="pass-guests"><p className="pass-label">Pessoas deste convite</p><ul>
      {invitation.invitees.map((person) => <li key={person.id}><div><strong>{person.fullName}</strong>
        <span>{person.role === "principal" ? "Convidado principal" : "Acompanhante"}</span></div>
        <small className={`pass-status status-${person.attendance}`}>{person.attendance === "sim" ?
          <><CheckCircle2 aria-hidden="true" /> Confirmado</> : <><XCircle aria-hidden="true" /> Não comparece</>}</small></li>)}
    </ul><div className="pass-summary"><span>Presenças confirmadas</span><strong>{attendingCount} de {invitation.invitees.length}</strong></div></div>
    <div className="pass-qr-block">{passUrl ? <QRCodeSVG id={`pass-qr-${invitation.code}`} value={passUrl} size={164} level="H" marginSize={4}
      bgColor="#fffdf8" fgColor="#2f352e" title={`QR Code do convite de ${invitation.primaryName}`} /> :
      <div className="pass-qr-placeholder" aria-label="A preparar o QR Code" />}<span>Leia para abrir este convite</span></div></div>
    <div className="pass-code"><span>Código único do convite</span><strong>{formatInvitationCode(invitation.code)}</strong></div>
    <div className="pass-actions"><Button type="button" onClick={downloadPass}><Download aria-hidden="true" /> Guardar passe</Button>
      <Button type="button" variant="outline" onClick={() => window.print()}><Printer aria-hidden="true" /> Imprimir / PDF</Button>
      <Button asChild variant="outline"><a href="/evento.ics"><CalendarDays aria-hidden="true" /> Calendário</a></Button></div>
    {downloadMessage ? <p className="pass-download-message" role="status">{downloadMessage}</p> : null}
    <p className="pass-note">Este código identifica as pessoas indicadas acima na entrada do salão.</p>
  </article>;
}
