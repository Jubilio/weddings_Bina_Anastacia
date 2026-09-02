export const GIFT_NAMES = [
  "Tapetes grandes para a sala", "Televisão de 55 polegadas", "Relógio de parede", "Mesa de centro",
  "Quadros decorativos", "Rack para TV", "Vasos decorativos", "Sofá", "Cortinas", "Mesa de jantar",
  "Jogo de taças", "Jogo de xícaras de café", "Jogo de xícaras de chá",
  "Kit de tábuas para cortar carne", "Batedeira", "Air fryer", "Chaleira elétrica", "Micro-ondas",
  "Taças de sobremesa", "Congelador", "Kit de toalhas de mão", "Jogo de panelas",
  "Tapetes para casa de banho", "Jogos de lençóis", "Conjunto de facas", "Jogos de pratos",
  "Jarra para sumo", "Kit de potes para temperos", "Torradeira", "Kit de colheres de pau",
  "Climatizador", "Kit de Pyrex com tampa", "Forno elétrico", "Kit de talheres",
  "Máquina de lavar roupa", "Bandejas diversas", "Panela de pressão elétrica", "Boleiro de vidro",
  "Jogos de copos de vidro liso", "Aspirador de pó",
] as const;

export const GIFT_ITEMS = GIFT_NAMES.map((name, index) => ({
  key: `presente-${String(index + 1).padStart(2, "0")}`,
  name,
}));

const giftKeys = new Set(GIFT_ITEMS.map((gift) => gift.key));
export function isGiftKey(value: string) {
  return giftKeys.has(value);
}

export type GiftReservationStatus = "reservado" | "comprado";
export type GiftReservationView = { giftKey: string; status: GiftReservationStatus; isMine: boolean };
export type AdminGiftReservationView = {
  giftKey: string;
  giftName: string;
  invitationCode: string;
  invitationName: string;
  status: GiftReservationStatus;
  updatedAt: number;
};
