import React, { useRef, useState } from 'react';
import { RegistrationFormState } from './types';
import toast from 'react-hot-toast';
import { X, RefreshCcw } from 'lucide-react';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function PersetujuanTab({ data, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.ttdData?.signature);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling when touching the canvas on mobile
    if (e.type.includes('touch')) {
        e.preventDefault();
    }
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Prevent scrolling
    if (e.type.includes('touch')) {
        e.preventDefault();
    }
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveSignature();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    
    onChange('ttdData', { ...data.ttdData, signature: '' });
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange('ttdData', { ...data.ttdData, signature: dataUrl, tanggalWaktu: new Date().toISOString() });
  };

  // Setup canvas on initial render
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw existing signature if available
        if (data.ttdData?.signature && !isDrawing) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = data.ttdData.signature;
        }
      }
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-lg text-slate-800 mb-4">Persetujuan & Deklarasi</h3>
        <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={data.setujuUmum} onChange={e => onChange('setujuUmum', e.target.checked)} className="mt-1 w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700">Saya telah membaca dan menyetujui <a href="#" className="text-blue-600 hover:underline">Persetujuan Umum (General Consent)</a> untuk menerima pelayanan kesehatan di klinik ini.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={data.setujuPdp} onChange={e => onChange('setujuPdp', e.target.checked)} className="mt-1 w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700">Saya menyetujui pengolahan data pribadi dan medis saya sesuai dengan UU Pelindungan Data Pribadi (UU PDP).</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={data.setujuHakKewajiban} onChange={e => onChange('setujuHakKewajiban', e.target.checked)} className="mt-1 w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700">Saya telah menerima dan memahami informasi mengenai <a href="#" className="text-blue-600 hover:underline">Hak dan Kewajiban Pasien</a>.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={data.pernyataanBenar} onChange={e => onChange('pernyataanBenar', e.target.checked)} className="mt-1 w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">Saya menyatakan bahwa semua data yang saya berikan adalah BENAR dan dapat dipertanggungjawabkan.</span>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Tanda Tangan Elektronik</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nama Penandatangan <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={data.ttdData?.nama || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, nama: e.target.value })} 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Hubungan dengan Pasien <span className="text-red-500">*</span></label>
            <select 
              value={data.ttdData?.hubungan || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, hubungan: e.target.value })} 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            >
              <option value="">- Pilih -</option>
              <option value="Pasien Sendiri">Pasien Sendiri</option>
              <option value="Suami">Suami</option>
              <option value="Istri">Istri</option>
              <option value="Ayah">Ayah</option>
              <option value="Ibu">Ibu</option>
              <option value="Anak">Anak</option>
              <option value="Wali">Wali / Keluarga Lainnya</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">NIK Penandatangan <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              maxLength={16}
              value={data.ttdData?.nik || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, nik: e.target.value })} 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
            />
          </div>
        </div>

        <div className="mb-2 flex justify-between items-end">
          <label className="block text-sm font-bold text-slate-700">Tanda Tangan <span className="text-red-500">*</span></label>
          <button type="button" onClick={clearSignature} className="text-xs text-red-600 hover:underline flex items-center gap-1">
            <RefreshCcw className="w-3 h-3" /> Ulangi Tanda Tangan
          </button>
        </div>
        
        <div className="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-50 relative h-48 w-full max-w-md mx-auto touch-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={192}
            className="w-full h-full bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400">
              Tanda tangan di area ini
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
