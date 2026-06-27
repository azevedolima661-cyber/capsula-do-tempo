"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Eye, EyeOff, Images, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { QRCodeModal } from "@/components/QRCodeModal";

type Capsula = {
  id: string;
  nome: string;
  slug: string;
  modalidade: "momento_agora" | "capsula_tempo";
  status: "ativa" | "fechada" | "aberta";
  allow_guest_view: boolean;
  data_abertura: string | null;
};

export function AlbumCard({ capsula }: { capsula: Capsula }) {
  const [allowGuestView, setAllowGuestView] = useState(capsula.allow_guest_view);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const link = `${siteUrl}/c/${capsula.slug}`;

  const handleCopiar = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleGuestView = async () => {
    const novoValor = !allowGuestView;
    setAllowGuestView(novoValor);
    const supabase = createClient();
    await supabase.from("capsulas").update({ allow_guest_view: novoValor }).eq("id", capsula.id);
  };

  const mensagemWhatsapp = encodeURIComponent(
    `Você foi convidado para enviar fotos e vídeos para "${capsula.nome}"! Acesse: ${link}`
  );

  const statusLabel =
    capsula.modalidade === "momento_agora"
      ? "Momento Agora"
      : capsula.status === "aberta"
        ? "Aberta"
        : "Selada";

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink">{capsula.nome}</h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {statusLabel}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopiar}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-ink hover:bg-gray-50"
        >
          <Copy size={14} />
          {copied ? "Copiado!" : "Copiar link"}
        </button>

        <Link
          href={`/dashboard/album/${capsula.slug}/completo`}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-ink hover:bg-gray-50"
        >
          <Images size={14} />
          Galeria
        </Link>

        <button
          onClick={() => setQrOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-ink hover:bg-gray-50"
        >
          <QrCode size={14} />
          QR Code
        </button>

        <a
          href={`https://wa.me/?text=${mensagemWhatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-xl bg-whatsapp px-3 py-2 text-sm font-bold text-white hover:opacity-90"
        >
          Compartilhar
        </a>
      </div>

      <button
        onClick={handleToggleGuestView}
        className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink"
      >
        {allowGuestView ? <Eye size={16} /> : <EyeOff size={16} />}
        Convidados {allowGuestView ? "podem" : "não podem"} ver as memórias
      </button>

      {qrOpen && (
        <QRCodeModal nome={capsula.nome} link={link} onClose={() => setQrOpen(false)} />
      )}
    </div>
  );
}
