"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AlbumCard } from "@/components/AlbumCard";
import { EditarCapsulaModal } from "@/components/EditarCapsulaModal";

type Capsula = {
  id: string;
  nome: string;
  slug: string;
  modalidade: "momento_agora" | "capsula_tempo";
  prazo_anos: 1 | 2 | 5 | null;
  data_evento: string | null;
  status: "ativa" | "fechada" | "aberta";
  allow_guest_view: boolean;
  data_abertura: string | null;
  nome_responsavel: string | null;
  event_date_change_count: number;
};

export function AlbumCardManaged({ capsula }: { capsula: Capsula }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleExcluir = async () => {
    if (!confirm(`Excluir o álbum "${capsula.nome}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    const supabase = createClient();
    await supabase.from("capsulas").delete().eq("id", capsula.id);
    router.refresh();
  };

  return (
    <div className="relative">
      <div ref={ref} className="absolute right-5 top-5 z-10">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={16} className="text-ink/50" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-44 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
            <button
              onClick={() => {
                setMenuOpen(false);
                setEditOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-gray-50"
            >
              <Pencil size={14} />
              Editar
            </button>
            <button
              onClick={handleExcluir}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
        )}
      </div>

      <AlbumCard capsula={capsula} />

      {editOpen && <EditarCapsulaModal capsula={capsula} onClose={() => setEditOpen(false)} />}
    </div>
  );
}
