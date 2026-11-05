import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode as QrIcon, Download, Printer, Copy, Check, ExternalLink } from 'lucide-react';

export default function AdminQRCodeModal({ isOpen, onClose }) {
  const [publicUrl, setPublicUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Current public site URL
    const url = window.location.origin;
    setPublicUrl(url);
    generateQR(url);
  }, [isOpen]);

  const generateQR = async (url) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 600,
        margin: 2,
        color: {
          dark: '#263116', // Olive dark
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('QR code generation error:', err);
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setPublicUrl(val);
    generateQR(val);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode-casamento-sayonara-tiago.png';
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code — Casamento Sayonara & Tiago</title>
          <style>
            body { font-family: 'Georgia', serif; text-align: center; padding: 40px; color: #263116; }
            h1 { font-size: 28px; margin-bottom: 6px; }
            p { font-size: 14px; color: #556B2F; margin-top: 0; }
            img { width: 300px; height: 300px; margin: 24px auto; display: block; }
            .hint { font-size: 12px; color: #666; margin-top: 16px; }
          </style>
        </head>
        <body>
          <h1>Sayonara & Tiago</h1>
          <p>16 de Maio de 2027 • Lista de Presentes</p>
          <img src="${qrDataUrl}" alt="QR Code Casamento" />
          <div class="hint">Aponte a câmera do celular para abrir a lista de presentes</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 sm:p-8 text-center animate-fade-in my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#ECF0E6] text-[#556B2F] border border-[#D7DFCC] flex items-center justify-center mx-auto mb-4 shadow-xs">
          <QrIcon className="w-7 h-7" />
        </div>

        <h3 className="font-serif-wedding text-2xl font-bold text-[#263116] mb-1">
          QR Code do Casamento
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Utilize nos convites impressos ou digitais para direcionar os convidados diretamente à lista.
        </p>

        {/* QR Code Preview Box */}
        <div className="bg-[#FAF9F5] border-2 border-dashed border-[#CBD5E1] rounded-2xl p-6 mb-5 inline-block">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code Lista de Presentes"
              className="w-48 h-48 mx-auto rounded-lg shadow-xs"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-stone-400 text-xs">
              Gerando QR Code...
            </div>
          )}
        </div>

        {/* URL input */}
        <div className="mb-6 text-left">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            Endereço (URL) de Destino
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={publicUrl}
              onChange={handleUrlChange}
              className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-mono focus:outline-none focus:border-[#556B2F]"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600"
              title="Copiar link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Ao publicar na Vercel, altere acima para o domínio final caso deseje gerar um novo QR Code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold btn-olive flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>
        </div>

      </div>
    </div>
  );
}
