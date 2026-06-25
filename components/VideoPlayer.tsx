"use client";

import { useRef, useState } from "react";

export default function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play().catch(() => setPlaying(false));
  };

  return (
    <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-ink/90">
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        playsInline
        className="w-full h-full object-cover"
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Assistir vídeo de apresentação"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="w-20 h-20 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform duration-500">
            <span className="ml-1 border-l-[18px] border-l-ink border-y-[12px] border-y-transparent" />
          </span>
          <span className="absolute bottom-6 left-6 text-bg/70 text-[10px] font-bold uppercase tracking-[0.3em]">
            Vídeo de apresentação
          </span>
        </button>
      )}
    </div>
  );
}
