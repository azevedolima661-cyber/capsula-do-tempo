"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

const prazos = [
  { label: "1 ano", anos: 1 },
  { label: "5 anos", anos: 5 },
  { label: "10 anos", anos: 10 },
];

export default function NovaCapsulaPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [anos, setAnos] = useState(1);
  const [presentear, setPresentear] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("Você precisa estar logado.");
      setLoading(false);
      return;
    }

    const openDate = new Date();
    openDate.setFullYear(openDate.getFullYear() + anos);

    const { data, error: insertError } = await supabase
      .from("capsules")
      .insert({
        owner_id: userData.user.id,
        title,
        open_date: openDate.toISOString().slice(0, 10),
        recipient_email: presentear && recipientEmail ? recipientEmail : null,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError("Não foi possível criar a cápsula. Tente novamente.");
      setLoading(false);
      return;
    }

    if (presentear && recipientEmail) {
      await fetch("/api/capsulas/presentear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capsuleId: data.id, recipientEmail }),
      }).catch(() => {});
    }

    router.push(`/app/capsula/${data.id}`);
  };

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <Link href="/app" className="text-sm font-bold uppercase tracking-widest text-ink/50">
          ← Voltar
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-black tracking-tighter uppercase">
          Nova cápsula
        </h1>
        <p className="mt-2 text-ink/60">
          Escolha um nome e quando ela deve abrir.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Nome da cápsula
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Nosso casamento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Abrir em
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {prazos.map((p) => (
                <button
                  key={p.anos}
                  type="button"
                  onClick={() => setAnos(p.anos)}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition-colors duration-300 ${
                    anos === p.anos ? "bg-ink text-bg" : "bg-bg2 text-ink/70"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-bg2 px-4 py-3">
            <label className="flex items-center gap-2 text-sm font-bold">
              <input
                type="checkbox"
                checked={presentear}
                onChange={(e) => setPresentear(e.target.checked)}
              />
              Presentear esta cápsula para outra pessoa
            </label>
            {presentear && (
              <div className="mt-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
                  E-mail de quem vai receber
                </label>
                <input
                  type="email"
                  required={presentear}
                  placeholder="nome@exemplo.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-bg px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="mt-2 text-xs text-ink/50">
                  Ela vai receber um e-mail com acesso completo a esta cápsula, para guardar memórias junto com você.
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-accent hover:text-ink transition-colors duration-500 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar cápsula"}
          </button>
        </form>
      </div>
    </main>
  );
}
