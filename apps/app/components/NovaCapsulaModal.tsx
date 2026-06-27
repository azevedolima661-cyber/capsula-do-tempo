"use client";

import { useState } from "react";
import { Camera, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { gerarSlug } from "@/lib/slug";

type Modalidade = "momento_agora" | "capsula_tempo";

export function NovaCapsulaModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [modalidade, setModalidade] = useState<Modalidade | null>(null);
  const [prazoAnos, setPrazoAnos] = useState<1 | 2 | 5 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const podeAvancar = nome.trim().length > 0 && modalidade !== null;
  const podeCriar = modalidade === "momento_agora" || (modalidade === "capsula_tempo" && prazoAnos !== null);

  const handleCriar = async () => {
    if (!modalidade) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError("Sessão expirada. Faça login novamente.");
      setLoading(false);
      return;
    }

    const dataEventoIso = dataEvento ? new Date(dataEvento).toISOString() : null;
    const dataAbertura =
      modalidade === "capsula_tempo" && prazoAnos && dataEventoIso
        ? new Date(
            new Date(dataEventoIso).setFullYear(new Date(dataEventoIso).getFullYear() + prazoAnos)
          ).toISOString()
        : null;

    const { data, error: insertError } = await supabase
      .from("capsulas")
      .insert({
        user_id: userData.user.id,
        nome,
        slug: gerarSlug(nome),
        modalidade,
        prazo_anos: modalidade === "capsula_tempo" ? prazoAnos : null,
        data_evento: dataEventoIso,
        data_abertura: dataAbertura,
        nome_responsavel: nomeResponsavel || null,
        status: modalidade === "capsula_tempo" ? "fechada" : "ativa",
      })
      .select("slug")
      .single();

    if (insertError || !data) {
      setError("Não foi possível criar o álbum. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(`/dashboard/album/${data.slug}/completo`);
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-ink">Novo álbum</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={20} />
          </button>
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70">Nome do álbum</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Casamento da Ana e do João"
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
              <label className="text-sm font-medium text-ink/70">Data do evento</label>
              <input
                type="date"
                value={dataEvento}
                onChange={(e) => setDataEvento(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink/70">Modalidade</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalidade("momento_agora")}
                  className={`rounded-2xl border p-4 text-left transition-colors duration-300 ${
                    modalidade === "momento_agora"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Camera className="text-primary" size={20} />
                  <p className="mt-2 font-bold text-ink">Momento Agora</p>
                  <p className="text-sm text-ink/60">Coleta em tempo real, sem trava de data.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setModalidade("capsula_tempo")}
                  className={`rounded-2xl border p-4 text-left transition-colors duration-300 ${
                    modalidade === "capsula_tempo"
                      ? "border-secondary bg-secondary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Clock className="text-secondary" size={20} />
                  <p className="mt-2 font-bold text-ink">Cápsula do Tempo</p>
                  <p className="text-sm text-ink/60">Selada até a data de abertura.</p>
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={!podeAvancar}
              onClick={() => setStep(2)}
              className="w-full rounded-2xl bg-primary py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && modalidade === "momento_agora" && (
          <div className="mt-6 space-y-4">
            <p className="text-ink/70">
              Seu álbum <span className="font-bold">{nome}</span> vai aceitar fotos e vídeos
              imediatamente, sem nenhuma trava de data.
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-gray-200 py-3 font-bold text-ink hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleCriar}
                className="flex-1 rounded-2xl bg-primary py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar álbum"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && modalidade === "capsula_tempo" && (
          <div className="mt-6 space-y-4">
            <label className="text-sm font-medium text-ink/70">
              Por quanto tempo a cápsula fica selada?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 5].map((anos) => (
                <button
                  key={anos}
                  type="button"
                  onClick={() => setPrazoAnos(anos as 1 | 2 | 5)}
                  className={`rounded-2xl border py-4 font-bold transition-colors duration-300 ${
                    prazoAnos === anos
                      ? "border-secondary bg-secondary/5 text-secondary"
                      : "border-gray-200 text-ink hover:border-gray-300"
                  }`}
                >
                  {anos} {anos === 1 ? "ano" : "anos"}
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-2xl border border-gray-200 py-3 font-bold text-ink hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!podeCriar || loading}
                onClick={handleCriar}
                className="flex-1 rounded-2xl bg-primary py-3 font-bold text-white shadow-sm hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar álbum"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
