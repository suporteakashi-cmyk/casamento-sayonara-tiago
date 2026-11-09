import React, { useState } from 'react';
import { X, Heart, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function ReservationModal({ gift, onClose, onConfirmReservation }) {
  const [guestName, setGuestName] = useState('');
  const [guestWhatsapp, setGuestWhatsapp] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!gift) return null;

  // Format Brazilian phone mask (11) 99999-9999
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setGuestWhatsapp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmReservation({
        giftId: gift.id,
        guestName: guestName.trim(),
        guestWhatsapp: guestWhatsapp.trim(),
        guestMessage: guestMessage.trim(),
      });
    } catch (err) {
      console.error('Reservation error:', err);
      if (err.message === 'PRESENT_ALREADY_RESERVED' || err.details?.includes('reservado')) {
        setErrorMessage('Que pena! Este presente acabou de ser reservado por outro convidado.');
      } else if (err.message === 'CONFIG_MISSING') {
        setErrorMessage('O sistema está em modo demonstração (configuração do Supabase pendente).');
      } else {
        setErrorMessage('Não foi possível concluir a reserva agora. Por favor, tente novamente em instantes.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 flex items-center justify-center p-3 sm:p-4">
      
      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-fade-in my-8">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-[#556B2F] to-[#6E8842] text-white px-6 py-5 relative">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-white/80" />
            <span>Presentear Sayonara &amp; Tiago</span>
          </div>
          <h3 className="font-serif-wedding text-2xl font-bold text-white">
            Confirmar Reserva do Presente
          </h3>
        </div>

        {/* Gift Summary */}
        <div className="p-6 bg-[#FAF9F5] border-b border-[#D8DEE4] flex items-center gap-4">
          {gift.image_url ? (
            <img
              src={gift.image_url}
              alt={gift.name}
              className="w-16 h-16 rounded-xl object-contain p-1 bg-white border border-stone-200 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#556B2F] shrink-0 font-serif-wedding font-bold text-lg">
              S&amp;T
            </div>
          )}
          <div>
            <h4 className="font-serif-wedding text-lg font-bold text-[#263116] leading-tight">
              {gift.name}
            </h4>
            {gift.model && (
              <p className="text-xs text-stone-600 mt-0.5">
                <span className="font-medium">Modelo:</span> {gift.model}
              </p>
            )}
            {gift.color && (
              <p className="text-xs text-stone-600">
                <span className="font-medium">Cor:</span> {gift.color}
              </p>
            )}
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Reservation Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Seu Nome Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Maria dos Santos"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              WhatsApp <span className="text-stone-400 font-normal normal-case">(opcional, para contato)</span>
            </label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={guestWhatsapp}
              onChange={handlePhoneChange}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Mensagem para os Noivos <span className="text-stone-400 font-normal normal-case">(opcional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Escreva uma mensagem especial para a Sayonara e o Tiago..."
              value={guestMessage}
              onChange={(e) => setGuestMessage(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold btn-olive flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registrando reserva com carinho...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Confirmar Reserva</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#556B2F]" />
              Reserva instantânea e protegida contra duplicidade
            </span>
          </div>
        </form>

      </div>
    </div>
  );
}
