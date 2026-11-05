import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import GiftList from './components/GiftList';
import ReservationModal from './components/ReservationModal';
import SuccessModal from './components/SuccessModal';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import Toast from './components/Toast';

import {
  isSupabaseConfigured,
  supabase,
  getGifts,
  reserveGift,
  getAdminSession,
  adminSignOut,
  createGift,
  updateGift,
  deleteGift,
  getReservations,
  cancelReservation,
  releaseGift,
  markGiftReceived,
} from './lib/supabase';
import { initialGifts } from './lib/sampleGifts';

export default function App() {
  const [currentView, setCurrentView] = useState('public'); // 'public', 'login', 'admin'
  const [adminSession, setAdminSession] = useState(null);
  
  // Gifts & Reservations data
  const [gifts, setGifts] = useState(initialGifts);
  const [reservations, setReservations] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);

  // Modals state
  const [reservationModalGift, setReservationModalGift] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check auth session
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoadingGifts(false);
      return;
    }

    getAdminSession().then((session) => {
      setAdminSession(session);
    });

    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setAdminSession(session);
          if (session && currentView === 'login') {
            setCurrentView('admin');
          }
        }
      );

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, [currentView]);

  // Load gifts from Supabase or fallback
  const loadGifts = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoadingGifts(false);
      return;
    }

    try {
      setLoadingGifts(true);
      const data = await getGifts();
      if (data && data.length > 0) {
        setGifts(data);
      } else {
        // Fallback to sample gifts if database is fresh and empty
        setGifts(initialGifts);
      }
    } catch (err) {
      console.warn('Using local gifts list (Supabase offline or table uninitialized):', err);
      setGifts(initialGifts);
    } finally {
      setLoadingGifts(false);
    }
  }, []);

  // Load reservations for admin
  const loadReservations = useCallback(async () => {
    if (!isSupabaseConfigured || !adminSession) return;
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error loading reservations:', err);
    }
  }, [adminSession]);

  useEffect(() => {
    loadGifts();
  }, [loadGifts]);

  useEffect(() => {
    if (adminSession) {
      loadReservations();
    }
  }, [adminSession, loadReservations]);

  // Handle guest reservation submission
  const handleConfirmReservation = async ({ giftId, guestName, guestWhatsapp, guestMessage }) => {
    if (isSupabaseConfigured) {
      // Real Supabase atomic RPC execution
      const result = await reserveGift({
        giftId,
        guestName,
        guestWhatsapp,
        guestMessage,
      });

      // Update local state to reflect reservation
      setGifts((prev) =>
        prev.map((g) => (g.id === giftId ? { ...g, status: 'reserved' } : g))
      );

      setReservationModalGift(null);
      setSuccessModalData({
        gift: reservationModalGift,
        guestName,
      });
      return result;
    } else {
      // Local fallback mode when .env is not yet configured
      setGifts((prev) =>
        prev.map((g) => (g.id === giftId ? { ...g, status: 'reserved' } : g))
      );
      setReservationModalGift(null);
      setSuccessModalData({
        gift: reservationModalGift,
        guestName,
      });
      showToast('Reserva confirmada em modo demonstração local.', 'info');
    }
  };

  // Admin Logout
  const handleAdminLogout = async () => {
    try {
      await adminSignOut();
      setAdminSession(null);
      setCurrentView('public');
      showToast('Sessão encerrada com sucesso.');
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Actions
  const handleCreateGift = async (giftData) => {
    if (isSupabaseConfigured) {
      const created = await createGift(giftData);
      setGifts((prev) => [created, ...prev]);
      showToast('Presente cadastrado com sucesso!');
    } else {
      const newLocal = {
        ...giftData,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      setGifts((prev) => [newLocal, ...prev]);
      showToast('Presente cadastrado localmente!', 'info');
    }
  };

  const handleUpdateGift = async (giftId, giftData) => {
    if (isSupabaseConfigured) {
      const updated = await updateGift(giftId, giftData);
      setGifts((prev) => prev.map((g) => (g.id === giftId ? updated : g)));
      showToast('Presente atualizado com sucesso!');
    } else {
      setGifts((prev) =>
        prev.map((g) => (g.id === giftId ? { ...g, ...giftData } : g))
      );
      showToast('Presente atualizado localmente!', 'info');
    }
  };

  const handleDeleteGift = async (giftId) => {
    if (isSupabaseConfigured) {
      await deleteGift(giftId);
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
      showToast('Presente excluído com sucesso.');
    } else {
      setGifts((prev) => prev.filter((g) => g.id !== giftId));
      showToast('Presente removido localmente.', 'info');
    }
  };

  const handleCancelReservation = async (reservationId, giftId) => {
    if (isSupabaseConfigured) {
      await cancelReservation(reservationId, giftId);
      await loadReservations();
      await loadGifts();
      showToast('Reserva cancelada e presente liberado!');
    } else {
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
      );
      setGifts((prev) =>
        prev.map((g) => (g.id === giftId ? { ...g, status: 'available' } : g))
      );
      showToast('Reserva cancelada localmente.', 'info');
    }
  };

  const handleReleaseGift = async (giftId) => {
    if (isSupabaseConfigured) {
      await releaseGift(giftId);
      await loadGifts();
      await loadReservations();
      showToast('Presente liberado para a lista pública!');
    } else {
      setGifts((prev) =>
        prev.map((g) => (g.id === giftId ? { ...g, status: 'available' } : g))
      );
      showToast('Presente liberado localmente.', 'info');
    }
  };

  const handleMarkReceived = async (gift) => {
    if (!gift) return;
    if (isSupabaseConfigured) {
      await markGiftReceived(gift.id);
      await loadGifts();
      await loadReservations();
      showToast('Presente marcado como recebido!');
    } else {
      setGifts((prev) =>
        prev.map((g) => (g.id === gift.id ? { ...g, status: 'received' } : g))
      );
      showToast('Marcado como recebido localmente.', 'info');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-botanical-subtle selection:bg-[#556B2F] selection:text-white">
      
      {/* Navigation Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdmin={Boolean(adminSession)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'public' && (
          <>
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('presentes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <HowItWorks />
            <GiftList
              gifts={gifts}
              loading={loadingGifts}
              onReserveGift={(gift) => setReservationModalGift(gift)}
            />
          </>
        )}

        {currentView === 'login' && (
          <AdminLogin
            onLoginSuccess={() => setCurrentView('admin')}
            onBackToPublic={() => setCurrentView('public')}
          />
        )}

        {currentView === 'admin' && (
          adminSession ? (
            <AdminDashboard
              gifts={gifts}
              reservations={reservations}
              onLogout={handleAdminLogout}
              onViewPublic={() => setCurrentView('public')}
              onCreateGift={handleCreateGift}
              onUpdateGift={handleUpdateGift}
              onDeleteGift={handleDeleteGift}
              onCancelReservation={handleCancelReservation}
              onReleaseGift={handleReleaseGift}
              onMarkReceived={handleMarkReceived}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={() => setCurrentView('admin')}
              onBackToPublic={() => setCurrentView('public')}
            />
          )
        )}
      </main>

      {/* Footer */}
      <Footer onAdminClick={() => setCurrentView(adminSession ? 'admin' : 'login')} />

      {/* Modal: Guest Reservation Form */}
      {reservationModalGift && (
        <ReservationModal
          gift={reservationModalGift}
          onClose={() => setReservationModalGift(null)}
          onConfirmReservation={handleConfirmReservation}
        />
      )}

      {/* Modal: Reservation Success Celebratory Dialog */}
      {successModalData && (
        <SuccessModal
          gift={successModalData.gift}
          guestName={successModalData.guestName}
          onClose={() => setSuccessModalData(null)}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
