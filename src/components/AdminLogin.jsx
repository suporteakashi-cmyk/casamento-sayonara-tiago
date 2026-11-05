import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { adminSignIn, isSupabaseConfigured } from '../lib/supabase';

export default function AdminLogin({ onLoginSuccess, onBackToPublic }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isSupabaseConfigured) {
      setErrorMsg(
        'A chave VITE_SUPABASE_ANON_KEY não foi configurada no arquivo .env. Por favor, adicione sua chave anon para autenticar no Supabase.'
      );
      return;
    }

    try {
      setLoading(true);
      const data = await adminSignIn(email.trim(), password);
      if (data?.session) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message?.includes('Invalid login credentials') || err.status === 400) {
        setErrorMsg('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else {
        setErrorMsg('Erro ao autenticar. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#CBD5E1] shadow-xl p-8 sm:p-10 animate-fade-in relative">
        
        {/* Back button */}
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao site do casamento</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#ECF0E6] border border-[#D7DFCC] flex items-center justify-center text-[#556B2F] mx-auto mb-4 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif-wedding text-3xl font-bold text-[#263116]">
            Área dos Noivos
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Painel administrativo exclusivo para Sayonara gerenciar presentes e reservas.
          </p>
        </div>

        {/* Warning if Supabase env missing */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="block font-semibold">Configuração Pendente:</strong>
              Copie o arquivo <code className="bg-amber-100 px-1 py-0.5 rounded">.env.example</code> para <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> e insira sua chave anon do Supabase.
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="sayonaradossantossilvasantos8@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold btn-olive flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-200/80 text-center">
          <p className="text-[11px] text-stone-400">
            Acesso protegido via Supabase Auth com criptografia ponta a ponta.
          </p>
        </div>

      </div>
    </div>
  );
}
