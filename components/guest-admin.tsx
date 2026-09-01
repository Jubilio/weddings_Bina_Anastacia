"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Check,
  Clipboard,
  LogOut,
  Pencil,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInvitationCode } from "@/lib/invitation-code";
import type { Invitation } from "@/lib/invitation-types";

type Draft = {
  primaryName: string;
  phone: string;
  companions: string[];
};

const emptyDraft: Draft = {
  primaryName: "",
  phone: "",
  companions: [""],
};

export function GuestAdmin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadInvitations = useCallback(async () => {
    const response = await fetch("/api/admin/invitations", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = (await response.json()) as {
      invitations?: Invitation[];
      error?: string;
    };
    if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar os convidados.");
    setInvitations(data.invitations ?? []);
    setAuthenticated(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadInvitations().catch((error: unknown) => {
        setAuthenticated(false);
        setMessage(error instanceof Error ? error.message : "Não foi possível entrar.");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadInvitations]);

  const totals = useMemo(() => {
    const people = invitations.flatMap((invitation) => invitation.invitees);
    return {
      invitations: invitations.length,
      people: people.length,
      confirmed: people.filter((person) => person.attendance === "sim").length,
      declined: people.filter((person) => person.attendance === "nao").length,
    };
  }, [invitations]);

  const filteredInvitations = useMemo(() => {
    const normalizedTerm = searchTerm
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim()
      .toLowerCase();

    if (!normalizedTerm) return invitations;

    return invitations.filter((invitation) => {
      const searchable = [
        invitation.code,
        formatInvitationCode(invitation.code),
        invitation.primaryName,
        ...invitation.invitees.map((person) => person.fullName),
      ]
        .join(" ")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

      return searchable.includes(normalizedTerm);
    });
  }, [invitations, searchTerm]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Senha incorreta.");
      setPassword("");
      await loadInvitations();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setInvitations([]);
  }

  function resetDraft() {
    setDraft(emptyDraft);
    setEditingId(null);
  }

  function beginEdit(invitation: Invitation) {
    setEditingId(invitation.id);
    setDraft({
      primaryName: invitation.primaryName,
      phone: invitation.phone ?? "",
      companions: [
        invitation.invitees.find((person) => person.role === "acompanhante")
          ?.fullName ?? "",
      ],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/invitations", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...draft }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível guardar.");
      const wasEditing = Boolean(editingId);
      resetDraft();
      await loadInvitations();
      setMessage(wasEditing ? "Convite atualizado com sucesso." : "Convite criado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível guardar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(invitation: Invitation) {
    if (!window.confirm(`Eliminar o convite de ${invitation.primaryName}?`)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(
        `/api/admin/invitations?id=${encodeURIComponent(invitation.id)}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Não foi possível eliminar.");
      await loadInvitations();
      setMessage("Convite eliminado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível eliminar.");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink(code: string) {
    const link = `${window.location.origin}/?convite=${code}`;
    await navigator.clipboard.writeText(link);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1800);
  }

  if (authenticated === null) {
    return <p className="admin-loading">A preparar a lista de convidados…</p>;
  }

  if (!authenticated) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={login}>
          <div className="admin-mark" aria-hidden="true">A<span>&amp;</span>B</div>
          <p className="detail-kicker">Área reservada</p>
          <h1>Gestão de convidados</h1>
          <p>Entre com a senha do casal para cadastrar os dois nomes de cada convite.</p>
          <div className="form-field">
            <Label htmlFor="admin-password">Senha</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {message ? <p className="admin-message error">{message}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? "A entrar…" : "Entrar"}
          </Button>
          <Link href="/">Voltar ao convite</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="detail-kicker">Anastácia &amp; Bina</p>
          <h1>Gestão de convidados</h1>
          <p>Cadastre exatamente as duas pessoas autorizadas em cada convite.</p>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut aria-hidden="true" /> Sair
        </Button>
      </header>

      <section className="admin-stats" aria-label="Resumo das confirmações">
        <article><strong>{totals.invitations}</strong><span>Convites</span></article>
        <article><strong>{totals.people}</strong><span>Pessoas</span></article>
        <article><strong>{totals.confirmed}</strong><span>Confirmadas</span></article>
        <article><strong>{totals.declined}</strong><span>Não poderão ir</span></article>
      </section>

      <section className="admin-grid">
        <form className="guest-editor" onSubmit={save}>
          <div className="admin-section-title">
            <UserPlus aria-hidden="true" />
            <div>
              <p>{editingId ? "Editar convite" : "Novo convite"}</p>
              <span>Indique 1 ou 2 nomes que aparecerão no convite personalizado e intransmissível.</span>
            </div>
          </div>

          <div className="form-field">
            <Label htmlFor="primary-name">Primeira pessoa convidada</Label>
            <Input
              id="primary-name"
              value={draft.primaryName}
              onChange={(event) =>
                setDraft((current) => ({ ...current, primaryName: event.target.value }))
              }
              placeholder="Nome completo"
              maxLength={120}
              required
            />
          </div>

          <div className="form-field">
            <Label htmlFor="second-name">Segunda pessoa convidada (opcional)</Label>
            <Input
              id="second-name"
              value={draft.companions[0] ?? ""}
              onChange={(event) =>
                setDraft((current) => ({ ...current, companions: [event.target.value] }))
              }
              placeholder="Nome completo"
              maxLength={120}
            />
          </div>

          <div className="form-field">
            <Label htmlFor="guest-phone">Telefone (opcional)</Label>
            <Input
              id="guest-phone"
              value={draft.phone}
              onChange={(event) =>
                setDraft((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="84 000 0000"
              inputMode="tel"
            />
          </div>

          <p className="admin-policy-note">
            <strong>⚠️ Política de Convite:</strong><br/>
            • Exclusivamente nominal para a(s) pessoa(s) indicada(s)<br/>
            • Intransmissível: sem substituição, transferência ou delegação<br/>
            • Sem crianças ou acompanhantes não nomeados<br/>
            • Cada pessoa deve confirmar individualmente a sua presença
          </p>

          <div className="editor-actions">
            <Button type="submit" disabled={busy}>
              <Save aria-hidden="true" />
              {busy ? "A guardar…" : editingId ? "Guardar alterações" : "Criar convite"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetDraft}>
                Cancelar
              </Button>
            ) : null}
          </div>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>

        <section className="guest-list" aria-labelledby="guest-list-title">
          <div className="admin-section-title">
            <Users aria-hidden="true" />
            <div>
              <p id="guest-list-title">Convites cadastrados</p>
              <span>{invitations.length ? "Copie o link e envie ao convidado." : "Ainda não há convidados."}</span>
            </div>
          </div>

          <div className="guest-search">
            <Search aria-hidden="true" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Pesquisar nome ou código do convite"
              aria-label="Pesquisar convidado ou código"
            />
          </div>

          {filteredInvitations.map((invitation) => (
            <article className="guest-card" key={invitation.id}>
              <div className="guest-card-heading">
                <div>
                  <h2>{invitation.primaryName}</h2>
                  <p>Convite para duas pessoas</p>
                  <code>{formatInvitationCode(invitation.code)}</code>
                </div>
                <div className="guest-card-actions">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Editar convite"
                    onClick={() => beginEdit(invitation)}
                  >
                    <Pencil aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Eliminar convite"
                    onClick={() => remove(invitation)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <ul className="invitee-status-list">
                {invitation.invitees.map((person) => (
                  <li key={person.id}>
                    <span>{person.fullName}</span>
                    <small className={`status-${person.attendance}`}>
                      {person.attendance === "sim"
                        ? "Confirmado"
                        : person.attendance === "nao"
                          ? "Não comparece"
                          : "Pendente"}
                    </small>
                  </li>
                ))}
              </ul>

              <Button type="button" className="copy-link" onClick={() => copyLink(invitation.code)}>
                {copiedCode === invitation.code ? (
                  <><Check aria-hidden="true" /> Link copiado</>
                ) : (
                  <><Clipboard aria-hidden="true" /> Copiar link e passe</>
                )}
              </Button>
            </article>
          ))}

          {searchTerm && filteredInvitations.length === 0 ? (
            <p className="admin-empty-search">Nenhum convite corresponde à pesquisa.</p>
          ) : null}
        </section>
      </section>
    </main>
  );
}
