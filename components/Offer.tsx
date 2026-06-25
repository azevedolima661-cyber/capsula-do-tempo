import Reveal from "./Reveal";

const checklist = [
  { label: "Cápsula digital ilimitada de fotos, vídeos e textos", free: false },
  { label: "Data de abertura personalizada (2, 5 ou 10 anos)", free: false },
  { label: "Armazenamento seguro e criptografado", free: false },
  { label: "QR Code para convidados contribuírem", free: true },
  { label: "Guia de Perguntas para o Futuro", free: true },
];

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
            <p className="text-left text-[11px] font-bold uppercase tracking-widest text-ink/50">
              O que você recebe
            </p>
            <ul className="mt-4 text-left space-y-3">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-3">
                  <span className="text-accent font-black">✓</span>
                  <span className="text-ink/80">{item.label}</span>
                  {item.free && (
                    <span className="rounded-full bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest px-2 py-1">
                      Grátis
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-10 text-ink/40 text-lg line-through">De R$97,00</p>
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
