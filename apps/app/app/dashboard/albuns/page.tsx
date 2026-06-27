import { createAdminClient } from "@/lib/supabase/admin";
import { getMembroEmailServer } from "@/lib/membro-server";
import { AlbumCardManaged } from "@/components/AlbumCardManaged";
import { CriarAlbumButton } from "@/components/CriarAlbumButton";

export default async function AlbunsPage() {
  const email = await getMembroEmailServer();
  const supabase = createAdminClient();
  const { data: capsulas } = await supabase
    .from("capsulas")
    .select(
      "id, nome, slug, modalidade, prazo_anos, data_evento, status, allow_guest_view, data_abertura, nome_responsavel, event_date_change_count"
    )
    .eq("owner_email", email)
    .order("criado_em", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Meus álbuns</h1>
        <CriarAlbumButton />
      </div>

      {!capsulas || capsulas.length === 0 ? (
        <div className="mt-12 rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-ink/60">Você ainda não criou nenhum álbum.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capsulas.map((capsula) => (
            <AlbumCardManaged key={capsula.id} capsula={capsula} />
          ))}
        </div>
      )}
    </div>
  );
}
