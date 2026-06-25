export default function Footer() {
  return (
    <footer className="bg-bg2 px-6 pt-20 pb-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <span className="text-xl font-black uppercase tracking-tight">
            CÁPSULA DO TEMPO
          </span>
          <p className="mt-4 max-w-sm text-ink/60">
            Guardamos suas memórias com carinho para que elas atravessem o
            tempo e cheguem até você no momento certo.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-3 gap-8">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent pb-2 border-b border-accent/30 inline-block">
              Navegação
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li><a href="#mecanismo" className="hover:text-accent">Como funciona</a></li>
              <li><a href="#oferta" className="hover:text-accent">Oferta</a></li>
              <li><a href="#faq" className="hover:text-accent">Dúvidas</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent pb-2 border-b border-accent/30 inline-block">
              Social
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li><a href="#" className="hover:text-accent">Instagram</a></li>
              <li><a href="#" className="hover:text-accent">TikTok</a></li>
              <li><a href="#" className="hover:text-accent">WhatsApp</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent pb-2 border-b border-accent/30 inline-block">
              Suporte
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li><a href="#" className="hover:text-accent">Contato</a></li>
              <li><a href="#" className="hover:text-accent">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-accent">Termos de uso</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-6 border-t border-ink/10 flex flex-wrap justify-between gap-2 text-[9px] text-ink/30">
        <span>© 2026 Cápsula do Tempo. Todos os direitos reservados.</span>
        <span>CNPJ 00.000.000/0001-00</span>
      </div>
    </footer>
  );
}
