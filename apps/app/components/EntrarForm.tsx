"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { setMembroEmail } from "@/lib/membro";

export function EntrarForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setMembroEmail(email);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        placeholder="Seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300"
      >
        Entrar
      </button>
    </form>
  );
}
