"use client";

import { useState, type FormEvent } from "react";

export function CheckoutButton() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const body = await res.json();

    if (!res.ok || !body.checkoutUrl) {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
      setLoading(false);
      return;
    }

    window.location.href = body.checkoutUrl;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="Seu melhor e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? "Carregando..." : "Quero a minha — R$37"}
      </button>
      {error && <p className="text-sm text-red-600 sm:absolute">{error}</p>}
    </form>
  );
}
