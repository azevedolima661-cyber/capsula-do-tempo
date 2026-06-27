import { cookies } from "next/headers";
import { MEMBRO_COOKIE } from "@/lib/membro";

// Lê o e-mail da sessão (cookie) nas páginas/rotas do servidor.
export async function getMembroEmailServer(): Promise<string | null> {
  const store = await cookies();
  const valor = store.get(MEMBRO_COOKIE)?.value;
  return valor ? decodeURIComponent(valor) : null;
}
