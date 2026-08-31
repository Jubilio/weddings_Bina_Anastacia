"use client";

import { useState, useRef, useEffect } from "react";
import { Music, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const tryPlay = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          // Sucesso! Removemos os listeners para não forçar play se o utilizador decidir pausar depois.
          document.removeEventListener("click", tryPlay);
          document.removeEventListener("touchstart", tryPlay);
        }).catch(() => {
          // Bloqueado, esperamos por interação
        });
      }
    };

    // 1. Tentar tocar imediatamente (funciona em alguns browsers)
    tryPlay();

    // 2. Se falhar, tentar tocar ao primeiro clique ou toque no ecrã (truque para Safari/Chrome)
    document.addEventListener("click", tryPlay);
    document.addEventListener("touchstart", tryPlay);

    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music.mp3" />
      <Button
        onClick={togglePlay}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-md bg-background/80 backdrop-blur-sm hover:bg-background/90"
        aria-label={isPlaying ? "Pausar música" : "Tocar música"}
      >
        {isPlaying ? (
          <Music className="h-5 w-5 animate-pulse" />
        ) : (
          <VolumeX className="h-5 w-5 opacity-70" />
        )}
      </Button>
    </>
  );
}
