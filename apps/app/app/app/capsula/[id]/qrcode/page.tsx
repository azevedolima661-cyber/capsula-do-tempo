import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import QRStudio from "@/components/QRStudio";

export default async function QRCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: capsule } = await supabase
    .from("capsules")
    .select("id, title, open_date, status, qr_settings")
    .eq("id", id)
    .single();

  if (!capsule) notFound();

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const contributeUrl = `${protocol}://${host}/contribuir/${id}`;

  return (
    <main className="flex-1 px-6 py-24 max-w-5xl mx-auto w-full">
      <Link href={`/app/capsula/${id}`} className="text-sm font-bold uppercase tracking-widest text-ink/50">
        ← Voltar
      </Link>

      <h1 className="mt-6 text-3xl md:text-4xl font-black tracking-tighter uppercase">
        QR Code para o evento
      </h1>
      <p className="mt-2 text-ink/60">
        Escolha um modelo, personalize com seus dados e baixe em PDF pronto para imprimir nas mesas.
      </p>

      <QRStudio
        capsuleId={id}
        contributeUrl={contributeUrl}
        defaultTitle={capsule.title}
        defaultDate={new Date(capsule.open_date).toLocaleDateString("pt-BR")}
        savedSettings={capsule.qr_settings ?? null}
        disabled={capsule.status === "aberta"}
      />
    </main>
  );
}
