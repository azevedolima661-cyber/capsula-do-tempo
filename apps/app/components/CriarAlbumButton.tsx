"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NovaCapsulaModal } from "@/components/NovaCapsulaModal";

export function CriarAlbumButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300"
      >
        <Plus size={18} />
        Criar álbum
      </button>
      {open && <NovaCapsulaModal onClose={() => setOpen(false)} />}
    </>
  );
}
