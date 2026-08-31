import {
  ArrowUpRight,
  CheckCircle2,
  Gift,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/rsvp-form";
import { MusicPlayer } from "@/components/music-player";

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

export default async function Home() {
  let allGuests: { id: string; name: string; companion: string | null; allowedGuests: number }[] = [];

  try {
    const { getDb } = await import("@/db");
    const { guests: guestsSchema } = await import("@/db/schema");
    const db = getDb();

    if (db) {
      allGuests = await db.select().from(guestsSchema);
    }
  } catch {
    // Base de dados não disponível localmente — funciona sem ela
  }

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

        <section id="confirmacao" className="rsvp-section" aria-labelledby="rsvp-title">
          <div className="section-heading">
            <SectionOrnament />
            <p className="detail-kicker">Responda ao convite</p>
            <h2 id="rsvp-title">Confirme a sua presença</h2>
            <p>
              Preencha os dados abaixo. A sua resposta será enviada diretamente
              aos noivos pelo WhatsApp.
            </p>
          </div>
          <RsvpForm recipient={invitation.rsvpWhatsapp} guests={allGuests} />
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
