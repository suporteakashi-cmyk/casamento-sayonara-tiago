import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { uploadGiftImage, isSupabaseConfigured } from '../lib/supabase';

export default function AdminGiftModal({
  isOpen,
  gift, // null when creating new
  onClose,
  onSave,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('available');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (gift) {
      setName(gift.name || '');
      setDescription(gift.description || '');
      setModel(gift.model || '');
      setColor(gift.color || '');
      setNotes(gift.notes || '');
      setImageUrl(gift.image_url || '');
      setStatus(gift.status || 'available');
    } else {
      setName('');
      setDescription('');
      setModel('');
      setColor('');
      setNotes('');
      setImageUrl('');
      setStatus('available');
    }
    setErrorMsg('');
  }, [gift, isOpen]);

  if (!isOpen) return null;

  // Handle direct file upload to Supabase Storage
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured) {
      setErrorMsg('Configure sua chave do Supabase no .env para enviar fotos diretamente para a nuvem.');
      return;
    }

    try {
      setUploadingImage(true);
      setErrorMsg('');
      const publicUrl = await uploadGiftImage(file);
      setImageUrl(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMsg('Falha no upload da foto. Verifique se o bucket "gift-images" foi criado ou use uma URL externa.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('O nome do presente é obrigatório.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        description: description.trim(),
        model: model.trim(),
        color: color.trim(),
        notes: notes.trim(),
        image_url: imageUrl.trim(),
        status,
      });
      onClose();
    } catch (err) {
      console.error('Error saving gift:', err);
      setErrorMsg(err.message || 'Erro ao salvar presente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] overflow-hidden animate-fade-in my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#FAF9F5] border-b border-[#D8DEE4] px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif-wedding text-2xl font-bold text-[#263116]">
              {gift ? 'Editar Presente' : 'Novo Presente'}
            </h3>
            <p className="text-xs text-stone-500">
              Preencha os detalhes para orientar os convidados na escolha.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Nome do Presente <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Jogo de Taças de Cristal 12 Peças"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Descrição
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Taças elegantes para brindar as celebrações no nosso novo lar."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F] resize-none"
            />
          </div>

          {/* Modelo & Cor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Modelo Desejado
              </label>
              <input
                type="text"
                placeholder="Ex: Bohemia Crystal ou similar"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Cor Desejada
              </label>
              <input
                type="text"
                placeholder="Ex: Transparente / Lapidado"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Observações Adicionais
            </label>
            <input
              type="text"
              placeholder="Ex: Voltagem 110V; Preferência por cristal ecológico titânio"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm text-stone-800 focus:outline-none focus:border-[#556B2F] focus:ring-1 focus:ring-[#556B2F]"
            />
          </div>

          {/* Foto: Upload direto ou URL externa */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-[#FAF9F5]">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Fotografia do Presente
            </label>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Preview */}
              <div className="w-24 h-24 rounded-xl border border-stone-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-stone-300" />
                )}
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-3 w-full">
                {/* File Upload Button */}
                <div>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-50 cursor-pointer shadow-xs text-stone-700">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#556B2F]" />
                        <span>Enviando foto...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#556B2F]" />
                        <span>Enviar foto do dispositivo</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* OR Direct Image URL */}
                <div>
                  <input
                    type="url"
                    placeholder="Ou cole a URL da imagem (https://...)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-[#556B2F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Status do Presente
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('available')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'available'
                    ? 'bg-[#ECF0E6] text-[#3D4D22] border-[#556B2F]'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Disponível
              </button>
              <button
                type="button"
                onClick={() => setStatus('reserved')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'reserved'
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Reservado
              </button>
              <button
                type="button"
                onClick={() => setStatus('received')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'received'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                Recebido
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-stone-300 text-stone-600 hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold btn-olive shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>{gift ? 'Atualizar Presente' : 'Cadastrar Presente'}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
