export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center bg-bg/80 backdrop-blur-md border-b border-ink/5">
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="text-lg font-black uppercase tracking-tight">
          CÁPSULA DO TEMPO
        </span>

        <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
          <a href="#mecanismo" className="hover:text-accent transition-colors">
            Como funciona
          </a>
          <a href="#oferta" className="hover:text-accent transition-colors">
            Oferta
          </a>
          <a href="#faq" className="hover:text-accent transition-colors">
            Dúvidas
          </a>
        </nav>

        <a
          href="#oferta"
          className="rounded-full bg-accent text-ink text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 hover:bg-ink hover:text-bg transition-colors duration-500"
        >
          Quero a minha
        </a>
      </div>
    </header>
  );
}
