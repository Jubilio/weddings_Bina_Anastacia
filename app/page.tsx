import {
  ArrowUpRight,
  CheckCircle2,
  Gift,
  Heart,
  MapPin,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RsvpForm } from "@/components/rsvp-form";
import { MusicPlayer } from "@/components/music-player";

const invitation = {
  family: "FAMÍLIA HILÁRIO",
  groom: "BINA MIGUEL HILÁRIO",
  bride: "ANASTÁCIA HERMÍNIO ALBRRTO",
  rsvpHref: "#confirmacao",
  giftsHref: "#presentes",
  locationHref: "#localizacao",
  rsvpWhatsapp: "258844584164",
};

const giftItems = [
  "Tapetes grandes para a sala",
  "Televisão de 55 polegadas",
  "Relógio de parede",
  "Mesa de centro",
  "Quadros decorativos",
  "Rack para TV",
  "Vasos decorativos",
  "Sofá",
  "Cortinas",
  "Mesa de jantar",
  "Jogo de taças",
  "Jogo de xícaras de café",
  "Jogo de xícaras de chá",
  "Kit de tábuas para cortar carne",
  "Batedeira",
  "Air fryer",
  "Chaleira elétrica",
  "Micro-ondas",
  "Taças de sobremesa",
  "Congelador",
  "Kit de toalhas de mão",
  "Jogo de panelas",
  "Tapetes para casa de banho",
  "Jogos de lençóis",
  "Conjunto de facas",
  "Jogos de pratos",
  "Jarra para sumo",
  "Kit de potes para temperos",
  "Torradeira",
  "Kit de colheres de pau",
  "Climatizador",
  "Kit de Pyrex com tampa",
  "Forno elétrico",
  "Kit de talheres",
  "Máquina de lavar roupa",
  "Bandejas diversas",
  "Panela de pressão elétrica",
  "Boleiro de vidro",
  "Jogos de copos de vidro liso",
  "Aspirador de pó",
];

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

export default function Home() {
  return (
    <main className="invitation-page">
      <MusicPlayer />
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />

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
          <RsvpForm recipient={invitation.rsvpWhatsapp} />
        </section>

        <section id="presentes" className="gifts-section" aria-labelledby="gifts-title">
          <div className="section-heading">
            <SectionOrnament />
            <p className="detail-kicker">Com carinho</p>
            <h2 id="gifts-title">Lista de presentes</h2>
            <p>
              A vossa presença será sempre o nosso maior presente. Para quem
              desejar abençoar esta nova etapa, deixamos algumas sugestões.
            </p>
          </div>

          <ol className="gift-list">
            {giftItems.map((item, index) => (
              <li key={item}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>

          <div className="contribution-wrap">
            <p className="contribution-title">Formas de contribuição</p>
            <div className="contribution-grid">
              <div className="contribution-card">
                <WalletCards aria-hidden="true" />
                <span>Millennium BIM</span>
                <strong>1155844629</strong>
              </div>
              <div className="contribution-card">
                <Smartphone aria-hidden="true" />
                <span>M-Pesa</span>
                <strong>84 458 4164</strong>
              </div>
              <div className="contribution-card">
                <Smartphone aria-hidden="true" />
                <span>e-Mola</span>
                <strong>86 960 4617</strong>
              </div>
            </div>
          </div>
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
