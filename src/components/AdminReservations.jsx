import React, { useState } from 'react';
import { Heart, MessageSquare, Phone, Calendar, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';

export default function AdminReservations({
  reservations,
  onCancelReservation,
  onMarkReceived,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = reservations.filter((res) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const guestMatch = res.guest_name?.toLowerCase().includes(q);
    const giftMatch = res.gifts?.name?.toLowerCase().includes(q);
    const msgMatch = res.guest_message?.toLowerCase().includes(q);
    return guestMatch || giftMatch || msgMatch;
  });

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone) => {
    if (!phone) return null;
    const cleanNumber = phone.replace(/\D/g, '');
    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    return `https://wa.me/${fullNumber}`;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-wedding text-2xl font-bold text-[#263116]">
            Reservas dos Convidados
          </h3>
          <p className="text-xs text-stone-500">
            Acompanhe com carinho as confirmações e mensagens recebidas.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por convidado ou presente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>

      {/* Reservations List */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((res) => {
            const waLink = getWhatsAppLink(res.guest_whatsapp);
            const isCancelled = res.status === 'cancelled';

            return (
              <div
                key={res.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                  isCancelled
                    ? 'border-stone-200 bg-stone-50/60 opacity-70'
                    : 'border-[#CBD5E1] hover:border-[#556B2F]/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Guest & Gift Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif-wedding text-xl font-bold text-[#263116]">
                        {res.guest_name}
                      </span>

                      {isCancelled ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                          Reserva Cancelada
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECF0E6] text-[#556B2F] border border-[#B9C8A5]">
                          Confirmada
                        </span>
                      )}

                      {res.guest_whatsapp && waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{res.guest_whatsapp}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>

                    {/* Gift name badge */}
                    <div className="flex items-center gap-2 text-xs text-stone-600">
                      <Heart className="w-3.5 h-3.5 text-[#556B2F] fill-[#556B2F]" />
                      <span>
                        <strong className="text-stone-800">Presente: </strong>
                        {res.gifts?.name || 'Presente'}
                      </span>
                      {res.gifts?.model && (
                        <span className="text-stone-400">({res.gifts.model})</span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <Calendar className="w-3 h-3" />
                      <span>Reservado em {formatDate(res.created_at)}</span>
                    </div>

                    {/* Guest Message */}
                    {res.guest_message && (
                      <div className="mt-2 p-3 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs text-stone-700 italic flex items-start gap-2 max-w-2xl">
                        <MessageSquare className="w-3.5 h-3.5 text-[#556B2F] shrink-0 mt-0.5 not-italic" />
                        <span>"{res.guest_message}"</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  {!isCancelled && (
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <button
                        onClick={() => onCancelReservation(res)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
                        title="Cancelar reserva e liberar o presente para a lista pública"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancelar Reserva</span>
                      </button>

                      {res.gifts?.status !== 'received' && (
                        <button
                          onClick={() => onMarkReceived(res.gifts)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          title="Marcar presente como recebido"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Marcar Recebido</span>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#CBD5E1] p-8">
          <Heart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h4 className="font-serif-wedding text-lg font-bold text-stone-700 mb-1">
            Nenhuma reserva encontrada
          </h4>
          <p className="text-xs text-stone-500">
            Assim que os convidados escolherem os presentes, eles aparecerão aqui com todos os detalhes e mensagens.
          </p>
        </div>
      )}

    </div>
  );
}
