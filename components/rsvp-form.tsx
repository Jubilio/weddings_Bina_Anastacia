"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Invitation } from "@/lib/invitation-types";

type Answer = "sim" | "nao" | "";

export function RsvpForm({
  recipient,
  invitation,
}: {
  recipient: string;
  invitation: Invitation;
}) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(
      invitation.invitees.map((person) => [
        person.id,
        person.attendance === "pendente" ? "" : person.attendance,
      ]),
    ),
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allAnswered = useMemo(
    () =>
      invitation.invitees.every((person) =>
        ["sim", "nao"].includes(answers[person.id]),
      ),
    [answers, invitation],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const note = String(formData.get("note") ?? "").trim();

    if (!allAnswered) {
      setError("Confirme a presença de todas as pessoas indicadas no convite.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const responses = invitation.invitees.map((person) => ({
        inviteeId: person.id,
        attendance: answers[person.id] as "sim" | "nao",
      }));
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: invitation.code, responses, note }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível confirmar.");
      }

      const allAttending = invitation.invitees.every(
        (person) => answers[person.id] === "sim",
      );
      const lines = [
        "💍 *Confirmação de Presença*",
        "*Casamento de Anastácia & Bina*",
        "",
        allAttending
          ? "É com muita alegria que confirmamos a nossa presença neste dia tão especial. 🤍"
          : "Com carinho, enviamos a nossa resposta ao vosso convite para este dia tão especial. 🤍",
        "",
        `*Convite em nome de ${invitation.primaryName}*`,
        ...invitation.invitees.map(
          (person) =>
            `${answers[person.id] === "sim" ? "✅" : "❌"} *${person.fullName}* — ${
              answers[person.id] === "sim"
                ? "presença confirmada"
                : "não poderá comparecer"
            }`,
        ),
      ];
      if (note) lines.push("", `💌 *Mensagem:* ${note}`);
      lines.push(
        "",
        allAttending
          ? "É uma alegria fazer parte desta linda história. Que este novo capítulo seja repleto de amor, cumplicidade e felicidade! ✨🥂"
          : "Agradecemos o carinho do convite e desejamos-vos uma celebração inesquecível, repleta de amor e alegria! ✨🥂",
      );

      setSaved(true);
      window.setTimeout(() => {
        window.location.assign(
          `https://wa.me/${recipient}?text=${encodeURIComponent(lines.join("\n"))}`,
        );
      }, 500);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Não foi possível confirmar.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <p className="invitation-policy-note compact">
        <strong>NB:</strong> este convite é exclusivo para as duas pessoas
        indicadas. Não inclui crianças e não pode ser delegado ou transferido.
      </p>

      <fieldset className="personal-rsvp-fieldset">
        <legend>Confirme cada pessoa deste convite</legend>
        <div className="personal-rsvp-list">
          {invitation.invitees.map((person) => (
            <div className="personal-rsvp-row" key={person.id}>
              <p>
                <strong>{person.fullName}</strong>
                <small>
                  {person.role === "principal"
                    ? "Primeira pessoa"
                    : "Segunda pessoa"}
                </small>
              </p>
              <RadioGroup
                name={`attendance-${person.id}`}
                value={answers[person.id] ?? ""}
                onValueChange={(value) => {
                  setAnswers((current) => ({
                    ...current,
                    [person.id]: value as Answer,
                  }));
                  setError("");
                }}
                className="person-attendance-options"
                required
              >
                <Label
                  htmlFor={`${person.id}-yes`}
                  className="person-attendance-choice yes"
                >
                  <RadioGroupItem id={`${person.id}-yes`} value="sim" /> Sim
                </Label>
                <Label
                  htmlFor={`${person.id}-no`}
                  className="person-attendance-choice no"
                >
                  <RadioGroupItem id={`${person.id}-no`} value="nao" /> Não
                </Label>
              </RadioGroup>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="form-field">
        <Label htmlFor="note">Mensagem aos noivos (opcional)</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          maxLength={1000}
          placeholder="Escreva uma breve mensagem"
        />
      </div>

      <p className="form-error" role="alert" aria-live="polite">
        {error}
      </p>

      <Button
        type="submit"
        size="lg"
        className="rsvp-submit"
        disabled={saving || saved}
      >
        {saved ? <CheckCircle2 aria-hidden="true" /> : <Send aria-hidden="true" />}
        {saved
          ? "Confirmação guardada"
          : saving
            ? "A guardar…"
            : "Enviar confirmação por WhatsApp"}
      </Button>

      <p className="form-note">
        A confirmação ficará guardada e será também enviada aos noivos pelo WhatsApp.
      </p>
    </form>
  );
}
