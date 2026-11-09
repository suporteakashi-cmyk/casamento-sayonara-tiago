import React, { useState } from 'react';
import { Gift, CheckCircle, Tag, Palette, Info, Heart, Lock } from 'lucide-react';

export default function GiftCard({ gift, onReserve }) {
  const [imageError, setImageError] = useState(false);

  const isAvailable = gift.status === 'available';
  const isReserved = gift.status === 'reserved';
  const isReceived = gift.status === 'received';

  return (
    <div className={`card-silver rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 ${
      !isAvailable ? 'opacity-90 bg-stone-50/50' : 'bg-white'
    }`}>
      
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F6F0]">
        {!imageError && gift.image_url ? (
          <img
            src={gift.image_url}
            alt={gift.name}
            className="w-full h-full object-cover sm:transition-transform sm:duration-500 sm:hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F4F6F0] to-[#E9ECE1]">
            <div className="w-14 h-14 rounded-full bg-white/80 border border-[#CBD5E1] flex items-center justify-center text-[#556B2F] mb-2 shadow-xs">
              <Gift className="w-7 h-7" />
            </div>
            <span className="font-serif-wedding text-stone-600 text-sm font-medium">Sayonara &amp; Tiago</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#3D4D22] border border-[#B9C8A5] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#556B2F] animate-pulse" />
              Disponível
            </span>
          )}
          {isReserved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2E3B1B]/95 text-white shadow-xs">
              <Lock className="w-3 h-3 text-emerald-300" />
              Reservado
            </span>
          )}
          {isReceived && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/95 text-white shadow-xs">
              <CheckCircle className="w-3 h-3" />
              Recebido
            </span>
          )}
        </div>
      </div>

      {/* Content body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-serif-wedding text-xl sm:text-2xl font-bold text-[#263116] mb-2 leading-snug">
            {gift.name}
          </h3>

          {/* Description */}
          {gift.description && (
            <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 mb-4 leading-relaxed">
              {gift.description}
            </p>
          )}

          {/* Details specs */}
          <div className="space-y-2 pt-2 pb-4 border-t border-stone-100 text-xs text-stone-600">
            {gift.details && !gift.model && !gift.color && (
              <div className="flex items-start gap-2">
                <Tag className="w-3.5 h-3.5 text-[#556B2F] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-stone-700 font-medium">Detalhes: </strong>
                  {gift.details}
                </span>
              </div>
            )}

            {gift.model && (
              <div className="flex items-start gap-2">
                <Tag className="w-3.5 h-3.5 text-[#556B2F] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-stone-700 font-medium">Modelo sugerido: </strong>
                  {gift.model}
                </span>
              </div>
            )}

            {gift.color && (
              <div className="flex items-start gap-2">
                <Palette className="w-3.5 h-3.5 text-[#556B2F] mt-0.5 shrink-0" />
                <span>
                  <strong className="text-stone-700 font-medium">Cor preferida: </strong>
                  {gift.color}
                </span>
              </div>
            )}

            {gift.notes && (
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span className="italic text-stone-500">
                  <strong className="text-stone-600 not-italic font-medium">Obs: </strong>
                  {gift.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isAvailable ? (
            <button
              onClick={() => onReserve(gift)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold btn-olive shadow-xs cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Quero presentear com este item</span>
            </button>
          ) : isReserved ? (
            <div className="w-full text-center py-2.5 px-3 rounded-xl bg-stone-100 border border-stone-200 text-xs font-medium text-stone-500 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#556B2F]" />
              <span>Já reservado com carinho</span>
            </div>
          ) : (
            <div className="w-full text-center py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Item já entregue aos noivos</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
