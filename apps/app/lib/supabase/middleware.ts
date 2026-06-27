import { NextResponse, type NextRequest } from "next/server";
import { MEMBRO_COOKIE } from "@/lib/membro";

// Sem login seguro: a "porta de entrada" é só o cookie com o e-mail. Se a pessoa
// tenta abrir o painel sem ter entrado, manda de volta pra tela inicial.
export function updateSession(request: NextRequest) {
  const temEmail = request.cookies.get(MEMBRO_COOKIE)?.value;

  if (!temEmail && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
