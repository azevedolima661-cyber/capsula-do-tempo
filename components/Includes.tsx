import Reveal from "./Reveal";

const items = [
  "Cápsula digital ilimitada de fotos, vídeos e textos",
  "Definição de data de abertura personalizada",
  "Armazenamento seguro e criptografado",
  "Aviso automático por e-mail na data da abertura",
  "Opção de presentear outra pessoa",
  "Acesso pelo computador e pelo celular",
  "Suporte direto via WhatsApp",
  "Atualizações futuras sem custo extra",
];

export default function Includes() {
  return (
    <section className="py-24 px-6 bg-bg2">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-center">
            O que está incluso
          </h2>
        </Reveal>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <Reveal key={item} delay={i * 60}>
              <div className="flex items-start gap-3 bg-bg rounded-2xl p-5">
                <span className="mt-0.5 text-accent font-black">✓</span>
                <span className="text-ink/80">{item}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
