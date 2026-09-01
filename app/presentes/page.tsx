import Link from "next/link";
import { ArrowLeft, Smartphone, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RandomLoveMessage } from "@/components/random-love-message";

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

function SectionOrnament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <i>✦</i>
      <span />
    </div>
  );
}

export default function Presentes() {
  return (
    <main className="invitation-page">
      <div className="ambient-glow ambient-glow-one" aria-hidden="true" />
      <div className="ambient-glow ambient-glow-two" aria-hidden="true" />

      <article className="invitation-shell">
        <section className="gifts-section" style={{ padding: '4rem 1rem' }}>
          
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
              </Link>
            </Button>
          </div>

          <div className="section-heading">
            <SectionOrnament />
            <p className="detail-kicker">Com carinho</p>
            <h2>Lista de presentes</h2>
            <p>
              A vossa presença será sempre o nosso maior presente. Para quem
              desejar abençoar esta nova etapa, deixamos algumas sugestões.
            </p>
          </div>

          <RandomLoveMessage />

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
      </article>
    </main>
  );
}
