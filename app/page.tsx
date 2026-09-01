import {
  ArrowUpRight,
  CheckCircle2,
  Gift,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/rsvp-form";
import { RandomLoveMessage } from "@/components/random-love-message";
import { MusicPlayer } from "@/components/music-player";
import { getInvitationByCode } from "@/lib/invitations";

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
  bride: "ANASTÁCIA HERMÍNIO ALBRRTO",
  rsvpHref: "#confirmacao",
  giftsHref: "/presentes",
  locationHref: "#localizacao",
  rsvpWhatsapp: "258844584164",
};


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
}: {
  searchParams: Promise<{ convite?: string | string[] }>;
}) {
  const params = await searchParams;
  const code = Array.isArray(params.convite) ? params.convite[0] : params.convite;
  const foundInvitation = code ? await getInvitationByCode(code) : null;
  const personalizedInvitation =
    foundInvitation?.invitees.length === 2 ? foundInvitation : null;

  return (
    <main className="invitation-page">
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
              <span>Este convite é especialmente para</span>
              <h2>
                {personalizedInvitation.invitees
                  .map((person) => person.fullName)
                  .join(" • ")}
              </h2>
              <p>Esperamos celebrar este momento convosco.</p>
            </aside>
          ) : null}

          <RandomLoveMessage />

          <div className="announcement" role="note">
            <span className="announcement-label">19 de Dezembro de 2026</span>
            <p>
              Cidade de Nampula. A cerimónia terá lugar no Conservatório pelas
              10h. O almoço será servido no Salão de eventos da Academia Militar
              pelas 14h.
            </p>
          </div>

          <div className="hero-actions" aria-label="Informações do casamento">
            <Button asChild size="lg" className="primary-action rsvp-action">
              <a href={invitation.rsvpHref}>
                <CheckCircle2 aria-hidden="true" />
                Confirmar presença
                <ArrowUpRight className="action-arrow" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="secondary-action">
              <a href={invitation.giftsHref}>
                <Gift aria-hidden="true" />
                Ver presentes
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
            <h2 id="couple-story-title">A nossa história em imagens</h2>
            <p>
              Entre sorrisos, cumplicidade e sonhos partilhados, seguimos juntos
              para o nosso grande dia.
            </p>
          </div>

          <div className="couple-gallery">
            <figure className="couple-photo couple-photo-feature">
              <img
                src="/images/noivos-momento.png"
                alt="Anastácia e Bina num momento carinhoso"
                width={1512}
                height={1336}
                loading="lazy"
                decoding="async"
              />
              <figcaption>O amor vive nos pequenos momentos.</figcaption>
            </figure>
            <figure className="couple-photo couple-photo-portrait">
              <img
                src="/images/noivos-retrato.png"
                alt="Anastácia e Bina juntos, vestidos de branco"
                width={960}
                height={1280}
                loading="lazy"
                decoding="async"
              />
              <figcaption>Dois caminhos, um só futuro.</figcaption>
            </figure>
          </div>
        </section>

        <section id="confirmacao" className="rsvp-section" aria-labelledby="rsvp-title">
          <div className="section-heading">
            <SectionOrnament />
            <p className="detail-kicker">Responda ao convite</p>
            <h2 id="rsvp-title">Confirme a sua presença</h2>
            <p>Confirme individualmente a presença de cada pessoa indicada no convite.</p>
          </div>
          <p className="invitation-policy-note compact" role="note">
            <strong>NB:</strong> este convite é válido exclusivamente para as
            duas pessoas nominalmente indicadas. Não se estende a crianças e
            não permite substituição, transferência ou delegação a terceiros.
          </p>
          {personalizedInvitation ? (
            <RsvpForm
              recipient={invitation.rsvpWhatsapp}
              invitation={personalizedInvitation}
            />
          ) : (
            <div className="rsvp-locked" role="note">
              <CheckCircle2 aria-hidden="true" />
              <p>
                Para assegurar a correta identificação dos convidados, a
                confirmação de presença deverá ser realizada exclusivamente
                através do link personalizado enviado pelo casal, no qual
                constam os dois nomes associados ao convite.
              </p>
            </div>
          )}
        </section>


        <section id="localizacao" className="location-section" aria-labelledby="location-title">
          <div className="detail-icon" aria-hidden="true">
            <MapPin />
          </div>
          <p className="detail-kicker">Onde celebrar</p>
          <h2 id="location-title">Localização</h2>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <strong>Cerimónia (10h00):</strong><br/>
              Conservatório, Cidade de Nampula
            </div>
            <div>
              <strong>Almoço (14h00):</strong><br/>
              Salão de eventos da Academia Militar, Cidade de Nampula
            </div>
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
