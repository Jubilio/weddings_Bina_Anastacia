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
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    // Escolher a primeira mensagem de forma aleatória no lado do cliente
    setIndex(Math.floor(Math.random() * loveMessages.length));

    const interval = setInterval(() => {
      setFade(false); // inicia o fade out
      
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % loveMessages.length);
        setFade(true); // inicia o fade in
      }, 500); // 500ms para a transição de fade out
      
    }, 12000); // Roda a cada 12 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="message" 
      style={{ 
        margin: '2.5rem auto 3.5rem', 
        maxWidth: '500px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px',
        textAlign: 'center',
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <Heart className="monogram-heart" strokeWidth={1.25} style={{ width: 16, height: 16, color: 'var(--gold)' }} />
      <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--sage-deep)' }}>
        “{loveMessages[index]}”
      </p>
    </div>
  );
}
