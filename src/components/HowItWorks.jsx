import React from 'react';
import { Search, HeartHandshake, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: '1. Escolha o Presente',
      description: 'Navegue pela nossa lista e selecione o item desejado, conferindo modelo, cor e detalhes pensados para o nosso lar.',
    },
    {
      step: '02',
      icon: HeartHandshake,
      title: '2. Reserve com seu Nome',
      description: 'Clique em "Quero presentear com este item", digite seu nome e, se desejar, deixe uma linda mensagem de carinho para nós.',
    },
    {
      step: '03',
      icon: CheckCircle2,
      title: '3. Reserva Automática',
      description: 'O item é bloqueado instantaneamente no sistema para que ninguém mais o escolha. Você compra na loja de sua preferência!',
    },
  ];

  return (
    <section id="como-funciona" className="py-16 sm:py-20 border-t border-b border-[#D8DEE4]/50 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#556B2F] block mb-2">
            Simples, Elegante &amp; Prático
          </span>
          <h2 className="font-serif-wedding text-3xl sm:text-4xl font-bold text-[#263116]">
            Como Funciona a Escolha
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Criamos este espaço para organizar os presentes do casamento de maneira harmoniosa, sem repetições e com total liberdade de escolha de compra para você.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="relative bg-[#FAF9F5] border border-[#CBD5E1]/70 rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:border-[#556B2F]/40 hover:shadow-md"
              >
                {/* Step badge */}
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#556B2F] text-white text-xs font-bold tracking-wider">
                  PASSO {item.step}
                </span>

                <div className="w-14 h-14 mx-auto mt-2 mb-5 rounded-2xl bg-[#ECF0E6] border border-[#D7DFCC] flex items-center justify-center text-[#556B2F]">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-serif-wedding text-xl font-bold text-[#2E3B1B] mb-2">
                  {item.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Informative reassurance banner */}
        <div className="mt-12 max-w-3xl mx-auto rounded-xl bg-[#F6F7F3] border border-[#D8DEE4] p-4 sm:p-5 flex items-start sm:items-center gap-3.5 text-stone-700 text-xs sm:text-sm">
          <div className="p-2 rounded-lg bg-[#556B2F]/10 text-[#556B2F] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-[#2E3B1B]">Transparência e Afeto: </span>
            Não realizamos transações financeiras nem cobramos pagamentos neste site. A reserva serve para sinalizar aos outros convidados que o item já possui um padrinho ou amigo especial que irá presenteá-lo.
          </div>
        </div>

      </div>
    </section>
  );
}
