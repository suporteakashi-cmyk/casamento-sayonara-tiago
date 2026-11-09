import React, { useState, useEffect, memo } from 'react';
import { Gift, Calendar, Heart, Sparkles, ChevronDown } from 'lucide-react';

// Isolated timer component to prevent full Hero re-renders every second
const CountdownTimer = memo(function CountdownTimer() {
  const weddingDate = new Date('2027-05-16T17:00:00-03:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-sm mx-auto">
      <div className="bg-white/95 border border-[#D8DEE4] rounded-xl p-2 sm:p-2.5 shadow-xs text-center">
        <span className="block font-serif-wedding text-xl sm:text-2xl font-bold text-[#2E3B1B] leading-none">
          {timeLeft.days}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          Dias
        </span>
      </div>
      <div className="bg-white/95 border border-[#D8DEE4] rounded-xl p-2 sm:p-2.5 shadow-xs text-center">
        <span className="block font-serif-wedding text-xl sm:text-2xl font-bold text-[#2E3B1B] leading-none">
          {timeLeft.hours}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          Horas
        </span>
      </div>
      <div className="bg-white/95 border border-[#D8DEE4] rounded-xl p-2 sm:p-2.5 shadow-xs text-center">
        <span className="block font-serif-wedding text-xl sm:text-2xl font-bold text-[#2E3B1B] leading-none">
          {timeLeft.minutes}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          Min
        </span>
      </div>
      <div className="bg-white/95 border border-[#D8DEE4] rounded-xl p-2 sm:p-2.5 shadow-xs text-center">
        <span className="block font-serif-wedding text-xl sm:text-2xl font-bold text-[#556B2F] leading-none">
          {timeLeft.seconds}
        </span>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-500 font-medium">
          Seg
        </span>
      </div>
    </div>
  );
});

export default function Hero({ onExploreClick }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-[#FAF9F5] via-[#F4F6F0] to-[#FAF9F5]">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-[#D8DEE4] shadow-xs text-xs font-medium text-[#556B2F] mb-4 sm:mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#556B2F]" />
          <span className="tracking-widest uppercase text-[10px] sm:text-[11px] font-semibold">Lista Oficial de Presentes</span>
        </div>

        {/* Names in Highlight */}
        <h1 className="font-serif-wedding text-4xl sm:text-6xl md:text-7xl font-bold text-[#263116] tracking-tight leading-[1.08] mb-2 sm:mb-3">
          Sayonara &amp; Tiago
        </h1>

        <p className="font-display-wedding text-[11px] sm:text-xs md:text-sm tracking-[0.2em] text-[#556B2F] uppercase mb-5 sm:mb-6 font-semibold px-2">
          Sayonara dos Santos Silva &amp; Tiago Juliano Santos da Silva
        </p>

        {/* Wedding Date Pill */}
        <div className="inline-flex items-center justify-center gap-2 text-stone-600 text-xs sm:text-sm font-medium mb-6 sm:mb-8 bg-white/70 px-4 py-1.5 rounded-full border border-stone-200/60">
          <Calendar className="w-3.5 h-3.5 text-[#556B2F]" />
          <span>16 de Maio de 2027</span>
          <span className="text-stone-300">•</span>
          <span>Celebração do Nosso Amor</span>
        </div>

        {/* Official Couple Photo in Romantic Frame - Natural 9:16 vertical fit */}
        <div className="max-w-[270px] sm:max-w-[310px] mx-auto mb-8 sm:mb-10">
          <div className="relative p-2 sm:p-2.5 bg-white rounded-3xl border border-[#CBD5E1] shadow-md transition-transform duration-300 hover:scale-[1.01]">
            
            {/* 9:16 Aspect Ratio matching natural portrait photo */}
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-stone-100">
              <img
                src="/sayonara-tiago.jpg"
                alt="Sayonara & Tiago"
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              
              {/* Soft Gradient Overlay at bottom of image */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-2.5">
                <span className="text-white font-serif-wedding text-sm sm:text-base font-semibold drop-shadow-sm flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-white text-white" />
                  Sayonara &amp; Tiago
                </span>
              </div>
            </div>

            {/* Subtle silver-olive badge below photo */}
            <div className="mt-2 text-center">
              <span className="text-[11px] font-serif-wedding italic text-stone-500">
                Nosso amor começou aqui e se fortalece a cada dia
              </span>
            </div>
          </div>
        </div>

        {/* Romantic Welcome Quote */}
        <div className="max-w-xl mx-auto bg-white/85 p-5 sm:p-7 rounded-2xl border border-[#CBD5E1]/70 shadow-xs mb-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#FAF9F5] border border-[#CBD5E1] rounded-full text-xs text-[#556B2F]">
            <Heart className="w-3 h-3 fill-[#556B2F]" />
          </div>
          <p className="font-serif-wedding text-base sm:text-lg text-stone-700 italic leading-relaxed">
            "Estamos muito felizes em compartilhar esse momento tão especial com você! Preparamos uma lista de presentes com muito carinho. Sua presença e seu carinho são os maiores presentes que poderíamos receber."
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-stone-500 font-semibold mb-3">
            Contagem Regressiva para o Grande Dia
          </p>
          <CountdownTimer />
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold btn-olive shadow-sm cursor-pointer"
          >
            <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Ver Lista de Presentes</span>
          </button>
        </div>

        {/* Gentle scroll indicator */}
        <div className="mt-8 flex justify-center text-stone-400">
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>

      </div>
    </section>
  );
}
