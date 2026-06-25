import Reveal from "./Reveal";

const mentions = [
  "+12.000 cápsulas criadas",
  "Destaque no Instagram",
  "Indicado por criadores de conteúdo",
  "Avaliação 4.9/5 de compradores",
];

export default function SocialProof() {
  return (
    <section className="py-12 px-6 bg-bg2 border-y border-ink/5">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {mentions.map((m) => (
              <span
                key={m}
                className="text-[11px] md:text-xs font-bold uppercase tracking-[0.15em] text-ink/50"
              >
                {m}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
