"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ProfileMenu({ email }: { email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-2 pr-3 py-1.5 hover:bg-gray-50 transition-colors duration-300"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={16} />
        </span>
        <ChevronDown size={14} className="text-ink/50" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
          <p className="px-3 py-2 text-sm text-ink/60 truncate">{email}</p>
          <Link
            href="/dashboard/configuracoes"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} />
            Configurações
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
