"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Clipboard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encodeInvitationCode, type InvitedPair } from "@/lib/invitation-code";

type ManagedInvitation = {
  id: string;
  names: InvitedPair;
  createdAt: number;
};

const storageKey = "bina-anastacia-invitations-v1";

export default function AdminPage() {
  const [invitations, setInvitations] = useState<ManagedInvitation[]>([]);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let storedInvitations: ManagedInvitation[] = [];
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) storedInvitations = JSON.parse(stored) as ManagedInvitation[];
    } catch {
      window.localStorage.removeItem(storageKey);
    }

    const timer = window.setTimeout(() => {
      setInvitations(storedInvitations);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function persist(next: ManagedInvitation[]) {
    setInvitations(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function addInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const names: InvitedPair = [firstName.trim(), secondName.trim()];
    if (names.some((name) => name.length < 2)) return;

    persist([
      { id: crypto.randomUUID(), names, createdAt: Date.now() },
      ...invitations,
    ]);
    setFirstName("");
    setSecondName("");
  }

  async function copyInvitation(invitation: ManagedInvitation) {
    const code = encodeInvitationCode(invitation.names);
    const link = `${window.location.origin}/?convite=${encodeURIComponent(code)}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(invitation.id);
    window.setTimeout(() => setCopiedId(null), 1800);
  }

  function removeInvitation(id: string) {
    if (!window.confirm("Eliminar este convite da lista deste dispositivo?")) return;
    persist(invitations.filter((invitation) => invitation.id !== id));
  }

  return (
    <main className="min-h-screen bg-stone-100 p-5 font-sans text-stone-900 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
              Anastácia &amp; Bina
            </p>
            <h1 className="mt-2 text-3xl font-bold">Gestão de convidados</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Defina os dois nomes, crie o convite e envie apenas o link
              personalizado. Os convidados não poderão escrever ou substituir nomes.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/">Ver convite</Link>
          </Button>
        </div>

        <section className="mb-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold">Novo convite</h2>
          <p className="mb-5 text-sm text-stone-600">
            Cada convite deve conter exatamente duas pessoas nominalmente indicadas.
          </p>
          <form className="grid gap-4" onSubmit={addInvitation}>
            <div>
              <Label htmlFor="firstName">Primeira pessoa convidada</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Nome completo"
                maxLength={120}
                required
              />
            </div>
            <div>
              <Label htmlFor="secondName">Segunda pessoa convidada</Label>
              <Input
                id="secondName"
                value={secondName}
                onChange={(event) => setSecondName(event.target.value)}
                placeholder="Nome completo"
                maxLength={120}
                required
              />
            </div>
            <div className="rounded-md border-l-4 border-amber-600 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>NB:</strong> válido apenas para estas duas pessoas, sem
              extensão a crianças e sem substituição, transferência ou delegação.
            </div>
            <Button type="submit" className="w-full sm:w-fit">
              <Plus aria-hidden="true" /> Criar convite personalizado
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Convites neste dispositivo</h2>
          <p className="mt-1 text-sm text-stone-600">
            {ready
              ? `${invitations.length} convite${invitations.length === 1 ? "" : "s"}`
              : "A carregar…"}
          </p>

          <div className="mt-5 grid gap-3">
            {invitations.map((invitation) => (
              <article
                className="flex flex-col gap-4 rounded-md border border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                key={invitation.id}
              >
                <div>
                  <p className="font-semibold">{invitation.names[0]}</p>
                  <p className="text-sm text-stone-600">&amp; {invitation.names[1]}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={() => copyInvitation(invitation)}>
                    {copiedId === invitation.id ? (
                      <><Check aria-hidden="true" /> Copiado</>
                    ) : (
                      <><Clipboard aria-hidden="true" /> Copiar link</>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Eliminar convite"
                    onClick={() => removeInvitation(invitation.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
            {ready && invitations.length === 0 ? (
              <p className="rounded-md bg-stone-50 p-5 text-sm text-stone-500">
                Ainda não há convites. Preencha os dois nomes acima para começar.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
