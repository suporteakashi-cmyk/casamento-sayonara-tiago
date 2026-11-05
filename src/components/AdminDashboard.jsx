import React, { useState } from 'react';
import {
  Gift,
  CheckCircle,
  Clock,
  Package,
  QrCode,
  LogOut,
  Sparkles,
  ExternalLink,
  Plus,
  Heart,
  MessageSquare,
  Users
} from 'lucide-react';
import AdminGifts from './AdminGifts';
import AdminReservations from './AdminReservations';
import AdminGiftModal from './AdminGiftModal';
import AdminQRCodeModal from './AdminQRCodeModal';
import ConfirmModal from './ConfirmModal';

export default function AdminDashboard({
  gifts,
  reservations,
  onLogout,
  onViewPublic,
  onCreateGift,
  onUpdateGift,
  onDeleteGift,
  onCancelReservation,
  onReleaseGift,
  onMarkReceived,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'gifts', 'reservations'
  
  // Modals state
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null); // null for create, object for edit
  const [qrModalOpen, setQrModalOpen] = useState(false);
  
  // Confirm modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    isDanger: false,
    action: null,
  });

  // Calculate metrics
  const totalGifts = gifts.length;
  const availableGifts = gifts.filter((g) => g.status === 'available').length;
  const reservedGifts = gifts.filter((g) => g.status === 'reserved').length;
  const receivedGifts = gifts.filter((g) => g.status === 'received').length;
  const confirmedReservations = reservations.filter((r) => r.status !== 'cancelled').length;

  // Actions with confirmation
  const handleRequestDeleteGift = (gift) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Excluir Presente',
      message: `Tem certeza de que deseja excluir "${gift.name}" da lista? Esta ação não poderá ser desfeita.`,
      confirmText: 'Sim, Excluir',
      isDanger: true,
      action: async () => {
        await onDeleteGift(gift.id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestCancelReservation = (reservation) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Cancelar Reserva',
      message: `Deseja realmente cancelar a reserva feita por "${reservation.guest_name}"? O presente voltará a ficar disponível para outros convidados.`,
      confirmText: 'Sim, Cancelar Reserva',
      isDanger: true,
      action: async () => {
        await onCancelReservation(reservation.id, reservation.gift_id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestReleaseGift = (gift) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Liberar Presente',
      message: `Deseja liberar o presente "${gift.name}" para que fique disponível novamente na lista pública?`,
      confirmText: 'Liberar Presente',
      isDanger: false,
      action: async () => {
        await onReleaseGift(gift.id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECF0E6] text-[#556B2F] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Painel Exclusivo da Noiva
          </div>
          <h1 className="font-serif-wedding text-3xl sm:text-4xl font-bold text-[#263116]">
            Casamento Sayonara &amp; Tiago
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Data: 16 de maio de 2027 • Gerenciamento centralizado de presentes e reservas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-xs"
          >
            <QrCode className="w-4 h-4 text-[#556B2F]" />
            <span>Gerar QR Code</span>
          </button>

          <button
            onClick={onViewPublic}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 shadow-xs"
          >
            <ExternalLink className="w-4 h-4 text-stone-500" />
            <span>Ver Site Público</span>
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Itens</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF9F5] border border-stone-200 flex items-center justify-center text-[#556B2F]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-wedding text-3xl font-bold text-[#263116]">
            {totalGifts}
          </div>
          <span className="text-[11px] text-stone-400">cadastrados na lista</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#556B2F]">Disponíveis</span>
            <div className="w-8 h-8 rounded-lg bg-[#ECF0E6] flex items-center justify-center text-[#556B2F]">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-wedding text-3xl font-bold text-[#556B2F]">
            {availableGifts}
          </div>
          <span className="text-[11px] text-stone-400">aguardando padrinhos</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Reservados</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-wedding text-3xl font-bold text-[#2E3B1B]">
            {reservedGifts}
          </div>
          <span className="text-[11px] text-stone-400">com reserva confirmada</span>
        </div>

        <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Recebidos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-wedding text-3xl font-bold text-emerald-700">
            {receivedGifts}
          </div>
          <span className="text-[11px] text-stone-400">já entregues aos noivos</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-[#CBD5E1] mb-8">
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#556B2F] text-[#556B2F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'gifts'
                ? 'border-[#556B2F] text-[#556B2F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Gerenciar Presentes ({totalGifts})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'reservations'
                ? 'border-[#556B2F] text-[#556B2F]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Reservas dos Convidados ({confirmedReservations})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Quick Action row */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif-wedding text-2xl font-bold text-[#263116]">
              Últimas Reservas Realizadas
            </h3>
            <button
              onClick={() => {
                setSelectedGift(null);
                setGiftModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold btn-olive shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Presente</span>
            </button>
          </div>

          {/* Latest reservations snippet */}
          {reservations.length > 0 ? (
            <div className="bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs">
              <div className="divide-y divide-stone-100">
                {reservations.slice(0, 5).map((res) => (
                  <div key={res.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800 text-sm">
                          {res.guest_name}
                        </span>
                        {res.guest_whatsapp && (
                          <span className="text-xs text-stone-500">
                            ({res.guest_whatsapp})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-[#556B2F] fill-[#556B2F]" />
                        <span>{res.gifts?.name || 'Presente'}</span>
                      </div>
                      {res.guest_message && (
                        <p className="text-xs text-stone-500 italic">
                          "{res.guest_message}"
                        </p>
                      )}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[11px] text-stone-400 block">
                        {new Date(res.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <button
                        onClick={() => setActiveTab('reservations')}
                        className="text-xs font-semibold text-[#556B2F] hover:underline"
                      >
                        Ver detalhes &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#CBD5E1] rounded-2xl p-8 text-center">
              <Heart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-stone-500">
                Ainda não há reservas registradas. Compartilhe o link do casamento com os convidados!
              </p>
            </div>
          )}

          {/* Tips for the bride */}
          <div className="bg-[#FAF9F5] border border-[#CBD5E1] rounded-2xl p-6">
            <h4 className="font-serif-wedding text-lg font-bold text-[#263116] mb-2">
              Dica para Sayonara:
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Você pode clicar no botão <strong>"Gerar QR Code"</strong> no topo para baixar a imagem em alta resolução e imprimir nos cartõezinhos dos convites de casamento ou enviar via WhatsApp. Os convidados escanearão o código e cairão direto na lista oficial!
            </p>
          </div>

        </div>
      )}

      {/* Tab 2: Gifts Management */}
      {activeTab === 'gifts' && (
        <AdminGifts
          gifts={gifts}
          onOpenCreate={() => {
            setSelectedGift(null);
            setGiftModalOpen(true);
          }}
          onOpenEdit={(gift) => {
            setSelectedGift(gift);
            setGiftModalOpen(true);
          }}
          onDeleteGift={handleRequestDeleteGift}
          onMarkReceived={onMarkReceived}
          onReleaseGift={handleRequestReleaseGift}
        />
      )}

      {/* Tab 3: Reservations */}
      {activeTab === 'reservations' && (
        <AdminReservations
          reservations={reservations}
          onCancelReservation={handleRequestCancelReservation}
          onMarkReceived={onMarkReceived}
        />
      )}

      {/* Modal: Create / Edit Gift */}
      <AdminGiftModal
        isOpen={giftModalOpen}
        gift={selectedGift}
        onClose={() => setGiftModalOpen(false)}
        onSave={async (giftData) => {
          if (selectedGift) {
            await onUpdateGift(selectedGift.id, giftData);
          } else {
            await onCreateGift(giftData);
          }
        }}
      />

      {/* Modal: QR Code */}
      <AdminQRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />

      {/* Modal: Confirmation */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDanger={confirmConfig.isDanger}
        onConfirm={confirmConfig.action}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
