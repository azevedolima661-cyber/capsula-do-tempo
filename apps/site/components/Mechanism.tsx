import Reveal from "./Reveal";

const cards = [
  {
    title: "Upload simples",
    text: "Suba fotos, vídeos e textos direto do celular, em poucos cliques.",
    span: "md:col-span-2",
  },
  {
    title: "Data de abertura",
    text: "Escolha quando a cápsula deve ser aberta: 1, 5 ou 10 anos.",
    span: "",
  },
  {
    title: "Cofre digital seguro",
    text: "Conteúdo criptografado e guardado até a data certa chegar.",
    span: "",
  },
  {
    title: "Aviso automático",
    text: "Você (ou quem escolher) recebe um e-mail no exato dia da abertura.",
    span: "md:col-span-2",
  },
  {
    title: "Pode presentear",
    text: "Crie uma cápsula para outra pessoa abrir no futuro.",
    span: "",
  },
];

export default function Mechanism() {
  return (
    <section id="mecanismo" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">
            O mecanismo único
          </span>
          <h2 className="mt-4 text-4xl md:text-7xl font-black tracking-tighter uppercase">
            Como sua memória atravessa o tempo
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100} className={card.span}>
              <div className="h-full rounded-[24px] bg-bg2 p-10 hover:bg-accent transition-colors duration-500 group">
                <span className="text-4xl font-black text-accent group-hover:text-ink transition-colors duration-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-bold uppercase">
                  {card.title}
                </h3>
                <p className="mt-2 text-ink/70 leading-relaxed">
                  {card.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
