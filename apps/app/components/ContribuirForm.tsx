"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContribuirForm({ capsuleId }: { capsuleId: string }) {
  const [name, setName] = useState("");
  const [carta, setCarta] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!files?.length && !carta.trim()) {
      setError("Envie pelo menos uma foto, vídeo ou carta.");
      return;
    }

    setSending(true);
    setError(null);
    const supabase = createClient();

    try {
      if (files) {
        for (const file of Array.from(files)) {
          const isVideo = file.type.startsWith("video");
          const path = `${capsuleId}/${crypto.randomUUID()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from("capsulas").upload(path, file);
          if (uploadError) throw uploadError;

          const { error: insertError } = await supabase.from("capsule_items").insert({
            capsule_id: capsuleId,
            type: isVideo ? "video" : "foto",
            storage_path: path,
            uploaded_by_name: name || null,
          });
          if (insertError) throw insertError;
        }
      }

      if (carta.trim()) {
        const { error: insertError } = await supabase.from("capsule_items").insert({
          capsule_id: capsuleId,
          type: "carta",
          content: carta.trim(),
          uploaded_by_name: name || null,
        });
        if (insertError) throw insertError;
      }

      setDone(true);
    } catch {
      setError("Não foi possível enviar. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mt-10 rounded-[24px] bg-bg2 p-8 text-center">
        <p className="text-xl font-black uppercase tracking-tighter">Enviado!</p>
        <p className="mt-2 text-ink/60">Sua contribuição já está guardada na cápsula. Obrigado.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          Seu nome (opcional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          Fotos ou vídeos
        </label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(e) => setFiles(e.currentTarget.files)}
          className="mt-2 block w-full text-sm"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          Uma carta para o futuro
        </label>
        <textarea
          value={carta}
          onChange={(e) => setCarta(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
          placeholder="Escreva algo..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-accent hover:text-ink transition-colors duration-500 disabled:opacity-50"
      >
        {sending ? "Enviando..." : "Enviar para a cápsula"}
      </button>
    </form>
  );
}
