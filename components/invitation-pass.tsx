"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, TicketCheck, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { formatInvitationCode } from "@/lib/invitation-code";
import type { Invitation } from "@/lib/invitation-types";

export function InvitationPass({ invitation }: { invitation: Invitation }) {
  const [passUrl, setPassUrl] = useState("");

  useEffect(() => {
    const url = new URL(window.location.origin);
    url.searchParams.set("convite", invitation.code);
    setPassUrl(url.toString());
  }, [invitation.code]);

  const attendingCount = invitation.invitees.filter(
    (person) => person.attendance === "sim",
  ).length;

  return (
    <article className="invitation-pass" aria-labelledby="invitation-pass-title">
      <div className="pass-heading">
        <div className="pass-icon" aria-hidden="true">
          <TicketCheck />
        </div>
        <p className="detail-kicker">Identificação oficial</p>
        <h3 id="invitation-pass-title">Passe Digital do Convite</h3>
        <p>
          Apresente este passe na entrada do salão, caso seja solicitado pela organização.
        </p>
      </div>

      <div className="pass-content">
        <div className="pass-guests">
          <p className="pass-label">Pessoas deste convite</p>
          <ul>
            {invitation.invitees.map((person) => (
              <li key={person.id}>
                <div>
                  <strong>{person.fullName}</strong>
                  <span>{person.role === "principal" ? "Convidado principal" : "Acompanhante"}</span>
                </div>
                <small className={`pass-status status-${person.attendance}`}>
                  {person.attendance === "sim" ? (
                    <><CheckCircle2 aria-hidden="true" /> Confirmado</>
                  ) : (
                    <><XCircle aria-hidden="true" /> Não comparece</>
                  )}
                </small>
              </li>
            ))}
          </ul>

          <div className="pass-summary">
            <span>Presenças confirmadas</span>
            <strong>{attendingCount} de {invitation.invitees.length}</strong>
          </div>
        </div>

        <div className="pass-qr-block">
          {passUrl ? (
            <QRCodeSVG
              value={passUrl}
              size={164}
              level="H"
              marginSize={4}
              bgColor="#fffdf8"
              fgColor="#2f352e"
              title={`QR Code do convite de ${invitation.primaryName}`}
            />
          ) : (
            <div className="pass-qr-placeholder" aria-label="A preparar o QR Code" />
          )}
          <span>Leia para abrir este convite</span>
        </div>
      </div>

      <div className="pass-code">
        <span>Código único do convite</span>
        <strong>{formatInvitationCode(invitation.code)}</strong>
      </div>

      <p className="pass-note">
        Este link e código identificam exclusivamente as pessoas indicadas acima e não podem ser transferidos.
      </p>
    </article>
  );
}
