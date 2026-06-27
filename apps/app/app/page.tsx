import { Camera, Clock, QrCode } from "lucide-react";
import { EntrarForm } from "@/components/EntrarForm";

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="flex flex-col items-center px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
          Cápsula <span className="text-primary">do</span> <span className="text-secondary">Tempo</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink/60">
          Reúna fotos e vídeos de quem você ama, agora ou para abrir só no futuro.
          Digite seu e-mail para entrar.
        </p>

        <EntrarForm />

        <p className="mt-3 text-sm text-ink/50">
          Use o e-mail da sua compra para acessar seus álbuns.
        </p>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-6 pb-24 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Camera className="text-primary" size={28} />
          <h3 className="mt-4 font-bold text-ink">Momento Agora</h3>
          <p className="mt-2 text-sm text-ink/60">
            Colete fotos e vídeos em tempo real durante o seu evento.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <Clock className="text-secondary" size={28} />
          <h3 className="mt-4 font-bold text-ink">Cápsula do Tempo</h3>
          <p className="mt-2 text-sm text-ink/60">
            Selecione memórias por 1, 2 ou 5 anos e reviva tudo na data certa.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <QrCode className="text-primary" size={28} />
          <h3 className="mt-4 font-bold text-ink">Link e QR Code</h3>
          <p className="mt-2 text-sm text-ink/60">
            Convidados enviam memórias sem precisar criar conta.
          </p>
        </div>
      </section>
    </main>
  );
}
