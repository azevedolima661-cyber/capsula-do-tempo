"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

function EntrarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push(searchParams.get("redirect") || "/app");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="text-sm font-bold uppercase tracking-widest text-ink/50">
        ← Voltar
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-black tracking-tighter uppercase">
        Entrar
      </h1>
      <p className="mt-2 text-ink/60">Acesse sua cápsula do tempo.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
            E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
            Senha
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-accent hover:text-ink transition-colors duration-500 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-bold text-accent">
          Criar cápsula
        </Link>
      </p>
    </div>
  );
}

export default function EntrarPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <Suspense>
        <EntrarForm />
      </Suspense>
    </main>
  );
}
