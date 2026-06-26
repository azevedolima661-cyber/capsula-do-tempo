import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AppPage() {
  const supabase = await createClient();
  const { data: capsules } = await supabase
    .from("capsules")
    .select("id, title, open_date, status")
    .order("created_at", { ascending: false });

  return (
    <main className="flex-1 px-6 py-24 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
          Minhas cápsulas
        </h1>
        <div className="flex items-center gap-4">
          <Link
            href="/app/nova"
            className="rounded-full bg-ink text-bg font-bold uppercase tracking-widest text-xs px-5 py-3 hover:bg-accent hover:text-ink transition-colors duration-500 whitespace-nowrap"
          >
            + Nova cápsula
          </Link>
          <LogoutButton />
        </div>
      </div>

      {(!capsules || capsules.length === 0) && (
        <p className="mt-10 text-ink/60">
          Você ainda não criou nenhuma cápsula.{" "}
          <Link href="/app/nova" className="font-bold text-accent">
            Criar a primeira
          </Link>
        </p>
      )}

      <div className="mt-10 space-y-4">
        {capsules?.map((c) => (
          <Link
            key={c.id}
            href={`/app/capsula/${c.id}`}
            className="block rounded-[24px] bg-bg2 px-6 py-5 hover:bg-accent/20 transition-colors duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{c.title}</p>
                <p className="text-sm text-ink/60">
                  Abre em {new Date(c.open_date).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <span
                className={`rounded-full text-[10px] font-black uppercase tracking-widest px-3 py-1 whitespace-nowrap ${
                  c.status === "aberta"
                    ? "bg-accent text-ink"
                    : "bg-ink/10 text-ink/60"
                }`}
              >
                {c.status === "aberta" ? "Aberta" : "Fechada"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
