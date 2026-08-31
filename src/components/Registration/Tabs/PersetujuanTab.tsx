import React, { useRef, useState } from 'react';
import { RegistrationFormState } from './types';
import { RefreshCcw } from 'lucide-react';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function PersetujuanTab({ data, onChange }: Props) {
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.ttdData?.signature);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
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
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Persetujuan & Deklarasi Pasien</h3>
        <div className="space-y-3.5 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={data.setujuUmum} onChange={e => onChange('setujuUmum', e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 dark:text-cyan-500 rounded" />
            <span>Saya telah membaca dan menyetujui <a href="#" onClick={e => e.preventDefault()} className="text-blue-600 dark:text-cyan-400 hover:underline">Persetujuan Umum (General Consent)</a> untuk menerima pelayanan kesehatan.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={data.setujuPdp} onChange={e => onChange('setujuPdp', e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 dark:text-cyan-500 rounded" />
            <span>Saya menyetujui pemrosesan data medis saya sesuai dengan UU Pelindungan Data Pribadi (UU PDP No. 27/2022).</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={data.setujuHakKewajiban} onChange={e => onChange('setujuHakKewajiban', e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 dark:text-cyan-500 rounded" />
            <span>Saya memahami informasi mengenai <a href="#" onClick={e => e.preventDefault()} className="text-blue-600 dark:text-cyan-400 hover:underline">Hak dan Kewajiban Pasien</a>.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
            <input type="checkbox" checked={data.pernyataanBenar} onChange={e => onChange('pernyataanBenar', e.target.checked)} className="mt-0.5 w-4 h-4 text-blue-600 dark:text-cyan-500 rounded" />
            <span className="font-bold text-slate-900 dark:text-slate-100">Saya menyatakan bahwa semua data yang saya berikan adalah BENAR dan akurat.</span>
          </label>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-4">Tanda Tangan Digital / TTD Penanggung Jawab</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className={labelClass}>Nama Penandatangan <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={data.ttdData?.nama || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, nama: e.target.value })} 
              className={inputClass} 
              placeholder="Nama lengkap penandatangan..."
            />
          </div>
          <div>
            <label className={labelClass}>Hubungan dengan Pasien <span className="text-red-500">*</span></label>
            <select 
              value={data.ttdData?.hubungan || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, hubungan: e.target.value })} 
              className={inputClass}
            >
              <option value="">- Pilih Hubungan -</option>
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
            <label className={labelClass}>NIK Penandatangan <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              maxLength={16}
              value={data.ttdData?.nik || ''} 
              onChange={e => onChange('ttdData', { ...data.ttdData, nik: e.target.value })} 
              className={inputClass} 
              placeholder="16 digit NIK..."
            />
          </div>
        </div>

        <div className="mb-2 flex justify-between items-end">
          <label className={labelClass}>Goreskan Tanda Tangan <span className="text-red-500">*</span></label>
          <button type="button" onClick={clearSignature} className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold">
            <RefreshCcw className="w-3.5 h-3.5" /> Bersihkan / Ulangi TTD
          </button>
        </div>
        
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-900 relative h-48 w-full max-w-md mx-auto touch-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={192}
            className="w-full h-full cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">
              Goreskan tanda tangan di sini (Mouse / Touch)
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

