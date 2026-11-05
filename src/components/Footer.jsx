import React from 'react';
import { Heart, Lock } from 'lucide-react';

export default function Footer({ onAdminClick }) {
  return (
    <footer className="border-t border-[#D8DEE4] bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Monogram */}
        <div className="w-12 h-12 rounded-full border border-[#556B2F]/40 bg-white flex items-center justify-center text-[#556B2F] mb-4 shadow-xs">
          <span className="font-serif-wedding text-xl font-bold">S&amp;T</span>
        </div>

        {/* Wedding Couple Name */}
        <h3 className="font-serif-wedding text-2xl sm:text-3xl font-bold text-[#263116] mb-1">
          Sayonara &amp; Tiago
        </h3>
        <p className="font-display-wedding text-xs uppercase tracking-[0.2em] text-[#556B2F] mb-4 font-semibold">
          16 de Maio de 2027
        </p>

        <p className="max-w-md text-xs sm:text-sm text-stone-500 italic mb-8 leading-relaxed">
          "O amor é paciente, é benigno; o amor tudo sofre, tudo crê, tudo espera, tudo suporta."
        </p>

        <div className="w-24 h-px bg-[#CBD5E1] mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs text-stone-400 gap-4">
          <p>
            © 2027 Casamento Sayonara dos Santos Silva &amp; Tiago Juliano Santos da Silva. Todos os direitos reservados.
          </p>
          <button
            onClick={onAdminClick}
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[#556B2F] transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Área Restrita dos Noivos</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
