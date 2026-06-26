"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/entrar");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[10px] font-bold uppercase tracking-widest text-ink/50 hover:text-accent transition-colors"
    >
      Sair
    </button>
  );
}
