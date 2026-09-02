export const WEDDING = {
  couple: "Anastácia & Bina",
  ceremonyDateLabel: "19 de dezembro de 2026",
  ceremonyStartUtc: "2026-12-19T08:00:00.000Z",
  celebrationEndUtc: "2026-12-19T16:00:00.000Z",
  rsvpDeadlineLabel: "30 de novembro de 2026",
  rsvpDeadlineUtc: "2026-11-30T21:59:59.999Z",
  ceremony: {
    name: "Conservatório, Cidade de Nampula",
    time: "10h00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Conservat%C3%B3rio%2C%20Cidade%20de%20Nampula%2C%20Mo%C3%A7ambique",
  },
  reception: {
    name: "Salão de Eventos da Academia Militar, Cidade de Nampula",
    time: "14h00",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Academia%20Militar%2C%20Cidade%20de%20Nampula%2C%20Mo%C3%A7ambique",
  },
} as const;

export function rsvpIsOpen(now = Date.now()) {
  return now <= Date.parse(WEDDING.rsvpDeadlineUtc);
}
