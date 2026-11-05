import React, { useState, useMemo } from 'react';
import GiftCard from './GiftCard';
import { Search, Gift, Sparkles, Filter } from 'lucide-react';

export default function GiftList({ gifts, loading, onReserveGift }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'available', 'reserved'
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering & search
  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      // Status filter
      if (activeFilter === 'available' && gift.status !== 'available') {
        return false;
      }
      if (activeFilter === 'reserved' && gift.status === 'available') {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = gift.name?.toLowerCase().includes(query);
        const matchDesc = gift.description?.toLowerCase().includes(query);
        const matchModel = gift.model?.toLowerCase().includes(query);
        const matchColor = gift.color?.toLowerCase().includes(query);
        return matchName || matchDesc || matchModel || matchColor;
      }

      return true;
    });
  }, [gifts, activeFilter, searchTerm]);

  const counts = useMemo(() => {
    const total = gifts.length;
    const available = gifts.filter((g) => g.status === 'available').length;
    const reserved = gifts.filter((g) => g.status !== 'available').length;
    return { total, available, reserved };
  }, [gifts]);

  return (
    <section id="presentes" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title & subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECF0E6] text-[#556B2F] text-xs font-semibold uppercase tracking-wider mb-3">
          <Gift className="w-3.5 h-3.5" />
          Nossa Lista de Sonhos
        </div>
        <h2 className="font-serif-wedding text-3xl sm:text-5xl font-bold text-[#263116]">
          Catálogo de Presentes
        </h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600">
          Escolha o item com o qual deseja presentear Sayonara &amp; Tiago. Cada detalhe foi pensado com carinho para o nosso novo lar.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#CBD5E1] rounded-2xl p-3 sm:p-4 shadow-xs mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto p-1 bg-[#F4F6F0] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-[#2E3B1B] shadow-xs border border-[#CBD5E1]/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos ({counts.total})
            </button>
            <button
              onClick={() => setActiveFilter('available')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'available'
                  ? 'bg-white text-[#556B2F] shadow-xs border border-[#CBD5E1]/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Disponíveis ({counts.available})
            </button>
            <button
              onClick={() => setActiveFilter('reserved')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-lg transition-all ${
                activeFilter === 'reserved'
                  ? 'bg-white text-stone-800 shadow-xs border border-[#CBD5E1]/60'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Reservados ({counts.reserved})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar presentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all"
            />
          </div>

        </div>
      </div>

      {/* Gifts Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-3 border-[#556B2F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600 text-sm">Carregando lista com carinho...</p>
        </div>
      ) : filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGifts.map((gift) => (
            <GiftCard
              key={gift.id}
              gift={gift}
              onReserve={onReserveGift}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#CBD5E1] rounded-2xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F4F6F0] text-[#556B2F] flex items-center justify-center mx-auto mb-3">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="font-serif-wedding text-xl font-bold text-stone-800 mb-1">
            Nenhum presente encontrado
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mb-4">
            Não encontramos itens com os filtros ou termo de busca informado.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchTerm('');
            }}
            className="text-xs font-semibold text-[#556B2F] underline hover:text-[#445625]"
          >
            Limpar filtros e ver todos os presentes
          </button>
        </div>
      )}

    </section>
  );
}
