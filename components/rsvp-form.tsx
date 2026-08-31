"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type Attendance = "sim" | "nao" | "";

export function RsvpForm({ recipient }: { recipient: string }) {
  const [attendance, setAttendance] = useState<Attendance>("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const guestName = String(formData.get("guestName") ?? "").trim();
    const guests = String(formData.get("guests") ?? "1").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!guestName || !attendance) {
      setError("Indique o seu nome e escolha uma resposta.");
      return;
    }

    const lines = [
      "Olá, Bina e Anastácia!",
      "",
      "Gostaria de responder ao vosso convite de casamento.",
      `Nome: ${guestName}`,
      `Confirmação: ${
        attendance === "sim"
          ? "Confirmo a minha presença"
          : "Infelizmente não poderei comparecer"
      }`,
    ];

    if (attendance === "sim") {
      lines.push(`Número de pessoas: ${guests || "1"}`);
    }

    if (note) {
      lines.push(`Mensagem: ${note}`);
    }

    const whatsappUrl = `https://wa.me/${recipient}?text=${encodeURIComponent(
      lines.join("\n"),
    )}`;

    setError("");
    window.open(whatsappUrl, "_blank");
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <Label htmlFor="guestName">Nome completo</Label>
        <Input
          id="guestName"
          name="guestName"
          autoComplete="name"
          placeholder="Como devemos identificar-lhe?"
          required
        />
      </div>

      <fieldset className="form-field">
        <legend>Vai estar presente?</legend>
        <RadioGroup
          name="attendance"
          className="attendance-options"
          value={attendance}
          onValueChange={(value) => setAttendance(value as Attendance)}
          required
        >
          <Label className="attendance-option" htmlFor="attendance-yes">
            <RadioGroupItem id="attendance-yes" value="sim" />
            <span>
              <strong>Sim, estarei presente</strong>
              <small>Será uma alegria celebrar convosco.</small>
            </span>
          </Label>
          <Label className="attendance-option" htmlFor="attendance-no">
            <RadioGroupItem id="attendance-no" value="nao" />
            <span>
              <strong>Não poderei comparecer</strong>
              <small>Envie-nos a sua resposta com carinho.</small>
            </span>
          </Label>
        </RadioGroup>
      </fieldset>

      {attendance === "sim" ? (
        <div className="form-field">
          <Label htmlFor="guests">Número de pessoas</Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            inputMode="numeric"
            min="1"
            max="10"
            defaultValue="1"
          />
        </div>
      ) : null}

      <div className="form-field">
        <Label htmlFor="note">Mensagem aos noivos (opcional)</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Escreva uma breve mensagem"
        />
      </div>

      <p className="form-error" role="alert" aria-live="polite">
        {error}
      </p>

      <Button type="submit" size="lg" className="rsvp-submit">
        <Send aria-hidden="true" />
        Enviar confirmação por WhatsApp
      </Button>

      <p className="form-note">
        Ao enviar, o WhatsApp abrirá com a sua confirmação pronta.
      </p>
    </form>
  );
}
