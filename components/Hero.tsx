import Reveal from "./Reveal";
import VideoPlayer from "./VideoPlayer";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal>
            <h1 className="text-[13vw] md:text-[5vw] font-black leading-[0.85] tracking-tighter uppercase">
              Guarde hoje,{" "}
              <span className="italic text-accent font-medium lowercase">
                reviva
              </span>{" "}
              no futuro
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-6 max-w-md text-xl md:text-2xl text-ink/70">
              Crie sua Cápsula do Tempo digital: fotos, vídeos e cartas que só
              serão abertos quando você decidir — em 2, 5 ou 10 anos.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#oferta"
                className="rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-sm px-10 py-5 hover:bg-accent hover:text-ink transition-colors duration-500"
              >
                Criar minha cápsula — R$37
              </a>
              <a
                href="#vsl"
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-accent pb-1"
              >
                Ver como funciona
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="relative">
          <div id="vsl">
            <VideoPlayer src="/video-apresentacao.mp4" />
          </div>

          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-accent text-ink flex flex-col items-center justify-center animate-bounce-slow shadow-lg">
            <span className="text-3xl italic font-black">01</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-center px-4">
              Memória guardada
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
