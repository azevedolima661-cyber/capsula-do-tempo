"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Capsula = {
  id: string;
  nome: string;
  modalidade: "momento_agora" | "capsula_tempo";
  prazo_anos: 1 | 2 | 5 | null;
  data_evento: string | null;
  nome_responsavel: string | null;
  event_date_change_count: number;
};

export function EditarCapsulaModal({
  capsula,
  onClose,
}: {
  capsula: Capsula;
  onClose: () => void;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(capsula.nome);
  const [nomeResponsavel, setNomeResponsavel] = useState(capsula.nome_responsavel ?? "");
  const [dataEvento, setDataEvento] = useState(
    capsula.data_evento ? capsula.data_evento.slice(0, 10) : ""
  );
  const [prazoAnos, setPrazoAnos] = useState<1 | 2 | 5 | null>(capsula.prazo_anos);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dataOriginal = capsula.data_evento ? capsula.data_evento.slice(0, 10) : "";
  const dataMudou = dataEvento !== dataOriginal;
  const jaUsouTrocaDeData = capsula.event_date_change_count >= 1;

  const handleSalvar = async () => {
    if (dataMudou && jaUsouTrocaDeData) {
      setError("A data do evento já foi alterada uma vez e não pode ser alterada novamente.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const dataEventoIso = dataEvento ? new Date(dataEvento).toISOString() : null;
    const dataAbertura =
      capsula.modalidade === "capsula_tempo" && prazoAnos && dataEventoIso
        ? new Date(
            new Date(dataEventoIso).setFullYear(new Date(dataEventoIso).getFullYear() + prazoAnos)
          ).toISOString()
        : null;

    const { error: updateError } = await supabase
      .from("capsulas")
      .update({
        nome,
        nome_responsavel: nomeResponsavel || null,
        data_evento: dataEventoIso,
        prazo_anos: capsula.modalidade === "capsula_tempo" ? prazoAnos : null,
        data_abertura: dataAbertura,
        event_date_change_count: dataMudou
          ? capsula.event_date_change_count + 1
          : capsula.event_date_change_count,
      })
      .eq("id", capsula.id);

    setLoading(false);

    if (updateError) {
      setError("Não foi possível salvar as alterações.");
      return;
    }

    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Editar álbum</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Nome do álbum</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Seu nome (responsável)</label>
            <input
              type="text"
              value={nomeResponsavel}
              onChange={(e) => setNomeResponsavel(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">
              Data do evento {jaUsouTrocaDeData && "(já alterada uma vez)"}
            </label>
            <input
              type="date"
              value={dataEvento}
              disabled={jaUsouTrocaDeData}
              onChange={(e) => setDataEvento(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-ink/40"
            />
            <p className="mt-1 text-xs text-ink/50">
              A data do evento só pode ser alterada uma única vez.
            </p>
          </div>

          {capsula.modalidade === "capsula_tempo" && (
            <div>
              <label className="text-sm font-medium text-ink/70">Prazo da cápsula</label>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {[1, 2, 5].map((anos) => (
                  <button
                    key={anos}
                    type="button"
                    onClick={() => setPrazoAnos(anos as 1 | 2 | 5)}
                    className={`rounded-2xl border py-3 font-bold transition-colors duration-300 ${
                      prazoAnos === anos
                        ? "border-secondary bg-secondary/5 text-secondary"
                        : "border-gray-200 text-ink hover:border-gray-300"
                    }`}
                  >
                    {anos} {anos === 1 ? "ano" : "anos"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            disabled={loading}
            onClick={handleSalvar}
            className="w-full rounded-2xl bg-primary py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
