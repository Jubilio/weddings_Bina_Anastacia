"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { InvitedPair } from "@/lib/invitation-code";

type Attendance = "sim" | "nao" | "";

export function RsvpForm({
  recipient,
  invitedNames,
}: {
  recipient: string;
  invitedNames: InvitedPair;
}) {
  const [answers, setAnswers] = useState<[Attendance, Attendance]>(["", ""]);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answers.some((answer) => !answer)) {
      setError("Confirme a presença de cada uma das duas pessoas indicadas.");
      return;
    }

    const note = String(new FormData(event.currentTarget).get("note") ?? "").trim();
    const lines = [
      "Olá, Anastácia e Bina! 🌿",
      "",
      "Confirmação do convite de casamento:",
      ...invitedNames.map(
        (name, index) =>
          `${answers[index] === "sim" ? "✅" : "❌"} ${name}: ${
            answers[index] === "sim" ? "presente" : "não poderá comparecer"
          }`,
      ),
    ];

    if (note) lines.push("", `Mensagem: ${note}`);
    setError("");
    window.open(
      `https://wa.me/${recipient}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="invitation-policy-note compact">
        <AlertCircle aria-hidden="true" />
        <p>
          <strong>NB:</strong> convite válido exclusivamente para estas duas
          pessoas. Não inclui crianças e não pode ser delegado ou transferido.
        </p>
      </div>

      <fieldset className="personal-rsvp-fieldset">
        <legend>Confirme cada pessoa deste convite</legend>
        <div className="personal-rsvp-list">
          {invitedNames.map((name, index) => (
            <div className="personal-rsvp-row" key={`${name}-${index}`}>
              <strong>{name}</strong>
              <RadioGroup
                name={`attendance-${index}`}
                value={answers[index]}
                onValueChange={(value) => {
                  setAnswers((current) => {
                    const next: [Attendance, Attendance] = [...current];
                    next[index] = value as Attendance;
                    return next;
                  });
                  setError("");
                }}
                className="person-attendance-options"
                required
              >
                <Label className="person-attendance-choice" htmlFor={`attendance-${index}-yes`}>
                  <RadioGroupItem id={`attendance-${index}-yes`} value="sim" /> Sim
                </Label>
                <Label className="person-attendance-choice" htmlFor={`attendance-${index}-no`}>
                  <RadioGroupItem id={`attendance-${index}-no`} value="nao" /> Não
                </Label>
              </RadioGroup>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="form-field">
        <Label htmlFor="note">Mensagem aos noivos (opcional)</Label>
        <Textarea id="note" name="note" rows={3} placeholder="Escreva uma breve mensagem" />
      </div>

      <p className="form-error" role="alert" aria-live="polite">{error}</p>

      <Button type="submit" size="lg" className="rsvp-submit">
        <Send aria-hidden="true" /> Enviar confirmação por WhatsApp
      </Button>
      <p className="form-note">Os dois nomes são definidos pelo casal e não podem ser alterados aqui.</p>
    </form>
  );
}
