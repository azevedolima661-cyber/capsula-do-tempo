import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { GaleriaCompleta } from "@/components/GaleriaCompleta";

export default async function MemoriasPublicasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: capsula } = await admin
    .from("capsulas")
    .select("id, nome, allow_guest_view")
    .eq("slug", slug)
    .maybeSingle();

  if (!capsula || !capsula.allow_guest_view) {
    notFound();
  }

  const { data: memoriasRaw } = await admin
    .from("memorias")
    .select("id, arquivo_url, tipo, nome_convidado")
    .eq("capsula_id", capsula.id)
    .order("enviado_em", { ascending: false });

  const memorias = await Promise.all(
    (memoriasRaw ?? []).map(async (memoria) => {
      const { data: signed } = await admin.storage
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
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <Link href={`/c/${slug}`} className="text-sm font-bold text-ink/50">
          ← Voltar
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">{capsula.nome}</h1>
        <div className="mt-8">
          <GaleriaCompleta memorias={memorias} />
        </div>
      </div>
    </main>
  );
}
