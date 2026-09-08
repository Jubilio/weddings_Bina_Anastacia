import type { Invitation } from "./invitation-types";
import { WEDDING } from "./wedding";

export function invitationWhatsAppMessage(
  invitation: Pick<Invitation, "invitees">,
  link: string,
) {
  const names = invitation.invitees.map((person) => person.fullName).join(" e ");
  const plural = invitation.invitees.length > 1;

  return [
    `Olá, *${names}*! 🤍`,
    "Há momentos que se tornam ainda mais especiais quando partilhados com quem faz parte da nossa história.",
    `É com muita alegria que ${plural ? "vos convidamos" : "convidamos a si"} a celebrar o nosso casamento, no dia *${WEDDING.ceremonyDateLabel}*, na Cidade de Nampula. 💍`,
    `${plural ? "A vossa presença será" : "A sua presença será"} uma alegria para nós!`,
    `💌 ${plural ? "O vosso convite personalizado" : "O seu convite personalizado"}:\n${link}`,
    `${plural ? "Consultem" : "Consulte"} os detalhes e ${plural ? "confirmem a vossa" : "confirme a sua"} presença através do convite até *${WEDDING.rsvpDeadlineLabel}*.`,
    `Com carinho,\n*${WEDDING.couple}*`,
  ].join("\n\n");
}
