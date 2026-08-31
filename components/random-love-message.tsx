"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

const loveMessages = [
  "O amor não se vê com os olhos, mas com o coração.",
  "Amar não é olhar um para o outro, é olhar juntos na mesma direção.",
  "O verdadeiro amor nunca se esgota. Quanto mais dás, mais tens.",
  "Quando se ama não é preciso entender o que acontece lá fora, pois tudo passa a acontecer dentro de nós.",
  "O amor é a poesia dos sentidos.",
  "Tão bom morrer de amor e continuar vivendo.",
  "As verdadeiras histórias de amor nunca têm fim.",
  "Onde há amor, há vida.",
];

export function RandomLoveMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loveMessages.length);
    setMessage(loveMessages[randomIndex]);
  }, []);

  if (!message) return null;

  return (
    <div className="message" style={{ margin: '2rem 0', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <Heart className="monogram-heart" strokeWidth={1.25} style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
      <p>"{message}"</p>
    </div>
  );
}
