"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

function CadastroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });
    const body = await res.json();

    if (!res.ok) {
      setError(body.error ?? "Não foi possível criar sua conta.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("Conta criada! Faça login para continuar.");
      setLoading(false);
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="text-sm font-bold text-ink/50">
        ← Voltar
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold text-ink">Criar sua conta</h1>
      <p className="mt-2 text-ink/60">
        O cadastro é liberado automaticamente após a confirmação do pagamento.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Nome</label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">E-mail usado na compra</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary text-white font-bold py-3 shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
        >
          {loading ? "Criando conta..." : "Criar minha conta"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-bold text-primary">
          Entrar
        </Link>
      </p>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <Suspense>
        <CadastroForm />
      </Suspense>
    </main>
  );
}
