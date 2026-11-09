import React, { useState } from 'react';
import { Heart, Gift, Lock, Menu, X, Sparkles } from 'lucide-react';

export default function Header({ currentView, setCurrentView, isAdmin, onAdminLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navTo = (view, sectionId = null) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/98 border-b border-[#D8DEE4]/70 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Monogram */}
          <button 
            onClick={() => navTo('public')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full border border-[#556B2F]/40 bg-[#F4F6F0] flex items-center justify-center text-[#556B2F] shadow-sm transition-transform group-hover:scale-105">
              <span className="font-serif-wedding text-xl font-bold tracking-tight">S&amp;T</span>
            </div>
            <div>
              <span className="font-serif-wedding text-xl sm:text-2xl font-bold text-[#2E3B1B] block leading-tight tracking-wide">
                Sayonara &amp; Tiago
              </span>
              <span className="text-[11px] uppercase tracking-widest text-stone-500 font-medium">
                16 de Maio de 2027
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navTo('public', 'hero')}
              className={`text-sm font-medium transition-colors hover:text-[#556B2F] ${
                currentView === 'public' ? 'text-[#556B2F]' : 'text-stone-600'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => navTo('public', 'como-funciona')}
              className="text-sm font-medium text-stone-600 hover:text-[#556B2F] transition-colors"
            >
              Como Funciona
            </button>
            <button
              onClick={() => navTo('public', 'presentes')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[#556B2F] text-white hover:bg-[#445625] shadow-sm transition-all hover:shadow"
            >
              <Gift className="w-4 h-4" />
              Lista de Presentes
            </button>

            <div className="h-4 w-px bg-stone-300" />

            {/* Admin toggle */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navTo('admin')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#556B2F] text-[#556B2F] bg-[#F4F6F0] hover:bg-[#E8EDE0] transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Painel da Sayonara
                </button>
                <button
                  onClick={onAdminLogout}
                  className="text-xs text-stone-500 hover:text-rose-600 transition-colors ml-1"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => navTo('login')}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-[#556B2F] transition-colors"
                title="Acesso dos noivos"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Área dos Noivos</span>
              </button>
            )}
          </nav>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => navTo('public', 'presentes')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#556B2F] text-white"
            >
              <Gift className="w-3.5 h-3.5" />
              Presentes
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8DEE4] bg-[#FAF9F5] px-4 pt-4 pb-6 space-y-3 shadow-lg animate-fade-in">
          <button
            onClick={() => navTo('public', 'hero')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Início
          </button>
          <button
            onClick={() => navTo('public', 'como-funciona')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Como Funciona a Escolha
          </button>
          <button
            onClick={() => navTo('public', 'presentes')}
            className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium bg-[#556B2F] text-white"
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Ver Lista de Presentes
            </span>
            <Sparkles className="w-4 h-4 opacity-80" />
          </button>

          <div className="border-t border-stone-200 pt-3">
            {isAdmin ? (
              <div className="space-y-2">
                <button
                  onClick={() => navTo('admin')}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#556B2F] bg-[#F4F6F0]"
                >
                  Painel Administrativo da Sayonara
                </button>
                <button
                  onClick={() => {
                    onAdminLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 px-3 text-xs text-rose-600"
                >
                  Encerrar Sessão
                </button>
              </div>
            ) : (
              <button
                onClick={() => navTo('login')}
                className="w-full text-left py-2 px-3 rounded-lg text-xs text-stone-500 hover:text-stone-800 flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                Acesso Restrito dos Noivos
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
