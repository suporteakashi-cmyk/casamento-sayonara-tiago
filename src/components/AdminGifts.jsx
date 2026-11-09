import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, RefreshCw, Search, Gift, Lock, Tag, Palette } from 'lucide-react';

export default function AdminGifts({
  gifts,
  onOpenCreate,
  onOpenEdit,
  onDeleteGift,
  onMarkReceived,
  onReleaseGift,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      if (filterStatus !== 'all' && gift.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return (
          gift.name?.toLowerCase().includes(query) ||
          gift.model?.toLowerCase().includes(query) ||
          gift.color?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [gifts, filterStatus, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif-wedding text-2xl font-bold text-[#263116]">
            Gerenciamento de Presentes
          </h3>
          <p className="text-xs text-stone-500">
            Cadastre, edite e acompanhe os itens da sua lista.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold btn-olive shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Presente</span>
        </button>
      </div>

      {/* Filters and search */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full md:w-auto bg-[#F4F6F0] p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-[#2E3B1B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todos ({gifts.length})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'available'
                ? 'bg-white text-[#556B2F] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Disponíveis ({gifts.filter((g) => g.status === 'available').length})
          </button>
          <button
            onClick={() => setFilterStatus('reserved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'reserved'
                ? 'bg-white text-stone-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Reservados ({gifts.filter((g) => g.status === 'reserved').length})
          </button>
          <button
            onClick={() => setFilterStatus('received')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'received'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Recebidos ({gifts.filter((g) => g.status === 'received').length})
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>

      {/* Gifts list / cards */}
      {filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#556B2F]/40 transition-all"
            >
              <div>
                {/* Header Image & Badges */}
                <div className="relative aspect-[16/9] w-full bg-gradient-to-b from-[#F7F8F4] to-[#ECEFE6] p-2 flex items-center justify-center overflow-hidden">
                  {gift.image_url ? (
                    <img
                      src={gift.image_url}
                      alt={gift.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#556B2F] font-serif-wedding text-lg font-bold">
                      S&amp;T
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5">
                    {gift.status === 'available' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 text-[#556B2F] border border-[#CBD5E1] shadow-xs">
                        Disponível
                      </span>
                    )}
                    {gift.status === 'reserved' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-900/90 text-white shadow-xs">
                        Reservado
                      </span>
                    )}
                    {gift.status === 'received' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-700/90 text-white shadow-xs">
                        Recebido
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h4 className="font-serif-wedding text-lg font-bold text-[#263116] leading-tight">
                    {gift.name}
                  </h4>

                  {gift.description && (
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {gift.description}
                    </p>
                  )}

                  <div className="pt-2 text-xs text-stone-600 space-y-1">
                    {gift.details && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="w-3 h-3 text-[#556B2F] shrink-0" />
                        <span className="truncate">{gift.details}</span>
                      </div>
                    )}
                    {gift.model && !gift.details?.includes(gift.model) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Tag className="w-3 h-3 text-[#556B2F] shrink-0" />
                        <span className="truncate">Mod: {gift.model}</span>
                      </div>
                    )}
                    {gift.color && !gift.details?.includes(gift.color) && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Palette className="w-3 h-3 text-[#556B2F] shrink-0" />
                        <span className="truncate">Cor: {gift.color}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-[#FAF9F5] border-t border-stone-200 flex items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEdit(gift)}
                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-[#556B2F] transition-colors"
                    title="Editar presente"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteGift(gift)}
                    className="p-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Excluir presente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {gift.status === 'reserved' && (
                    <button
                      onClick={() => onReleaseGift(gift)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium transition-colors"
                      title="Liberar para que fique disponível novamente"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Liberar</span>
                    </button>
                  )}
                  {gift.status !== 'received' && (
                    <button
                      onClick={() => onMarkReceived(gift)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium transition-colors"
                      title="Marcar presente como recebido"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Recebido</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#CBD5E1] p-6">
          <p className="text-stone-500 text-xs sm:text-sm">
            Nenhum presente corresponde aos filtros selecionados.
          </p>
        </div>
      )}

    </div>
  );
}
