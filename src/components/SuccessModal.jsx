import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, CheckCircle2, Sparkles, X } from 'lucide-react';

export default function SuccessModal({ gift, guestName, onClose }) {
  useEffect(() => {
    // Elegant celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#556B2F', '#CBD5E1', '#E2E8F0', '#6B8E23', '#F59E0B'],
      });
    } catch (e) {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 sm:p-8 text-center animate-fade-in my-8">
        
        {/* Close icon button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#ECF0E6] border-2 border-[#556B2F] flex items-center justify-center text-[#556B2F] mx-auto mb-5 shadow-sm">
          <Heart className="w-8 h-8 fill-[#556B2F]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#CBD5E1] text-[11px] font-semibold text-[#556B2F] uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Reserva Confirmada
        </div>

        <h3 className="font-serif-wedding text-2xl sm:text-3xl font-bold text-[#263116] mb-3">
          Presente Reservado com Sucesso!
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mb-6 font-medium">
          Muito obrigado por fazer parte desse momento tão especial da nossa história.
        </p>

        {/* Gift Recap Box */}
        <div className="bg-[#FAF9F5] border border-[#D8DEE4] rounded-2xl p-4 text-left mb-6 text-xs sm:text-sm">
          <div className="text-stone-500 text-xs mb-1">Item reservado com amor:</div>
          <div className="font-serif-wedding text-base sm:text-lg font-bold text-[#2E3B1B]">
            {gift?.name}
          </div>
          {guestName && (
            <div className="mt-2 pt-2 border-t border-stone-200/80 text-xs text-stone-600">
              <span className="font-semibold text-stone-700">Convidado(a):</span> {guestName}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold btn-olive shadow-sm"
        >
          Voltar para a Lista de Presentes
        </button>

      </div>
    </div>
  );
}
