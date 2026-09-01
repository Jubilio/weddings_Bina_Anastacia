"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const weddingMessages = [
  "Hoje celebramos o começo de uma vida inteira lado a lado.",
  "O casamento é a promessa diária de escolher o amor, sempre.",
  "Duas histórias tornam-se uma só, escrita com amor e cumplicidade.",
  "Que nunca faltem risos, ternura e mãos dadas pelo caminho.",
  "Um grande amor transforma cada dia comum numa celebração.",
  "Juntos, todos os caminhos conduzem ao lar.",
  "O amor uniu dois corações e fez nascer uma nova família.",
  "O melhor capítulo começa quando duas vidas decidem caminhar juntas.",
];

export function RandomLoveMessage() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * weddingMessages.length));

    const interval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % weddingMessages.length);
        setVisible(true);
      }, 500);
    }, 12000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="message"
      aria-live="polite"
      style={{
        margin: "2.5rem auto 3.5rem",
        maxWidth: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      <Heart
        className="monogram-heart"
        strokeWidth={1.25}
        style={{ width: 16, height: 16, color: "var(--gold)" }}
        aria-hidden="true"
      />
      <p
        style={{
          margin: 0,
          fontStyle: "italic",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          color: "var(--sage-deep)",
        }}
      >
        “{weddingMessages[index]}”
      </p>
    </div>
  );
}
