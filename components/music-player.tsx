"use client";

import { useState, useRef } from "react";
import { Music, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Lida com erros se o browser bloquear
        });
      }
      setIsPlaying(!isPlaying);
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
