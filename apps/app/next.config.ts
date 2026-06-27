import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A tela de entrada agora é a raiz "/". Rotas antigas de login (/entrar e
  // /login, de versões anteriores do app) passam a redirecionar pra raiz, pra
  // que links ou caches antigos não caiam em 404.
  async redirects() {
    return [
      { source: "/entrar", destination: "/", permanent: false },
      { source: "/login", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
