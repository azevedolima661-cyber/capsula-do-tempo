// Identidade do membro = só um e-mail guardado localmente. NÃO é autenticação:
// serve apenas como "porta de entrada" pra identificar a sessão. A liberação de
// acesso acontece fora do app.

export const MEMBRO_COOKIE = "membro_email";
const MEMBRO_LS_KEY = "membro_email";
const UM_ANO = 60 * 60 * 24 * 365;

// Salva o e-mail no localStorage (pedido do produto) e também num cookie, pra
// que as páginas renderizadas no servidor consigam ler a sessão.
export function setMembroEmail(email: string) {
  const valor = email.trim().toLowerCase();
  localStorage.setItem(MEMBRO_LS_KEY, valor);
  document.cookie = `${MEMBRO_COOKIE}=${encodeURIComponent(valor)}; path=/; max-age=${UM_ANO}; SameSite=Lax`;
}

export function getMembroEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(MEMBRO_LS_KEY);
}

export function clearMembro() {
  localStorage.removeItem(MEMBRO_LS_KEY);
  document.cookie = `${MEMBRO_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
