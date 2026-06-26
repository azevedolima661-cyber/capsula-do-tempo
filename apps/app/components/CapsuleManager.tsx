"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

type Item = {
  id: string;
  type: "foto" | "video" | "carta";
  storage_path: string | null;
  content: string | null;
  uploaded_by_name: string | null;
  created_at: string;
};

export default function CapsuleManager({
  capsuleId,
  initialItems,
  readOnly = false,
}: {
  capsuleId: string;
  initialItems: Item[];
  readOnly?: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [carta, setCarta] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const paths = items.filter((i) => i.storage_path).map((i) => i.storage_path!);
    if (paths.length === 0) return;

    Promise.all(
      paths.map((p) =>
        supabase.storage.from("capsulas").createSignedUrl(p, 60 * 60).then((r) => [p, r.data?.signedUrl ?? ""] as const)
      )
    ).then((entries) => {
      setUrls(Object.fromEntries(entries));
    });
  }, [items]);

  const handleFiles = async (e: FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video");
      const path = `${capsuleId}/${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("capsulas").upload(path, file);
      if (uploadError) {
        setError("Não foi possível enviar um dos arquivos.");
        continue;
      }

      const { data } = await supabase
        .from("capsule_items")
        .insert({ capsule_id: capsuleId, type: isVideo ? "video" : "foto", storage_path: path })
        .select()
        .single();

      if (data) setItems((prev) => [data as Item, ...prev]);
    }

    setUploading(false);
    e.currentTarget.value = "";
  };

  const handleCarta = async (e: FormEvent) => {
    e.preventDefault();
    if (!carta.trim()) return;

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("capsule_items")
      .insert({ capsule_id: capsuleId, type: "carta", content: carta.trim() })
      .select()
      .single();

    if (insertError) {
      setError("Não foi possível salvar a carta.");
      return;
    }

    if (data) setItems((prev) => [data as Item, ...prev]);
    setCarta("");
  };

  const handleDelete = async (item: Item) => {
    const supabase = createClient();
    if (item.storage_path) {
      await supabase.storage.from("capsulas").remove([item.storage_path]);
    }
    await supabase.from("capsule_items").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="mt-10 space-y-10">
      {!readOnly && (
        <>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Adicionar fotos ou vídeos
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={handleFiles}
              className="mt-2 block w-full text-sm"
            />
            {uploading && <p className="mt-2 text-sm text-ink/60">Enviando...</p>}
          </div>

          <form onSubmit={handleCarta} className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Escrever uma carta
            </label>
            <textarea
              value={carta}
              onChange={(e) => setCarta(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
              placeholder="Escreva algo para o futuro..."
            />
            <button
              type="submit"
              className="rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-accent hover:text-ink transition-colors duration-500"
            >
              Salvar carta
            </button>
          </form>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          Itens guardados ({items.length})
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative rounded-xl bg-bg2 p-3 group">
              {!readOnly && (
                <button
                  onClick={() => handleDelete(item)}
                  className="absolute top-2 right-2 rounded-full bg-ink/80 text-bg text-[10px] font-bold w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remover"
                >
                  ×
                </button>
              )}
              {item.type === "carta" ? (
                <p className="text-sm whitespace-pre-wrap line-clamp-6">{item.content}</p>
              ) : item.type === "video" ? (
                urls[item.storage_path!] && (
                  <video src={urls[item.storage_path!]} className="rounded-lg w-full aspect-square object-cover" controls />
                )
              ) : (
                urls[item.storage_path!] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urls[item.storage_path!]} alt="" className="rounded-lg w-full aspect-square object-cover" />
                )
              )}
              {item.uploaded_by_name && (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">
                  {item.uploaded_by_name}
                </p>
              )}
              {readOnly && item.storage_path && urls[item.storage_path] && (
                <a
                  href={urls[item.storage_path]}
                  download
                  className="mt-2 block text-[10px] font-bold uppercase tracking-widest text-accent"
                >
                  Baixar
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
