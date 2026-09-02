import { WEDDING } from "@/lib/wedding";

export const dynamic = "force-dynamic";
export async function GET() {
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "PRODID:-//Anastacia e Bina//Convite de Casamento//PT", "BEGIN:VEVENT",
    "UID:casamento-anastacia-bina-20261219@nexovibe.workers.dev", "DTSTAMP:20260902T080000Z",
    "DTSTART:20261219T080000Z", "DTEND:20261219T160000Z",
    "SUMMARY:Casamento de Anastácia & Bina", `LOCATION:${WEDDING.ceremony.name}`,
    `DESCRIPTION:Cerimónia às ${WEDDING.ceremony.time} no ${WEDDING.ceremony.name}. Almoço às ${WEDDING.reception.time} no ${WEDDING.reception.name}.`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return new Response(calendar, { headers: {
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": 'attachment; filename="casamento-anastacia-bina.ics"',
    "Cache-Control": "public, max-age=86400",
  }});
}
