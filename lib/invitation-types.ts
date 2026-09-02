/**
 * Tipo de presença confirmada
 * - "pendente": Não respondeu ainda
 * - "sim": Confirmou presença
 * - "nao": Não poderá comparecer
 */
export type Attendance = "pendente" | "sim" | "nao";

/**
 * Pessoa convidada individual
 * 
 * POLÍTICA: Cada convidado é nominal e intransmissível
 * - Confirmação individual obrigatória
 * - Não se estende a crianças ou acompanhantes não nomeados
 * - Não permite substituição, transferência ou delegação
 */
export type Invitee = {
  id: string;
  fullName: string;
  role: "principal" | "acompanhante"; // Posição no convite (principal = primeiro)
  sortOrder: number;
  attendance: Attendance;
};

/**
 * Convite personalizado
 * 
 * POLÍTICA IMPORTANTE:
 * ✓ Exclusivamente nominal - para as pessoas específicas indicadas
 * ✓ Intransmissível - não permite transferência a terceiros
 * ✓ Sem acompanhantes - não se estende a crianças ou outras pessoas
 * ✓ Confirmação individual - cada pessoa responde separadamente
 * 
 * O convite pode ser para 1 ou 2 pessoas (invitees array com 1 ou 2 elementos)
 */
export type Invitation = {
  id: string;
  code: string; // Código único e seguro para acesso ao convite
  primaryName: string; // Nome da primeira pessoa (para referência)
  phone: string | null;
  responseNote: string | null;
  respondedAt: number | null;
  checkedInAt: number | null;
  createdAt: number;
  invitees: Invitee[]; // Array com 1 ou 2 pessoas (nunca vazio, nunca mais de 2)
};

/**
 * Dados para criar ou atualizar convite
 * 
 * REGRAS DE VALIDAÇÃO:
 * - primaryName é obrigatório (2-120 caracteres)
 * - companions pode ter 0 ou 1 elemento (uma segunda pessoa é opcional)
 * - Total máximo: 2 pessoas por convite
 */
export type InvitationInput = {
  primaryName: string;
  companions: string[]; // 0 ou 1 elemento (não 2 ou mais)
  phone?: string;
};
