export type Guest = {
  id: string;
  name: string;
  companion?: string; // Nome do acompanhante (opcional)
  allowedGuests: number; // 1 ou 2
};

// Aqui vocês podem adicionar todos os vossos convidados!
export const GUEST_LIST: Guest[] = [
  {
    id: "1",
    name: "João Silva",
    companion: "Maria Silva",
    allowedGuests: 2,
  },
  {
    id: "2",
    name: "Ana Ferreira",
    allowedGuests: 1,
  },
  {
    id: "3",
    name: "Carlos Santos",
    companion: "Acompanhante",
    allowedGuests: 2,
  },
];
