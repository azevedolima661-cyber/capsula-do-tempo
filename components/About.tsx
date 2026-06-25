import Reveal from "./Reveal";

export default function About() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <div className="grayscale-hover rounded-[24px] overflow-hidden aspect-[4/5] bg-bg2 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/40">
              Foto da criadora
            </span>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
            Quem está por trás
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
            Criado por quem já guardou memórias demais
          </h2>
          <p className="mt-6 text-lg text-ink/70 max-w-md">
            Depois de perder fotos importantes em um celular quebrado, criei a
            Cápsula do Tempo para garantir que memórias boas nunca mais se
            percam — e cheguem até você (ou quem você ama) no momento certo.
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-3xl font-black">+12 mil</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                Cápsulas criadas
              </p>
            </div>
            <div>
              <p className="text-3xl font-black">4.9/5</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">
                Avaliação média
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
