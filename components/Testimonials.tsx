import Image from "next/image";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  "/depoimentos/depoimento-1.png",
  "/depoimentos/depoimento-2.png",
  "/depoimentos/depoimento-3.png",
  "/depoimentos/depoimento-4.png",
  "/depoimentos/depoimento-5.png",
  "/depoimentos/depoimento-6.png",
];

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 px-6 bg-bg2">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
            Quem já guardou
          </span>
          <h2 className="mt-4 text-4xl md:text-7xl font-black tracking-tighter uppercase">
            Memórias que já atravessaram o tempo
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((src, i) => (
            <Reveal key={src} delay={i * 100}>
              <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] shadow-lg">
                <Image
                  src={src}
                  alt="Depoimento de cliente da Cápsula do Tempo"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
