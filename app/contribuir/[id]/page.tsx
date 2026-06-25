import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import ContribuirForm from "@/components/ContribuirForm";

export default async function ContribuirPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: capsule } = await supabase
    .from("capsules")
    .select("id, title, status")
    .eq("id", id)
    .single();

  if (!capsule) notFound();

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
          {capsule.title}
        </h1>

        {capsule.status === "aberta" ? (
          <p className="mt-4 text-ink/60">
            Essa cápsula já foi aberta e não está recebendo mais contribuições.
          </p>
        ) : (
          <>
            <p className="mt-2 text-ink/60">
              Mande uma foto, vídeo ou carta para essa cápsula do tempo.
            </p>
            <ContribuirForm capsuleId={id} />
          </>
        )}
      </div>
    </main>
  );
}
