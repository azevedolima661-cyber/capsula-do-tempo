import Reveal from "./Reveal";

export default function Offer() {
  return (
    <section id="oferta" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
            Oferta por tempo limitado
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Sua Cápsula do Tempo custa menos que um lanche
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-12 rounded-[24px] bg-bg2 p-10 md:p-14">
            <p className="text-ink/40 text-lg line-through">De R$97,00</p>
            <p className="mt-2 text-6xl md:text-7xl font-black tracking-tighter">
              R$37<span className="text-2xl align-top">,00</span>
            </p>
            <p className="mt-2 text-ink/60">Pagamento único, acesso para sempre</p>

            <a
              href="#"
              className="mt-10 inline-block w-full md:w-auto rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-base px-12 py-6 hover:bg-accent hover:text-ink transition-colors duration-500"
            >
              Quero criar minha cápsula agora
            </a>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Garantia incondicional de 7 dias — devolução total do valor
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
