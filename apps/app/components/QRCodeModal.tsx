"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import QRCode from "qrcode";

export function QRCodeModal({ nome, link, onClose }: { nome: string; link: string; onClose: () => void }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(link, { width: 320, margin: 2 }).then(setDataUrl);
  }, [link]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-ink">{nome}</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          {dataUrl ? (
            <img src={dataUrl} alt="QR Code" className="rounded-xl" />
          ) : (
            <div className="flex h-80 w-80 items-center justify-center text-ink/40">
              Gerando...
            </div>
          )}
        </div>

        {dataUrl && (
          <a
            href={dataUrl}
            download={`qrcode-${nome}.png`}
            className="mt-6 inline-block rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300"
          >
            Baixar QR Code
          </a>
        )}
      </div>
    </div>
  );
}
