"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

function calcularRestante(dataAbertura: string) {
  const diff = new Date(dataAbertura).getTime() - Date.now();
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownLock({ nome, dataAbertura }: { nome: string; dataAbertura: string }) {
  const [restante, setRestante] = useState(() => calcularRestante(dataAbertura));

  useEffect(() => {
    const interval = setInterval(() => setRestante(calcularRestante(dataAbertura)), 1000);
    return () => clearInterval(interval);
  }, [dataAbertura]);

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-12 text-center shadow-sm">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary">
        <Lock size={28} />
      </span>
      <h2 className="mt-6 text-xl font-extrabold text-ink">"{nome}" ainda está selada</h2>
      <p className="mt-2 text-ink/60">Suas memórias serão liberadas em:</p>

      <div className="mt-6 flex gap-4">
        {[
          ["dias", restante.dias],
          ["horas", restante.horas],
          ["min", restante.minutos],
          ["seg", restante.segundos],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-secondary/5 px-4 py-3">
            <p className="text-2xl font-extrabold text-secondary">{String(value).padStart(2, "0")}</p>
            <p className="text-xs font-medium text-ink/50">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
