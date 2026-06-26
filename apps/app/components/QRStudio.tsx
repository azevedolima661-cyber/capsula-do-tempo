"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/client";
import { FRAMES, PALETTES, findTemplate } from "@/lib/qrTemplates";
import QRCardPreview from "@/components/QRCardPreview";

type SavedSettings = {
  frameId?: string;
  paletteId?: string;
  eventTitle?: string;
  eventSubtitle?: string;
  eventDate?: string;
  logoSrc?: string;
} | null;

export default function QRStudio({
  capsuleId,
  contributeUrl,
  defaultTitle,
  defaultDate,
  savedSettings,
  disabled,
}: {
  capsuleId: string;
  contributeUrl: string;
  defaultTitle: string;
  defaultDate: string;
  savedSettings: SavedSettings;
  disabled: boolean;
}) {
  const [frameId, setFrameId] = useState(savedSettings?.frameId ?? FRAMES[0].id);
  const [paletteId, setPaletteId] = useState(savedSettings?.paletteId ?? PALETTES[0].id);
  const [eventTitle, setEventTitle] = useState(savedSettings?.eventTitle ?? defaultTitle);
  const [eventSubtitle, setEventSubtitle] = useState(savedSettings?.eventSubtitle ?? "");
  const [eventDate, setEventDate] = useState(savedSettings?.eventDate ?? defaultDate);
  const [logoSrc, setLogoSrc] = useState<string | undefined>(savedSettings?.logoSrc ?? undefined);
  const [qrSrc, setQrSrc] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(10);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(contributeUrl, { margin: 1, width: 480 }).then(setQrSrc);
  }, [contributeUrl]);

  const template = findTemplate(frameId, paletteId);

  const handleLogo = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      setMessage("Escolha uma imagem de logo menor (até 1,5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("capsules")
      .update({
        qr_settings: { frameId, paletteId, eventTitle, eventSubtitle, eventDate, logoSrc },
      })
      .eq("id", capsuleId);

    setSaving(false);
    setMessage(error ? "Não foi possível salvar." : "Modelo salvo!");
  };

  const handleDownloadPdf = async () => {
    if (!qrSrc) return;
    setGenerating(true);
    setMessage(null);
    try {
      const { buildQrPdf } = await import("@/lib/buildQrPdf");
      const doc = buildQrPdf(
        { frame: template.frame, palette: template.palette, eventTitle, eventSubtitle, eventDate, qrSrc, logoSrc },
        quantity
      );
      doc.save(`qrcode-${eventTitle || "capsula"}.pdf`);
    } finally {
      setGenerating(false);
    }
  };

  if (disabled) {
    return (
      <p className="mt-10 text-ink/60">
        Essa cápsula já foi aberta, então o QR Code de convidados não está mais disponível.
      </p>
    );
  }

  return (
    <div className="mt-10 grid md:grid-cols-[1fr_320px] gap-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
          1. Escolha um modelo ({FRAMES.length * PALETTES.length} combinações)
        </p>
        <div className="mt-4 space-y-4 max-h-[480px] overflow-y-auto pr-2">
          {FRAMES.map((frame) => (
            <div key={frame.id}>
              <p className="text-xs font-bold text-ink/60">{frame.name}</p>
              <div className="mt-2 grid grid-cols-5 sm:grid-cols-10 gap-2">
                {PALETTES.map((palette) => {
                  const selected = frame.id === frameId && palette.id === paletteId;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        setFrameId(frame.id);
                        setPaletteId(palette.id);
                      }}
                      className={`rounded-md overflow-hidden transition-shadow duration-300 ${
                        selected ? "ring-2 ring-accent" : "hover:ring-1 hover:ring-ink/30"
                      }`}
                      title={`${frame.name} · ${palette.name}`}
                    >
                      <QRCardPreview frame={frame} palette={palette} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
            2. Personalize
          </p>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Título (ex: nome do casal ou do evento)
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Subtítulo (opcional)
            </label>
            <input
              type="text"
              value={eventSubtitle}
              onChange={(e) => setEventSubtitle(e.target.value)}
              placeholder="Ex: Aponte a câmera e mande sua foto"
              className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Data
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-2 w-full rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Sua logo (opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleLogo(e.currentTarget.files?.[0])}
              className="mt-2 block w-full text-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/50">
              Quantidade de cartões no PDF
            </label>
            <input
              type="number"
              min={1}
              max={200}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(200, Number(e.target.value))))}
              className="mt-2 w-32 rounded-xl bg-bg2 px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {message && <p className="text-sm text-ink/60">{message}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-bg2 font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-accent/40 transition-colors duration-500 disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar modelo"}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generating || !qrSrc}
              className="rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-accent hover:text-ink transition-colors duration-500 disabled:opacity-50"
            >
              {generating ? "Gerando PDF..." : "Baixar PDF para imprimir"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink/50">Pré-visualização</p>
        <div className="mt-4 max-w-[260px]">
          <QRCardPreview
            frame={template.frame}
            palette={template.palette}
            eventTitle={eventTitle}
            eventSubtitle={eventSubtitle}
            eventDate={eventDate}
            qrSrc={qrSrc}
            logoSrc={logoSrc}
          />
        </div>
      </div>
    </div>
  );
}
