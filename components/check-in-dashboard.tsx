"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Camera, CheckCircle2, QrCode, RotateCcw, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatInvitationCode, normalizeInvitationCode } from "@/lib/invitation-code";
import type { Invitation } from "@/lib/invitation-types";

type BarcodeDetectorLike = { detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>> };
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorLike;
function invitationCodeFrom(value: string) {
  try { const code = new URL(value).searchParams.get("convite"); return code ? normalizeInvitationCode(code) : null; }
  catch { return normalizeInvitationCode(value); }
}
function checkInTime(timestamp: number | null) {
  return timestamp ? new Intl.DateTimeFormat("pt-MZ", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Maputo" }).format(new Date(timestamp * 1000)) : null;
}

export function CheckInDashboard() {
  const [input, setInput] = useState(""); const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); const streamRef = useRef<MediaStream | null>(null); const frameRef = useRef<number | null>(null);
  const stopCamera = useCallback(() => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; setScanning(false); }, []);
  useEffect(() => stopCamera, [stopCamera]);
  const lookup = useCallback(async (value: string) => {
    const code = invitationCodeFrom(value); if (!code) { setInvitation(null); setMessage("Introduza um código ou link de convite válido."); return; }
    setBusy(true); setMessage(""); try {
      const response = await fetch(`/api/admin/check-in?code=${encodeURIComponent(code)}`, { cache: "no-store" });
      const data = await response.json() as { invitation?: Invitation; error?: string };
      if (response.status === 401) throw new Error("A sessão terminou. Volte à gestão de convidados e entre novamente.");
      if (!response.ok || !data.invitation) throw new Error(data.error ?? "Convite não encontrado.");
      setInput(formatInvitationCode(data.invitation.code)); setInvitation(data.invitation);
      setMessage(data.invitation.checkedInAt ? "Este convite já tem entrada registada." : "Convite identificado.");
    } catch (error) { setInvitation(null); setMessage(error instanceof Error ? error.message : "Não foi possível consultar o convite."); }
    finally { setBusy(false); }
  }, []);
  async function submitLookup(event: FormEvent) { event.preventDefault(); stopCamera(); await lookup(input); }
  async function changeCheckIn(checkedIn: boolean) { if (!invitation) return; setBusy(true); setMessage(""); try {
    const response = await fetch("/api/admin/check-in", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: invitation.code, checkedIn }) });
    const data = await response.json() as { invitation?: Invitation; error?: string };
    if (!response.ok || !data.invitation) throw new Error(data.error ?? "Não foi possível registar a entrada.");
    setInvitation(data.invitation); setMessage(checkedIn ? "Entrada registada com sucesso." : "Check-in removido.");
  } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível registar a entrada."); } finally { setBusy(false); } }
  async function startCamera() {
    setMessage(""); const Detector = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    if (!Detector || !navigator.mediaDevices?.getUserMedia) { setMessage("A leitura automática não está disponível neste navegador. Introduza o código manualmente."); return; }
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream; setScanning(true); await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const video = videoRef.current; if (!video) throw new Error("Não foi possível iniciar a câmara."); video.srcObject = stream; await video.play();
      const detector = new Detector({ formats: ["qr_code"] }); const scan = async () => { if (!streamRef.current || !videoRef.current) return;
        try { const results = await detector.detect(videoRef.current); const code = results[0]?.rawValue; if (code) { stopCamera(); await lookup(code); return; } } catch { /* Camera may be focusing. */ }
        frameRef.current = requestAnimationFrame(scan); }; frameRef.current = requestAnimationFrame(scan);
    } catch (error) { stopCamera(); setMessage(error instanceof Error ? error.message : "Não foi possível aceder à câmara. Use o código manual."); }
  }
  const attending = invitation?.invitees.filter((person) => person.attendance === "sim") ?? [];
  const registeredAt = checkInTime(invitation?.checkedInAt ?? null);
  return <main className="checkin-page"><header className="checkin-header"><div><p className="detail-kicker">Receção do casamento</p><h1>Check-in dos convidados</h1><p>Leia o QR Code do passe ou introduza o código único do convite.</p></div><Button asChild variant="outline"><Link href="/admin"><ArrowLeft aria-hidden="true" /> Gestão</Link></Button></header>
    <section className="checkin-panel"><form className="checkin-lookup" onSubmit={submitLookup}><label htmlFor="checkin-code">Código ou link do convite</label><div><Input id="checkin-code" value={input} onChange={(e) => setInput(e.target.value)} placeholder="BA-XXXXXX-XXXXXX-XXXXXX" autoComplete="off" required /><Button type="submit" disabled={busy}><Search aria-hidden="true" /> {busy ? "A consultar…" : "Consultar"}</Button></div></form>
      <div className="checkin-camera-actions"><span>ou</span>{scanning ? <Button type="button" variant="outline" onClick={stopCamera}>Parar câmara</Button> : <Button type="button" variant="outline" onClick={startCamera}><Camera aria-hidden="true" /> Ler QR Code</Button>}</div>
      {scanning ? <div className="checkin-scanner"><video ref={videoRef} muted playsInline aria-label="Leitor de QR Code" /><div aria-hidden="true"><QrCode /></div></div> : null}
      {message ? <p className="checkin-message" role="status">{message}</p> : null}</section>
    {invitation ? <section className={`checkin-result ${invitation.checkedInAt ? "is-checked-in" : ""}`}><div className="checkin-result-heading">{invitation.checkedInAt ? <CheckCircle2 aria-hidden="true" /> : <QrCode aria-hidden="true" />}<div><p>Convite identificado</p><h2>{invitation.primaryName}</h2><code>{formatInvitationCode(invitation.code)}</code></div></div>
      <div className="checkin-guest-list"><p>Pessoas com presença confirmada</p>{attending.length ? <ul>{attending.map((person) => <li key={person.id}><CheckCircle2 aria-hidden="true" /> {person.fullName}</li>)}</ul> : <p className="checkin-warning"><XCircle aria-hidden="true" /> Este convite não tem presenças confirmadas.</p>}</div>
      {registeredAt ? <p className="checkin-time">Entrada registada em {registeredAt}.</p> : null}<div className="checkin-result-actions">{invitation.checkedInAt ? <Button type="button" variant="outline" disabled={busy} onClick={() => changeCheckIn(false)}><RotateCcw aria-hidden="true" /> Desfazer check-in</Button> : <Button type="button" disabled={busy || !attending.length || !invitation.respondedAt} onClick={() => changeCheckIn(true)}><CheckCircle2 aria-hidden="true" /> Confirmar entrada</Button>}</div>
    </section> : null}
  </main>;
}
