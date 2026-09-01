export type Attendance = "pendente" | "sim" | "nao";

export type Invitee = {
  id: string;
  fullName: string;
  role: "principal" | "acompanhante";
  sortOrder: number;
  attendance: Attendance;
};

export type Invitation = {
  id: string;
  code: string;
  primaryName: string;
  phone: string | null;
  responseNote: string | null;
  respondedAt: number | null;
  createdAt: number;
  invitees: Invitee[];
};

export type InvitationInput = {
  primaryName: string;
  companions: string[];
  phone?: string;
};
