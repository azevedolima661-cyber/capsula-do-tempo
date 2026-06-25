"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function Carousel({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(index);
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="grayscale-hover flex overflow-x-auto snap-x snap-mandatory rounded-[24px] aspect-[4/5] scrollbar-hide"
      >
        {images.map((src, i) => (
          <div key={src} className="relative w-full h-full flex-shrink-0 snap-center">
            <Image
              src={src}
              alt={`Cápsula do Tempo — foto ${i + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir para foto ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-accent" : "w-2 bg-bg/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
