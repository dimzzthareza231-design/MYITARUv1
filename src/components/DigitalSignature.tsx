import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useRef, useState, useEffect } from 'react';

interface DigitalSignatureProps {
  onSave: (data: { signature_image: string; certificate: any }) => void;
  onClose: () => void;
  title?: string;
}

function DigitalSignature({ onSave, onClose, title = 'Tanda Tangan Digital' }: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [pin, setPin] = useState('');
  const [certInfo, setCertInfo] = useState<any>(null);
  const [signerName, setSignerName] = useState('');
  const [signerNIK, setSignerNIK] = useState('');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Background putih
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);
  
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY
    };
  };
  
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };
  
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setCertInfo(null);
  };
  
  const handleVerify = () => {
    if (!signerName || !signerNIK) {
      toast.error('Nama dan NIK penandatangan wajib diisi');
      return;
    }
    if (pin.length !== 6) {
      toast.error('PIN harus 6 digit');
      return;
    }
    
    // Generate certificate info (simulasi)
    const timestamp = new Date().toISOString();
    const hash = btoa(`${signerNIK}-${timestamp}-${pin}`).substring(0, 32);
    
    if (canvasRef.current) {
        setCertInfo({
            signer_name: signerName,
            signer_nik: signerNIK,
            timestamp: timestamp,
            hash: hash,
            certificate_id: `CERT-${Date.now()}`,
            valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            signature_data: canvasRef.current.toDataURL()
        });
        
        toast.success('Tanda tangan berhasil diverifikasi dan disertifikasi');
    }
  };
  
  const handleSave = () => {
    if (!hasSignature) {
      toast.error('Silakan buat tanda tangan terlebih dahulu');
      return;
    }
    if (!certInfo) {
      toast.error('Silakan verifikasi PIN terlebih dahulu');
      return;
    }
    
    if (canvasRef.current) {
        onSave({
        signature_image: canvasRef.current.toDataURL(),
        certificate: certInfo
        });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-blue-600 text-white p-5 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">✍️ {title}</h2>
            <p className="text-sm text-blue-100 font-medium">Tanda Tangan Elektronik Tersertifikasi</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-blue-700 p-1.5 rounded-lg transition"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Info Penandatangan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Nama Penandatangan *</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama sesuai KTP"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">NIK *</label>
              <input
                type="text"
                value={signerNIK}
                onChange={(e) => setSignerNIK(e.target.value)}
                maxLength={16}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="16 digit NIK"
              />
            </div>
          </div>
          
          {/* Canvas Tanda Tangan */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Tanda Tangan *</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex gap-3 mt-3 items-center">
              <button
                onClick={clearCanvas}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-bold transition"
              >
                🗑️ Bersihkan
              </button>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {hasSignature ? '✅ Tanda tangan terdeteksi' : '⚠️ Silakan tanda tangan di area putih'}
              </span>
            </div>
          </div>
          
          {/* PIN Verification */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">PIN Verifikasi (6 digit) *</label>
            <div className="flex gap-3">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 6))}
                maxLength={6}
                className="flex-1 p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-center tracking-[0.5em] text-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="●●●●●●"
              />
              <button
                onClick={handleVerify}
                disabled={!hasSignature || pin.length !== 6 || !signerName || !signerNIK}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                🔐 Verifikasi
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
              💡 Default PIN untuk demo: 123456
            </p>
          </div>
          
          {/* Certificate Info */}
          {certInfo && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-4 border-b border-emerald-100 dark:border-emerald-800/30 pb-3">
                <span className="text-2xl">✅</span>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-400">Sertifikat Digital Valid</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">Certificate ID</label>
                  <p className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300">{certInfo.certificate_id}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">Signer</label>
                  <p className="font-bold text-emerald-900 dark:text-emerald-300">{certInfo.signer_name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">NIK</label>
                  <p className="font-bold text-emerald-900 dark:text-emerald-300">{certInfo.signer_nik}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">Timestamp</label>
                  <p className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300">{new Date(certInfo.timestamp).toLocaleString('id-ID')}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">Hash</label>
                  <p className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300 break-all bg-emerald-100/50 dark:bg-emerald-900/30 p-2 rounded">{certInfo.hash}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-wider mb-1 block">Valid Until</label>
                  <p className="font-bold text-emerald-900 dark:text-emerald-300">{new Date(certInfo.valid_until).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 p-5 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/80 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!certInfo}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-sm"
          >
            💾 Simpan Tanda Tangan
          </button>
        </div>
      </div>
    </div>
  );
}

export default DigitalSignature;
