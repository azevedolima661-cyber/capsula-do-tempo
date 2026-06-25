import Reveal from "./Reveal";

const bonuses = [
  {
    emoji: "🎁",
    title: "QR Code para convidados contribuírem",
    text: "Receba um QR Code personalizado da sua cápsula, pronto pra imprimir. Cole nas mesas do seu evento e deixe convidados mandarem fotos direto pra cápsula antes dela ser fechada.",
  },
  {
    emoji: "📝",
    title: "Guia de Perguntas para o Futuro",
    text: "Um guia com perguntas e desafios criativos pra ajudar você (e quem mais participar) a escrever cartas e lembranças que vão emocionar quando a cápsula for aberta, anos depois.",
  },
];

export default function Bonuses() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2">
              Bônus por tempo limitado
            </span>
            <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tighter uppercase">
              Bônus exclusivos para quem garantir agora
            </h2>
            <p className="mt-4 text-lg text-ink/70 max-w-xl mx-auto">
              Além da sua Cápsula do Tempo, você ainda leva 2 bônus que tornam
              a experiência ainda mais completa.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {bonuses.map((bonus, i) => (
            <Reveal key={bonus.title} delay={i * 150}>
              <div className="h-full rounded-[24px] bg-bg2 p-10">
                <span className="text-4xl">{bonus.emoji}</span>
                <h3 className="mt-6 text-xl font-bold uppercase">
                  {bonus.title}
                </h3>
                <p className="mt-2 text-ink/70 leading-relaxed">
                  {bonus.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
