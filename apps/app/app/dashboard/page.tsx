import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMembroEmailServer } from "@/lib/membro-server";
import { AlbumCard } from "@/components/AlbumCard";
import { CriarAlbumButton } from "@/components/CriarAlbumButton";

export default async function DashboardPage() {
  const email = await getMembroEmailServer();
  const supabase = createAdminClient();
  const { data: capsulas } = await supabase
    .from("capsulas")
    .select("id, nome, slug, modalidade, status, allow_guest_view, data_abertura")
    .eq("owner_email", email)
    .order("criado_em", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Seus álbuns</h1>
          <p className="mt-1 text-ink/60">Gerencie suas memórias e compartilhe com quem você ama.</p>
        </div>
        <CriarAlbumButton />
      </div>

      {!capsulas || capsulas.length === 0 ? (
        <div className="mt-12 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-ink/60">Você ainda não criou nenhum álbum.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capsulas.map((capsula) => (
            <AlbumCard key={capsula.id} capsula={capsula} />
          ))}
        </div>
      )}

      {capsulas && capsulas.length > 0 && (
        <Link
          href="/dashboard/albuns"
          className="mt-6 inline-block text-sm font-bold text-primary"
        >
          Ver todos os álbuns →
        </Link>
      )}

      <a
        href="https://wa.me/?text=Preciso%20de%20ajuda%20com%20a%20Cápsula%20do%20Tempo"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:opacity-90"
      >
        <HelpCircle size={22} />
      </a>
    </div>
  );
}
