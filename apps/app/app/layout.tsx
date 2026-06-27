import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cápsula do Tempo",
  description: "Guarde e compartilhe memórias agora ou para o futuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${leagueSpartan.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bg text-ink">
        {children}
      </body>
    </html>
  );
}
