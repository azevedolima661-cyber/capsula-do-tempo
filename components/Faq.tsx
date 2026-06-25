"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const faqs = [
  {
    q: "Como funciona a Cápsula do Tempo na prática?",
    a: "Você sobe fotos, vídeos e textos na sua cápsula digital, escolhe a data de abertura e nosso sistema guarda tudo em segurança até esse dia chegar.",
  },
  {
    q: "Onde minhas memórias ficam guardadas?",
    a: "Tudo fica armazenado em servidores seguros e criptografados, com backup automático, até a data de abertura escolhida.",
  },
  {
    q: "Posso escolher qualquer data de abertura?",
    a: "Sim. Você define a data exata, seja em 1, 2, 5 ou 10 anos — o tempo que fizer sentido para a sua memória.",
  },
  {
    q: "Posso criar uma cápsula para outra pessoa?",
    a: "Sim. Você pode presentear alguém criando uma cápsula que só ela vai poder abrir, na data que você escolher.",
  },
  {
    q: "E se eu perder a senha ou trocar de e-mail?",
    a: "Nosso suporte recupera o acesso pelo WhatsApp em poucos minutos, sem burocracia.",
  },
  {
    q: "Tem algum limite de fotos ou vídeos?",
    a: "Não. Você pode guardar quantas memórias quiser dentro da sua cápsula.",
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
