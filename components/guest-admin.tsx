"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Clipboard, Download, Gift, LogOut, MessageCircle, Pencil, QrCode, Save, Search, Trash2, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatInvitationCode } from "@/lib/invitation-code";
import type { Invitation } from "@/lib/invitation-types";
import type { AdminGiftReservationView } from "@/lib/gifts";
import { WEDDING } from "@/lib/wedding";

type Draft = { primaryName: string; phone: string; companions: string[] };
type StatusFilter = "todos" | "pendentes" | "confirmados" | "recusados" | "checkin";
const emptyDraft: Draft = { primaryName: "", phone: "", companions: [""] };
function csvCell(value: string | number | null) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
function dateLabel(timestamp: number | null) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("pt-MZ", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Maputo" }).format(new Date(timestamp * 1000));
}
function whatsappNumber(phone: string | null) {
  if (!phone) return null; const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("258") && digits.length >= 11) return digits;
  if (digits.startsWith("0") && digits.length >= 9) return `258${digits.slice(1)}`;
  if (/^[8-9]\d{7,8}$/.test(digits)) return `258${digits}`;
  return digits.length >= 8 ? digits : null;
}

export function GuestAdmin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [giftReservations, setGiftReservations] = useState<AdminGiftReservationView[]>([]);
  const [password, setPassword] = useState(""); const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null); const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(""); const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");

  const loadInvitations = useCallback(async () => {
    const [response, giftsResponse] = await Promise.all([
      fetch("/api/admin/invitations", { cache: "no-store" }), fetch("/api/admin/gifts", { cache: "no-store" }),
    ]);
    if (response.status === 401 || giftsResponse.status === 401) { setAuthenticated(false); return; }
    const data = await response.json() as { invitations?: Invitation[]; error?: string };
    const giftsData = await giftsResponse.json() as { reservations?: AdminGiftReservationView[]; error?: string };
    if (!response.ok) throw new Error(data.error ?? "Não foi possível carregar os convidados.");
    if (!giftsResponse.ok) throw new Error(giftsData.error ?? "Não foi possível carregar os presentes.");
    setInvitations(data.invitations ?? []); setGiftReservations(giftsData.reservations ?? []); setAuthenticated(true);
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => loadInvitations().catch((error: unknown) => {
    setAuthenticated(false); setMessage(error instanceof Error ? error.message : "Não foi possível entrar.");
  }), 0); return () => window.clearTimeout(timer); }, [loadInvitations]);

  const totals = useMemo(() => { const people = invitations.flatMap((item) => item.invitees); return {
    invitations: invitations.length, people: people.length,
    confirmed: people.filter((person) => person.attendance === "sim").length,
    declined: people.filter((person) => person.attendance === "nao").length,
    checkedIn: invitations.filter((item) => item.checkedInAt).length, gifts: giftReservations.length,
  }; }, [giftReservations, invitations]);

  const filteredInvitations = useMemo(() => {
    const term = searchTerm.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();
    return invitations.filter((item) => {
      const status = statusFilter === "todos" || (statusFilter === "checkin" && Boolean(item.checkedInAt)) ||
        (statusFilter === "pendentes" && item.invitees.some((p) => p.attendance === "pendente")) ||
        (statusFilter === "confirmados" && item.invitees.some((p) => p.attendance === "sim")) ||
        (statusFilter === "recusados" && item.invitees.every((p) => p.attendance === "nao"));
      if (!status || !term) return status;
      return [item.code, formatInvitationCode(item.code), item.primaryName, item.phone ?? "", ...item.invitees.map((p) => p.fullName)]
        .join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().includes(term);
    });
  }, [invitations, searchTerm, statusFilter]);

  async function login(event: FormEvent) { event.preventDefault(); setBusy(true); setMessage(""); try {
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const data = await response.json() as { error?: string }; if (!response.ok) throw new Error(data.error ?? "Senha incorreta.");
    setPassword(""); await loadInvitations();
  } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível entrar."); } finally { setBusy(false); } }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setInvitations([]); setGiftReservations([]); }
  function resetDraft() { setDraft(emptyDraft); setEditingId(null); }
  function beginEdit(item: Invitation) { setEditingId(item.id); setDraft({ primaryName: item.primaryName, phone: item.phone ?? "",
    companions: [item.invitees.find((person) => person.role === "acompanhante")?.fullName ?? ""] }); window.scrollTo({ top: 0, behavior: "smooth" }); }
  async function save(event: FormEvent) { event.preventDefault(); setBusy(true); setMessage(""); try {
    const response = await fetch("/api/admin/invitations", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, ...draft }) });
    const data = await response.json() as { error?: string }; if (!response.ok) throw new Error(data.error ?? "Não foi possível guardar.");
    const edited = Boolean(editingId); resetDraft(); await loadInvitations(); setMessage(edited ? "Convite atualizado com sucesso." : "Convite criado com sucesso.");
  } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível guardar."); } finally { setBusy(false); } }
  async function remove(item: Invitation) { if (!window.confirm(`Eliminar o convite de ${item.primaryName}?`)) return;
    setBusy(true); try { const response = await fetch(`/api/admin/invitations?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const data = await response.json() as { error?: string }; if (!response.ok) throw new Error(data.error ?? "Não foi possível eliminar.");
      await loadInvitations(); setMessage("Convite eliminado."); } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível eliminar."); } finally { setBusy(false); } }
  async function copyLink(code: string) { await navigator.clipboard.writeText(`${window.location.origin}/?convite=${code}`); setCopiedCode(code); window.setTimeout(() => setCopiedCode(null), 1800); }
  function sendReminder(item: Invitation) { const number = whatsappNumber(item.phone); if (!number) { setMessage("Registe um telefone válido para enviar o lembrete por WhatsApp."); return; }
    const link = `${window.location.origin}/?convite=${item.code}#confirmacao`; const names = item.invitees.map((person) => person.fullName).join(" e ");
    const text = [`Olá, ${names}! 🤍`, "Estamos a preparar o nosso grande dia e gostaríamos de contar com a vossa resposta.",
      `Confirmem a presença até ${WEDDING.rsvpDeadlineLabel} através do vosso convite personalizado:`, link, "Com carinho, Anastácia & Bina 💍"].join("\n\n");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); }
  function exportCsv() { const header = ["Código", "Convite", "Telefone", "Pessoa", "Tipo", "Resposta", "Respondido em", "Check-in em"];
    const rows = invitations.flatMap((item) => item.invitees.map((person) => [formatInvitationCode(item.code), item.primaryName, item.phone, person.fullName, person.role, person.attendance, dateLabel(item.respondedAt), dateLabel(item.checkedInAt)]));
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n"); const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `convidados-anastacia-bina-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url); }

  if (authenticated === null) return <p className="admin-loading">A preparar a lista de convidados…</p>;
  if (!authenticated) return <main className="admin-login-page"><form className="admin-login-card" onSubmit={login}>
    <div className="admin-mark" aria-hidden="true">A<span>&amp;</span>B</div><p className="detail-kicker">Área reservada</p><h1>Gestão de convidados</h1>
    <p>Entre com a senha do casal para gerir os convites e as confirmações.</p><div className="form-field"><Label htmlFor="admin-password">Senha</Label>
      <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
    {message ? <p className="admin-message error">{message}</p> : null}<Button type="submit" disabled={busy}>{busy ? "A entrar…" : "Entrar"}</Button><Link href="/">Voltar ao convite</Link>
  </form></main>;

  return <main className="admin-page"><header className="admin-header"><div><p className="detail-kicker">Anastácia &amp; Bina</p><h1>Gestão de convidados</h1>
    <p>Crie convites, acompanhe confirmações e faça o check-in no salão.</p></div><div className="admin-header-actions">
      <Button asChild><Link href="/admin/check-in"><QrCode aria-hidden="true" /> Check-in</Link></Button><Button variant="outline" onClick={logout}><LogOut aria-hidden="true" /> Sair</Button>
    </div></header>
    <section className="admin-stats" aria-label="Resumo das confirmações">{[
      [totals.invitations, "Convites"], [totals.people, "Pessoas"], [totals.confirmed, "Confirmadas"], [totals.declined, "Não poderão ir"], [totals.checkedIn, "Check-ins"], [totals.gifts, "Presentes"],
    ].map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</section>
    <section className="admin-grid"><form className="guest-editor" onSubmit={save}><div className="admin-section-title"><UserPlus aria-hidden="true" /><div><p>{editingId ? "Editar convite" : "Novo convite"}</p><span>Indique uma ou duas pessoas para criar o link personalizado.</span></div></div>
      <div className="form-field"><Label htmlFor="primary-name">Primeira pessoa convidada</Label><Input id="primary-name" value={draft.primaryName} onChange={(e) => setDraft((d) => ({ ...d, primaryName: e.target.value }))} placeholder="Nome completo" maxLength={120} required /></div>
      <div className="form-field"><Label htmlFor="second-name">Segunda pessoa convidada (opcional)</Label><Input id="second-name" value={draft.companions[0] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, companions: [e.target.value] }))} placeholder="Nome completo" maxLength={120} /></div>
      <div className="form-field"><Label htmlFor="guest-phone">Telefone para lembrete (opcional)</Label><Input id="guest-phone" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} placeholder="84 000 0000" inputMode="tel" /></div>
      <div className="editor-actions"><Button type="submit" disabled={busy}><Save aria-hidden="true" />{busy ? "A guardar…" : editingId ? "Guardar alterações" : "Criar convite"}</Button>{editingId ? <Button type="button" variant="outline" onClick={resetDraft}>Cancelar</Button> : null}</div>{message ? <p className="admin-message">{message}</p> : null}
    </form><section className="guest-list" aria-labelledby="guest-list-title"><div className="admin-section-title admin-list-title"><Users aria-hidden="true" /><div><p id="guest-list-title">Convites registados</p><span>{invitations.length ? "Pesquise, filtre ou envie o link ao convidado." : "Ainda não há convidados."}</span></div><Button type="button" variant="outline" onClick={exportCsv} disabled={!invitations.length}><Download aria-hidden="true" /> Exportar CSV</Button></div>
      <div className="admin-list-tools"><div className="guest-search"><Search aria-hidden="true" /><Input type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar nome, telefone ou código" aria-label="Pesquisar convidado, telefone ou código" /></div>
        <Label className="admin-filter"><span>Estado</span><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}><option value="todos">Todos</option><option value="pendentes">Pendentes</option><option value="confirmados">Com presença</option><option value="recusados">Sem presença</option><option value="checkin">Com check-in</option></select></Label></div>
      {filteredInvitations.map((item) => <article className="guest-card" key={item.id}><div className="guest-card-heading"><div><h2>{item.primaryName}</h2><p>Convite para {item.invitees.length} {item.invitees.length === 1 ? "pessoa" : "pessoas"}</p><code>{formatInvitationCode(item.code)}</code></div><div className="guest-card-actions"><Button type="button" size="icon" variant="outline" aria-label="Editar convite" onClick={() => beginEdit(item)}><Pencil aria-hidden="true" /></Button><Button type="button" size="icon" variant="outline" aria-label="Eliminar convite" onClick={() => remove(item)}><Trash2 aria-hidden="true" /></Button></div></div>
        <ul className="invitee-status-list">{item.invitees.map((person) => <li key={person.id}><span>{person.fullName}</span><small className={`status-${person.attendance}`}>{person.attendance === "sim" ? "Confirmado" : person.attendance === "nao" ? "Não comparece" : "Pendente"}</small></li>)}</ul>
        {item.checkedInAt ? <p className="guest-checkin-status"><Check aria-hidden="true" /> Check-in em {dateLabel(item.checkedInAt)}</p> : null}<div className="guest-card-footer"><Button type="button" className="copy-link" onClick={() => copyLink(item.code)}>{copiedCode === item.code ? <><Check aria-hidden="true" /> Link copiado</> : <><Clipboard aria-hidden="true" /> Copiar link</>}</Button>
          {item.invitees.some((p) => p.attendance === "pendente") && item.phone ? <Button type="button" variant="outline" onClick={() => sendReminder(item)}><MessageCircle aria-hidden="true" /> Lembrar</Button> : null}</div>
      </article>)}{(searchTerm || statusFilter !== "todos") && !filteredInvitations.length ? <p className="admin-empty-search">Nenhum convite corresponde aos filtros.</p> : null}
    </section></section>
    <section className="admin-gift-report" aria-labelledby="admin-gifts-title"><div className="admin-section-title"><Gift aria-hidden="true" /><div><p id="admin-gifts-title">Reservas de presentes</p><span>Esta informação é visível apenas na área reservada do casal.</span></div></div>
      {giftReservations.length ? <div className="admin-gift-table-wrap"><table><thead><tr><th>Presente</th><th>Convite</th><th>Estado</th><th>Atualizado</th></tr></thead><tbody>{giftReservations.map((item) => <tr key={item.giftKey}><td>{item.giftName}</td><td><strong>{item.invitationName}</strong><code>{formatInvitationCode(item.invitationCode)}</code></td><td><span className={`gift-admin-status is-${item.status}`}>{item.status === "comprado" ? "Comprado" : "Reservado"}</span></td><td>{dateLabel(item.updatedAt)}</td></tr>)}</tbody></table></div> : <p className="admin-empty-search">Ainda não existem presentes reservados.</p>}
    </section>
  </main>;
}
