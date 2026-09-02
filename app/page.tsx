import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gift,
  Heart,
  MapPin,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/rsvp-form";
import { RandomLoveMessage } from "@/components/random-love-message";
import { MusicPlayer } from "@/components/music-player";
import { InvitationPass } from "@/components/invitation-pass";
import { SplashScreen, WeddingCountdown } from "@/components/wedding-experience";
import { getInvitationByCode } from "@/lib/invitations";
import { rsvpIsOpen, WEDDING } from "@/lib/wedding";

export const dynamic = "force-dynamic";

const floatingHearts = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 8) % 100}%`,
  size: `${9 + (index % 4) * 4}px`,
  delay: `${(index % 6) * 2.2}s`,
  duration: `${14 + (index % 5) * 4}s`,
  opacity: 0.12 + (index % 4) * 0.09,
}));

const invitation = {
  family: "FAMÍLIA HILÁRIO",
  groom: "BINA MIGUEL HILÁRIO",
  bride: "ANASTÁCIA HERMÍNIO ALBERTO",
  rsvpHref: "#confirmacao",
  locationHref: "#localizacao",
  rsvpWhatsapp: "258844584164",
};

type Props = { searchParams: Promise<{ convite?: string | string[] }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const code = Array.isArray(params.convite) ? params.convite[0] : params.convite;
  return { robots: code ? { index: false, follow: false, noarchive: true } : undefined };
}


function Monogram() {
  return (
    <div className="monogram" aria-hidden="true">
      <span>A</span>
      <Heart className="monogram-heart" strokeWidth={1.25} />
      <span>B</span>
    </div>
  );
}

function SectionOrnament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}

export default async function Home({
  searchParams,
}: Props) {
  const params = await searchParams;
  const code = Array.isArray(params.convite) ? params.convite[0] : params.convite;
  const foundInvitation = code ? await getInvitationByCode(code) : null;
  const personalizedInvitation =
    foundInvitation && foundInvitation.invitees.length > 0
      ? foundInvitation
      : null;
  const canRespond = rsvpIsOpen();
  const giftsHref = personalizedInvitation ? `/presentes?convite=${personalizedInvitation.code}` : "/presentes";

  return (
    <main className="invitation-page">
      <SplashScreen />
      <MusicPlayer />
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />
      <div className="floating-hearts" aria-hidden="true">
        {floatingHearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              width: heart.size,
              height: heart.size,
              opacity: heart.opacity,
              ['--heart-opacity' as string]: heart.opacity,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <article className="invitation-shell">
        <section className="hero" aria-labelledby="couple-names">
          <div className="ornament ornament-top" aria-hidden="true">
            <span />
            <i>✦</i>
            <span />
          </div>

          <Monogram />

          <p className="eyebrow">Convite de casamento</p>
          <p className="family-line">{invitation.family}</p>
          <p className="invitation-copy">
            tem a honra de convidar para a celebração do casamento de
          </p>

          <h1 id="couple-names" className="couple-names">
            <span>Anastácia</span>
            <em>&amp;</em>
            <span>Bina</span>
          </h1>

          <div className="full-names" aria-label="Nomes completos dos noivos">
            <p>{invitation.bride}</p>
            <span aria-hidden="true" />
            <p>{invitation.groom}</p>
          </div>

          <p className="message">
            Dois caminhos, uma promessa e uma vida inteira por celebrar.
          </p>

          {personalizedInvitation ? (
            <aside className="personal-invitation" aria-label="Pessoas convidadas">
              <span>Este convite é exclusivamente para</span>
              <h2>
                {personalizedInvitation.invitees
                  .map((person) => person.fullName)
                  .join(" e ")}
              </h2>
              <p>Esperamos celebrar este momento convosco.</p>
            </aside>
          ) : null}

          <RandomLoveMessage />

          <div className="announcement" role="note">
            <span className="announcement-label">19 de Dezembro de 2026</span>
            <p>
              A cerimónia terá lugar no <strong>Conservatório, na Cidade de Nampula, pelas 10h00</strong>, e o almoço será servido no <strong>Salão de Eventos da Academia Militar, pelas 14h00</strong>.
            </p>
          </div>

          <WeddingCountdown />

          <div className="hero-actions" aria-label="Informações do casamento">
            <Button asChild size="lg" className="primary-action rsvp-action">
              <a href={invitation.rsvpHref}>
                <CheckCircle2 aria-hidden="true" />
                Confirmar presença
                <ArrowUpRight className="action-arrow" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="secondary-action">
              <a href={giftsHref}>
                <Gift aria-hidden="true" />
                Ver presentes
                <ArrowUpRight className="action-arrow" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="secondary-action">
              <a href="/evento.ics" download>
                <CalendarDays aria-hidden="true" />
                Adicionar ao calendário
                <ArrowUpRight className="action-arrow" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="secondary-action">
              <a href={invitation.locationHref}>
                <MapPin aria-hidden="true" />
                Ver localização
                <ArrowUpRight className="action-arrow" aria-hidden="true" />
              </a>
            </Button>
          </div>

          <p className="tap-hint">Toque nos botões para ver os detalhes</p>
        </section>

        <section className="couple-story" aria-labelledby="couple-story-title">
          <div className="couple-story-heading">
            <p className="detail-kicker">Um pouco de nós</p>
            <p className="story-symbols" aria-hidden="true">💍 ❤️ 💍</p>
            <h2 id="couple-story-title">A nossa história de amor</h2>
          </div>

          <div className="story-chapter story-chapter-first">
            <div className="story-copy">
              <p className="story-lead">
                Há um ano, dois olhares encontraram-se por acaso. <span aria-hidden="true">👀✨</span>
              </p>
              <p>
                Foi apenas um instante, mas aquele olhar despertou algo especial
                nos dois. Sem saberem, naquele momento começava uma história que
                mudaria as suas vidas. <span aria-hidden="true">❤️</span>
              </p>
              <p>
                Depois daquele encontro, vieram as conversas <span aria-hidden="true">💬</span>,
                os passeios <span aria-hidden="true">🌹</span>, os momentos partilhados
                <span aria-hidden="true"> 🥰</span> e, pouco a pouco, descobriram que havia
                algo diferente entre eles. O que começou com um simples olhar
                transformou-se em carinho, cumplicidade e, finalmente, em amor.
                <span aria-hidden="true"> ❤️</span>
              </p>
            </div>

            <figure className="couple-photo couple-photo-feature">
              <Image
                src="/images/noivos-momento.png"
                alt="Anastácia e Bina num momento carinhoso"
                width={1512}
                height={1336}
                sizes="(max-width: 760px) 100vw, 46vw"
              />
              <figcaption>O amor vive nos pequenos momentos.</figcaption>
            </figure>
          </div>

          <div className="story-chapter story-chapter-second">
            <figure className="couple-photo couple-photo-portrait">
              <Image
                src="/images/noivos-retrato.png"
                alt="Anastácia e Bina juntos, vestidos de branco"
                width={960}
                height={1280}
                sizes="(max-width: 760px) 100vw, 38vw"
              />
              <figcaption>Dois caminhos, um só futuro.</figcaption>
            </figure>

            <div className="story-copy">
              <p>
                Ao longo deste tempo, aprenderam a caminhar juntos
                <span aria-hidden="true"> 🤝</span>, a apoiar-se nos momentos difíceis e
                a celebrar cada conquista. <span aria-hidden="true">✨</span> Foi então que
                perceberam que não queriam apenas viver momentos juntos, mas
                construir uma vida lado a lado. <span aria-hidden="true">🏡❤️</span>
              </p>
              <p>
                E hoje, com o coração cheio de amor <span aria-hidden="true">💕</span> e a
                certeza de que encontraram um no outro um companheiro para a
                vida, decidiram dar o passo mais bonito da sua história:
                <strong> casar!</strong> <span aria-hidden="true">💍👰🤵❤️</span>
              </p>

              <div className="story-promises" aria-label="O nosso futuro">
                <p><span aria-hidden="true">📅</span> A data está marcada.</p>
                <p><span aria-hidden="true">🥂</span> O amor está confirmado.</p>
                <p><span aria-hidden="true">💞</span> E o futuro será vivido a dois.</p>
              </div>
            </div>
          </div>

          <div className="story-finale">
            <p>
              Aquele olhar que, há um ano, deu início a tudo
              <span aria-hidden="true"> 👀❤️</span> será para sempre lembrado como o
              primeiro capítulo de uma história que agora ganha um novo começo…
            </p>
            <strong>✨ Uma vida a dois, um amor para sempre! ✨</strong>
          </div>
        </section>

        <section id="confirmacao" className="rsvp-section" aria-labelledby="rsvp-title">
          <div className="section-heading">
            <SectionOrnament />
            <p className="detail-kicker">
              {personalizedInvitation?.respondedAt ? "Convite confirmado" : "Responda ao convite"}
            </p>
            <h2 id="rsvp-title">
              {personalizedInvitation?.respondedAt
                ? "O seu Passe Digital"
                : "Confirme a sua presença"}
            </h2>
            <p>
              {personalizedInvitation?.respondedAt
                ? "Este link identifica oficialmente o seu convite e permanece disponível sempre que precisar de o apresentar."
                : personalizedInvitation
                  ? "Confirme individualmente a presença de cada pessoa indicada neste convite."
                  : "A confirmação deve ser realizada através do link personalizado enviado pelo casal."}
            </p>
          </div>
          {personalizedInvitation ? (
            personalizedInvitation.respondedAt ? (
              <div className="confirmed-invitation">
                <InvitationPass invitation={personalizedInvitation} />
                <details className="update-rsvp">
                  <summary>Alterar a confirmação de presença</summary>
                  {canRespond ? (
                    <RsvpForm recipient={invitation.rsvpWhatsapp} invitation={personalizedInvitation} />
                  ) : (
                    <p className="rsvp-deadline-closed">O prazo para alterar a confirmação terminou.</p>
                  )}
                </details>
              </div>
            ) : canRespond ? (
              <div className="pending-rsvp">
                <div className="rsvp-pending-note" role="status">
                  <Clock3 aria-hidden="true" />
                  <p>
                    <strong>A confirmação deste convite ainda está pendente.</strong>
                    <span>Indique abaixo quem poderá estar presente.</span>
                  </p>
                </div>
                <RsvpForm
                  recipient={invitation.rsvpWhatsapp}
                  invitation={personalizedInvitation}
                />
              </div>
            ) : (
              <div className="rsvp-locked" role="status">
                <Clock3 aria-hidden="true" />
                <p>O prazo para confirmar a presença terminou.</p>
              </div>
            )
          ) : (
            <div className="rsvp-locked" role="note">
              <CheckCircle2 aria-hidden="true" />
              <p>
                Para assegurar a correta identificação dos convidados, a
                confirmação de presença deverá ser realizada exclusivamente
                através do link personalizado enviado pelo casal, no qual
                constam os nomes associados ao convite.
              </p>
            </div>
          )}
          <p className="rsvp-deadline">Prazo de confirmação: <strong>{WEDDING.rsvpDeadlineLabel}</strong></p>
        </section>


        <section id="localizacao" className="location-section" aria-labelledby="location-title">
          <div className="detail-icon" aria-hidden="true">
            <MapPin />
          </div>
          <p className="detail-kicker">Onde celebrar</p>
          <h2 id="location-title">Localização</h2>
          <div className="location-grid">
            <article className="location-card">
              <span>Cerimónia — {WEDDING.ceremony.time}</span>
              <strong>{WEDDING.ceremony.name}</strong>
              <Button asChild variant="outline"><a href={WEDDING.ceremony.mapsUrl} target="_blank" rel="noreferrer">
                <Navigation aria-hidden="true" /> Abrir no Google Maps
              </a></Button>
            </article>
            <article className="location-card">
              <span>Almoço — {WEDDING.reception.time}</span>
              <strong>{WEDDING.reception.name}</strong>
              <Button asChild variant="outline"><a href={WEDDING.reception.mapsUrl} target="_blank" rel="noreferrer">
                <Navigation aria-hidden="true" /> Abrir no Google Maps
              </a></Button>
            </article>
          </div>
        </section>

        <footer className="invitation-footer">
          <SectionOrnament />
          <p>Esperamos por si</p>
          <span>Anastácia &amp; Bina</span>
        </footer>
      </article>
    </main>
  );
}
