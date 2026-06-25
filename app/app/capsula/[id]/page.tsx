import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import CapsuleManager from "@/components/CapsuleManager";

export default async function CapsulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: capsule } = await supabase
    .from("capsules")
    .select("id, title, open_date, status")
    .eq("id", id)
    .single();

  if (!capsule) notFound();

  const { data: items } = await supabase
    .from("capsule_items")
    .select("id, type, storage_path, content, uploaded_by_name, created_at")
    .eq("capsule_id", id)
    .order("created_at", { ascending: false });

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  const contributeUrl = `${protocol}://${host}/contribuir/${id}`;
  const qrDataUrl = await QRCode.toDataURL(contributeUrl, { margin: 1, width: 240 });

  return (
    <main className="flex-1 px-6 py-24 max-w-3xl mx-auto w-full">
      <Link href="/app" className="text-sm font-bold uppercase tracking-widest text-ink/50">
        ← Voltar
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
            {capsule.title}
          </h1>
          <p className="mt-2 text-ink/60">
            {capsule.status === "aberta"
              ? `Aberta em ${new Date(capsule.open_date).toLocaleDateString("pt-BR")}`
              : `Abre em ${new Date(capsule.open_date).toLocaleDateString("pt-BR")}`}
          </p>
        </div>

        {capsule.status !== "aberta" && (
          <div className="rounded-[24px] bg-bg2 p-5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR Code para contribuir" className="w-32 h-32 mx-auto" />
            <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-ink/50">
              QR para convidados
            </p>
            <Link href={contributeUrl} className="text-xs text-accent font-bold break-all">
              {contributeUrl}
            </Link>
          </div>
        )}
      </div>

      {capsule.status === "aberta" && (
        <div className="mt-8 rounded-[24px] bg-accent/20 px-6 py-5">
          <p className="font-black uppercase tracking-tighter">Sua cápsula foi aberta!</p>
          <p className="mt-1 text-sm text-ink/60">
            Reviva e baixe tudo o que foi guardado ao longo do tempo.
          </p>
        </div>
      )}

      <CapsuleManager capsuleId={id} initialItems={items ?? []} readOnly={capsule.status === "aberta"} />
    </main>
  );
}
