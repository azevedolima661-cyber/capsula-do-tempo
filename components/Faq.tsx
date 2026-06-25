"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Preciso instalar algum aplicativo?",
    a: "Não. Tudo funciona direto do navegador, tanto pra você quanto pra quem for contribuir com a cápsula.",
  },
  {
    q: "Os convidados precisam se cadastrar para enviar fotos?",
    a: "Não. Com o QR Code da sua cápsula, eles só escaneiam e enviam — sem criar conta, sem senha.",
  },
  {
    q: "Funciona em iPhone e Android?",
    a: "Sim. Funciona em qualquer celular ou computador com acesso à internet.",
  },
  {
    q: "Por quanto tempo os arquivos ficam guardados até a abertura?",
    a: "Pelo tempo que você escolher — 2, 5 ou 10 anos — sem limite de espaço ou risco de perder o conteúdo.",
  },
  {
    q: "Posso baixar tudo de uma vez quando a cápsula abrir?",
    a: "Sim. No dia da abertura você baixa todas as fotos, vídeos e cartas de uma vez só.",
  },
  {
    q: "A Cápsula do Tempo serve só para casamentos?",
    a: "Não. Funciona pra casamento, aniversário, gravidez, nascimento de bebê ou qualquer memória que você queira guardar.",
  },
  {
    q: "Posso criar uma cápsula para outra pessoa?",
    a: "Sim. Você pode presentear alguém criando uma cápsula que só ela vai poder abrir, na data que você escolher.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Se em até 7 dias você decidir que não é para você, devolvemos 100% do valor, sem perguntas.",
  },
  {
    q: "Qual a forma de pagamento?",
    a: "Cartão de crédito, Pix ou boleto, com acesso liberado imediatamente após a confirmação.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 bg-bg2">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-center">
            Perguntas frequentes
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-ink/10">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-lg">{item.q}</span>
                  <span
                    className={`text-2xl text-accent font-black transition-transform duration-500 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-premium ${
                    isOpen ? "max-h-40 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-ink/70 leading-relaxed">{item.a}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
