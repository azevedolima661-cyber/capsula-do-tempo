import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CountdownLock } from "@/components/CountdownLock";
import { UploadMemoria } from "@/components/UploadMemoria";

export default async function CapsulaPublicaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: capsula } = await admin
    .from("capsulas")
    .select("id, nome, modalidade, status, data_abertura, allow_guest_view, nome_responsavel")
    .eq("slug", slug)
    .maybeSingle();

  if (!capsula) {
    notFound();
  }

  const aceitaEnvios = capsula.modalidade === "momento_agora" || capsula.status === "fechada";
  const selada = capsula.modalidade === "capsula_tempo" && capsula.status === "fechada";

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center text-2xl font-extrabold text-ink">{capsula.nome}</h1>
        {capsula.nome_responsavel && (
          <p className="mt-1 text-center text-ink/60">por {capsula.nome_responsavel}</p>
        )}

        {selada && capsula.data_abertura && (
          <div className="mt-8">
            <CountdownLock nome={capsula.nome} dataAbertura={capsula.data_abertura} />
          </div>
        )}

        {aceitaEnvios ? (
          <div className="mt-8">
            <UploadMemoria capsulaId={capsula.id} />
          </div>
        ) : (
          <p className="mt-8 text-center text-ink/60">
            Este álbum não está mais aceitando novos envios.
          </p>
        )}

        {capsula.allow_guest_view && (
          <p className="mt-6 text-center">
            <Link href={`/c/${slug}/memorias`} className="font-bold text-primary">
              Ver todas as memórias
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
