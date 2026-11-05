import React, { useState, useEffect } from 'react';
import { Gift, Calendar, Heart, Sparkles, ChevronDown } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  // Wedding date: 16 de maio de 2027
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
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF9F5] via-[#F4F6F0] to-[#FAF9F5]">
      
      {/* Decorative Botanical Leaf Accents (Silver & Olive) */}
      <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 opacity-15 pointer-events-none">
        <svg width="280" height="280" viewBox="0 0 200 200" fill="none">
          <path d="M40 180 C 40 100, 100 60, 180 40 C 140 100, 100 140, 40 180 Z" fill="#556B2F" />
          <path d="M70 150 C 70 90, 120 60, 170 50" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-12 translate-y-12 opacity-15 pointer-events-none">
        <svg width="280" height="280" viewBox="0 0 200 200" fill="none">
          <path d="M160 20 C 160 100, 100 140, 20 160 C 60 100, 100 60, 160 20 Z" fill="#556B2F" />
          <path d="M130 50 C 130 110, 80 140, 30 150" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Subtle Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#D8DEE4] shadow-xs text-xs font-medium text-[#556B2F] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#556B2F]" />
          <span className="tracking-widest uppercase text-[11px] font-semibold">Lista Oficial de Presentes</span>
        </div>

        {/* Names in Highlight */}
        <h1 className="font-serif-wedding text-4xl sm:text-6xl md:text-7xl font-bold text-[#263116] tracking-tight leading-[1.1] mb-3">
          Sayonara &amp; Tiago
        </h1>

        <p className="font-display-wedding text-xs sm:text-sm tracking-[0.25em] text-[#556B2F] uppercase mb-6 font-semibold">
          Sayonara dos Santos Silva &amp; Tiago Juliano Santos da Silva
        </p>

        {/* Wedding Date Pill */}
        <div className="flex items-center justify-center gap-2 text-stone-600 text-sm sm:text-base font-medium mb-8">
          <Calendar className="w-4 h-4 text-[#556B2F]" />
          <span>16 de Maio de 2027</span>
          <span className="text-stone-300">•</span>
          <span>Celebração do Nosso Amor</span>
        </div>

        {/* Romantic Welcome Quote */}
        <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xs p-6 sm:p-8 rounded-2xl border border-[#CBD5E1]/60 shadow-sm mb-10 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#FAF9F5] border border-[#CBD5E1] rounded-full text-xs text-[#556B2F]">
            <Heart className="w-3.5 h-3.5 fill-[#556B2F]" />
          </div>
          <p className="font-serif-wedding text-lg sm:text-xl text-stone-700 italic leading-relaxed">
            "Estamos muito felizes em compartilhar esse momento tão especial com você! Preparamos uma lista de presentes com muito carinho. Sua presença e seu carinho são os maiores presentes que poderíamos receber."
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold mb-4">
            Contagem Regressiva para o Grande Dia
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            <div className="bg-white/90 border border-[#D8DEE4] rounded-xl p-3 shadow-xs">
              <span className="block font-serif-wedding text-2xl sm:text-3xl font-bold text-[#2E3B1B]">
                {timeLeft.days}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium">
                Dias
              </span>
            </div>
            <div className="bg-white/90 border border-[#D8DEE4] rounded-xl p-3 shadow-xs">
              <span className="block font-serif-wedding text-2xl sm:text-3xl font-bold text-[#2E3B1B]">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium">
                Horas
              </span>
            </div>
            <div className="bg-white/90 border border-[#D8DEE4] rounded-xl p-3 shadow-xs">
              <span className="block font-serif-wedding text-2xl sm:text-3xl font-bold text-[#2E3B1B]">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium">
                Min
              </span>
            </div>
            <div className="bg-white/90 border border-[#D8DEE4] rounded-xl p-3 shadow-xs">
              <span className="block font-serif-wedding text-2xl sm:text-3xl font-bold text-[#556B2F]">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 font-medium">
                Seg
              </span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-semibold bg-[#556B2F] text-white hover:bg-[#445625] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Gift className="w-5 h-5" />
            <span>Ver Lista de Presentes</span>
          </button>
        </div>

        {/* Gentle scroll indicator */}
        <div className="mt-12 flex justify-center text-stone-400">
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>

      </div>
    </section>
  );
}
