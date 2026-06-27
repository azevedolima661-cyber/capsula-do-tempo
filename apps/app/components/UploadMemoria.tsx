"use client";

import { useRef, useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UploadMemoria({ capsulaId }: { capsulaId: string }) {
  const [nomeConvidado, setNomeConvidado] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!arquivo) return;

    setEnviando(true);
    setError(null);

    const supabase = createClient();
    const tipo = arquivo.type.startsWith("video") ? "video" : "foto";
    const extensao = arquivo.name.split(".").pop();
    const caminho = `${capsulaId}/${crypto.randomUUID()}.${extensao}`;

    const { error: uploadError } = await supabase.storage
      .from("capsulas")
      .upload(caminho, arquivo);

    if (uploadError) {
      setError("Não foi possível enviar seu arquivo. Tente novamente.");
      setEnviando(false);
      return;
    }

    const { error: insertError } = await supabase.from("memorias").insert({
      capsula_id: capsulaId,
      arquivo_url: caminho,
      tipo,
      nome_convidado: nomeConvidado || null,
    });

    setEnviando(false);

    if (insertError) {
      setError("Não foi possível registrar sua memória. Tente novamente.");
      return;
    }

    setArquivo(null);
    if (inputRef.current) inputRef.current.value = "";
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <label className="text-sm font-medium text-ink/70">Seu nome (opcional)</label>
        <input
          type="text"
          value={nomeConvidado}
          onChange={(e) => setNomeConvidado(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-ink/70">Foto ou vídeo</label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          required
          onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {enviado && <p className="mt-3 text-sm text-green-600">Memória enviada com sucesso!</p>}

      <button
        type="submit"
        disabled={enviando}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
      >
        <Upload size={16} />
        {enviando ? "Enviando..." : "Enviar memória"}
      </button>
    </form>
  );
}
