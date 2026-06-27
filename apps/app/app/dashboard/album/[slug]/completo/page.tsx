import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CountdownLock } from "@/components/CountdownLock";
import { GaleriaCompleta } from "@/components/GaleriaCompleta";

export default async function GaleriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: capsula } = await supabase
    .from("capsulas")
    .select("id, nome, slug, modalidade, status, data_abertura, user_id")
    .eq("slug", slug)
    .maybeSingle();

  if (!capsula || capsula.user_id !== userData.user?.id) {
    notFound();
  }

  const selada = capsula.modalidade === "capsula_tempo" && capsula.status === "fechada";

  const { data: memoriasRaw } = await supabase
    .from("memorias")
    .select("id, arquivo_url, tipo, nome_convidado")
    .eq("capsula_id", capsula.id)
    .order("enviado_em", { ascending: false });

  const memorias = await Promise.all(
    (memoriasRaw ?? []).map(async (memoria) => {
      const { data: signed } = await supabase.storage
        .from("capsulas")
        .createSignedUrl(memoria.arquivo_url, 60 * 60);

      return {
        id: memoria.id,
        url: signed?.signedUrl ?? "",
        tipo: memoria.tipo as "foto" | "video",
        nomeConvidado: memoria.nome_convidado,
      };
    })
  );

  return (
    <div>
      <Link href="/dashboard/albuns" className="text-sm font-bold text-ink/50">
        ← Voltar para meus álbuns
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold text-ink">{capsula.nome}</h1>

      <div className="mt-8">
        {selada && capsula.data_abertura ? (
          <CountdownLock nome={capsula.nome} dataAbertura={capsula.data_abertura} />
        ) : (
          <GaleriaCompleta memorias={memorias} />
        )}
      </div>
    </div>
  );
}
