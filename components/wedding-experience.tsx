"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";

const WEDDING_DATE = "2026-12-19T10:00:00+02:00";
const WEDDING_TIME = new Date(WEDDING_DATE).getTime();

type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasArrived: boolean;
};

function getTimeRemaining(): TimeRemaining {
  const difference = Math.max(0, WEDDING_TIME - Date.now());

  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
    hasArrived: difference === 0,
  };
}

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("splash-open", isVisible);

    return () => document.body.classList.remove("splash-open");
  }, [isVisible]);

  function openInvitation() {
    setIsVisible(false);
    window.dispatchEvent(new Event("wedding-invitation-opened"));
  }

  if (!isVisible) return null;

  return (
    <div
      className="wedding-splash"
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
      aria-describedby="splash-description"
    >
      <Image
        src="/images/noivos-momento.png"
        alt="Anastácia e Bina num momento de carinho"
        fill
        priority
        sizes="100vw"
        className="splash-background-image"
      />
      <div className="splash-card">
        <div className="splash-ornament" aria-hidden="true">
          <span />
          <i>✦</i>
          <span />
        </div>

        <p className="splash-kicker">Convite de casamento</p>
        <div className="splash-monogram" aria-hidden="true">
          <span>A</span>
          <Heart strokeWidth={1.2} />
          <span>B</span>
        </div>
        <h2 id="splash-title">Anastácia &amp; Bina</h2>
        <p id="splash-description">
          Com alegria, convidamos a celebrar connosco o início da nossa vida a dois.
        </p>
        <time dateTime={WEDDING_DATE}>19 de dezembro de 2026</time>

        <button type="button" onClick={openInvitation} autoFocus>
          <Heart aria-hidden="true" />
          Abrir convite
        </button>

        <p className="splash-hint">Toque para entrar</p>
      </div>
    </div>
  );
}

export function WeddingCountdown() {
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    const updateCountdown = () => setRemaining(getTimeRemaining());
    updateCountdown();

    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  if (remaining?.hasArrived) {
    return (
      <section className="wedding-countdown wedding-countdown-arrived" aria-label="Chegou o grande dia">
        <Heart aria-hidden="true" />
        <p>O nosso grande dia chegou!</p>
      </section>
    );
  }

  const units = [
    { label: "Dias", value: remaining?.days },
    { label: "Horas", value: remaining?.hours },
    { label: "Minutos", value: remaining?.minutes },
    { label: "Segundos", value: remaining?.seconds },
  ];

  return (
    <section className="wedding-countdown" aria-label="Contagem regressiva para o casamento">
      <p>Contagem regressiva para o nosso sim</p>
      <div className="countdown-grid" aria-hidden="true">
        {units.map((unit) => (
          <div className="countdown-unit" key={unit.label}>
            <strong>{unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}</strong>
            <span>{unit.label}</span>
          </div>
        ))}
      </div>
      {remaining ? (
        <span className="sr-only">
          Faltam {remaining.days} dias, {remaining.hours} horas, {remaining.minutes} minutos e {remaining.seconds} segundos.
        </span>
      ) : null}
    </section>
  );
}
