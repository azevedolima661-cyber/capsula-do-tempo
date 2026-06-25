import Reveal from "./Reveal";

const isFor = [
  "Quer guardar fotos e vídeos especiais com segurança",
  "Vai virar pai ou mãe e quer registrar cada fase",
  "Quer presentear alguém com uma surpresa no futuro",
  "Gosta de rituais de aniversário, casamento ou formatura",
  "Prefere algo simples, pronto em poucos minutos",
];

const isNotFor = [
  "Procura um app complexo de armazenamento em nuvem",
  "Não quer esperar nenhum tempo pra ver o conteúdo",
  "Busca edição profissional de fotos e vídeos",
  "Quer compartilhar memórias publicamente em redes sociais",
  "Não tem nenhuma memória ou foto pra guardar ainda",
];

export default function ForWho() {
  return (
    <section className="py-24 px-6 bg-bg2">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-center">
            Pra quem é —{" "}
            <span className="italic text-accent lowercase font-medium">
              e pra quem não é
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-ink/10">
          <Reveal>
            <div className="bg-bg p-10 h-full">
              <h3 className="text-sm font-black uppercase tracking-widest text-accent">
                É pra você se
              </h3>
              <ul className="mt-6 space-y-4">
                {isFor.map((item) => (
                  <li key={item} className="flex gap-3 text-ink/80">
                    <span className="text-accent font-black">＋</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-bg p-10 h-full">
              <h3 className="text-sm font-black uppercase tracking-widest text-ink/40">
                Não é pra você se
              </h3>
              <ul className="mt-6 space-y-4">
                {isNotFor.map((item) => (
                  <li key={item} className="flex gap-3 text-ink/50">
                    <span className="font-black">－</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
