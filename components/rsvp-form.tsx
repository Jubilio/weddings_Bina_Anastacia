"use client";

import { useState, type FormEvent } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type Attendance = "sim" | "nao" | "";

export function RsvpForm({ recipient, guests }: { recipient: string; guests: any[] }) {
  const [selectedGuestId, setSelectedGuestId] = useState<string>("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [error, setError] = useState("");

  const selectedGuest = guests.find((g) => g.id === selectedGuestId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedGuest || !attendance) {
      setError("Por favor, selecione o seu nome e escolha uma resposta.");
      return;
    }

    const note = String(new FormData(event.currentTarget).get("note") ?? "").trim();
    const isAttending = attendance === "sim";

    const lines = [
      "Olá, Anastácia e Bina!",
      "",
      "Gostaria de responder ao vosso convite de casamento.",
      `Nome: ${selectedGuest.name}`,
    ];

    if (selectedGuest.companion) {
      lines.push(`Acompanhante: ${selectedGuest.companion}`);
    }

    lines.push(
      `Confirmação: ${
        isAttending
          ? "Confirmamos a nossa presença"
          : "Infelizmente não poderei comparecer"
      }`
    );

    if (isAttending) {
      lines.push(`Número de pessoas (aprovadas): ${selectedGuest.allowedGuests}`);
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
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-6 flex gap-3 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <strong>N.B:</strong> O convite é válido estritamente para o número de pessoas indicado. <strong>Não é extensivo a crianças</strong> e não é permitida a delegação do convite a terceiros.
        </div>
      </div>

      <div className="form-field">
        <Label htmlFor="guestSelect">Selecione o seu nome na lista</Label>
        <select
          id="guestSelect"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedGuestId}
          onChange={(e) => {
            setSelectedGuestId(e.target.value);
            setError("");
          }}
          required
        >
          <option value="" disabled>-- Procurar o meu nome --</option>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.name} {guest.companion ? `(& ${guest.companion})` : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedGuest && (
        <fieldset className="form-field mt-4">
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
      )}

      {selectedGuest && attendance && (
        <div className="form-field">
          <Label htmlFor="note">Mensagem aos noivos (opcional)</Label>
          <Textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Escreva uma breve mensagem"
          />
        </div>
      )}

      <p className="form-error" role="alert" aria-live="polite">
        {error}
      </p>

      {selectedGuest && attendance && (
        <Button type="submit" size="lg" className="rsvp-submit">
          <Send aria-hidden="true" />
          Enviar confirmação por WhatsApp
        </Button>
      )}

      {selectedGuest && attendance && (
        <p className="form-note">
          Ao enviar, o WhatsApp abrirá com a sua confirmação pronta.
        </p>
      )}
    </form>
  );
}
