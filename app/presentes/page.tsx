import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Smartphone, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContributionCopyButton, GiftRegistry } from "@/components/gift-registry";
import { RandomLoveMessage } from "@/components/random-love-message";
import { listGiftReservations } from "@/lib/gift-reservations";
import { GIFT_ITEMS } from "@/lib/gifts";

export const dynamic = "force-dynamic";
type Props = { searchParams: Promise<{ convite?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const code = Array.isArray(params.convite) ? params.convite[0] : params.convite;
  return { title: "Lista de presentes | Anastácia & Bina",
    robots: code ? { index: false, follow: false, noarchive: true } : undefined };
}

function SectionOrnament() {
  return <div className="ornament" aria-hidden="true"><span /><i>✦</i><span /></div>;
}

export default async function Presentes({ searchParams }: Props) {
  const params = await searchParams;
  const code = Array.isArray(params.convite) ? params.convite[0] : params.convite;
  const { invitation, reservations } = await listGiftReservations(code);
  const backHref = invitation ? `/?convite=${invitation.code}` : "/";
  return <main className="invitation-page">
    <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
    <div className="ambient-glow ambient-glow-two" aria-hidden="true" />
    <article className="invitation-shell gifts-page-shell"><section className="gifts-section gifts-page-section">
      <div className="gifts-back-link"><Button asChild variant="outline"><Link href={backHref}>
        <ArrowLeft aria-hidden="true" /> Voltar ao convite
      </Link></Button></div>
      <div className="section-heading"><SectionOrnament /><p className="detail-kicker">Com carinho</p>
        <h1>Lista de presentes</h1><p>A vossa presença será sempre o nosso maior presente. Para quem desejar abençoar esta nova etapa, deixamos algumas sugestões.</p>
      </div>
      {invitation ? <div className="gift-personalized-note">Lista aberta através do convite de <strong>{invitation.primaryName}</strong>.</div> : null}
      <RandomLoveMessage />
      <GiftRegistry gifts={GIFT_ITEMS} initialReservations={reservations} invitationCode={invitation?.code ?? null} />
      <div className="contribution-wrap"><p className="contribution-title">Formas de contribuição</p>
        <p className="contribution-help">Também pode contribuir diretamente. Use o botão para copiar os dados sem erros.</p>
        <div className="contribution-grid">
          <div className="contribution-card"><WalletCards aria-hidden="true" /><span>Millennium BIM</span><strong>1155844629</strong><ContributionCopyButton value="1155844629" /></div>
          <div className="contribution-card"><Smartphone aria-hidden="true" /><span>M-Pesa</span><strong>84 458 4164</strong><ContributionCopyButton value="844584164" /></div>
          <div className="contribution-card"><Smartphone aria-hidden="true" /><span>e-Mola</span><strong>86 960 4617</strong><ContributionCopyButton value="869604617" /></div>
        </div>
      </div>
    </section></article>
  </main>;
}
