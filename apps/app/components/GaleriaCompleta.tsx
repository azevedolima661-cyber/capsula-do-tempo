"use client";

import { useState } from "react";
import { Download } from "lucide-react";

type Memoria = {
  id: string;
  url: string;
  tipo: "foto" | "video";
  nomeConvidado: string | null;
};

export function GaleriaCompleta({ memorias }: { memorias: Memoria[] }) {
  const [baixando, setBaixando] = useState(false);

  const handleBaixarTudo = async () => {
    setBaixando(true);
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    await Promise.all(
      memorias.map(async (memoria, index) => {
        const res = await fetch(memoria.url);
        const blob = await res.blob();
        const extensao = memoria.tipo === "video" ? "mp4" : "jpg";
        zip.file(`memoria-${index + 1}.${extensao}`, blob);
      })
    );

    const conteudo = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(conteudo);
    link.download = "memorias.zip";
    link.click();
    setBaixando(false);
  };

  if (memorias.length === 0) {
    return (
      <div className="mt-12 rounded-2xl bg-white p-10 text-center shadow-sm">
        <p className="text-ink/60">Nenhuma memória enviada ainda.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          onClick={handleBaixarTudo}
          disabled={baixando}
          className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
        >
          <Download size={16} />
          {baixando ? "Preparando..." : "Baixar tudo"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {memorias.map((memoria) => (
          <div key={memoria.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {memoria.tipo === "video" ? (
              <video src={memoria.url} controls className="aspect-square w-full object-cover" />
            ) : (
              <img src={memoria.url} alt="" className="aspect-square w-full object-cover" />
            )}
            {memoria.nomeConvidado && (
              <p className="px-3 py-2 text-xs text-ink/50">{memoria.nomeConvidado}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
