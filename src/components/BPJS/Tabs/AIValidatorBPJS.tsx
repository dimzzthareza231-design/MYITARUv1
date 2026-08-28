import React, { useState } from 'react';
import { Bot, CheckCircle, AlertTriangle, XCircle, Search, Play, FileText, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function AIValidatorBPJS({ isEmbedded = false, klaimData = null }: { isEmbedded?: boolean, klaimData?: any }) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Analisis AI selesai');
    }, 2000);
  };

  const content = (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Score Banner */}
      <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
        <div className="w-24 h-24 rounded-full border-8 border-amber-200 flex items-center justify-center bg-white shadow-sm shrink-0">
          <span className="text-3xl font-black text-amber-600">65</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">Risiko Dispute Tinggi</h3>
          <p className="text-amber-700 text-sm">Ditemukan ketidaksesuaian antara diagnosa, prosedur, dan berkas pendukung. Perbaikan diperlukan sebelum disubmit ke BPJS.</p>
        </div>
      </div>

      {/* AI Findings Checklist */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">Detail Pengecekan AI</h3>
        
        <div className="space-y-3">
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-900 text-sm">Kesesuaian Diagnosa & Prosedur</div>
              <div className="text-sm text-red-700 mt-1">Diagnosa utama I21.9 (Acute myocardial infarction) tidak didukung dengan hasil EKG (Prosedur 89.52) di laporan medis.</div>
              <button className="mt-2 text-xs font-bold text-red-800 hover:underline flex items-center gap-1">
                Lihat Laporan Medis <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900 text-sm">Kelengkapan Berkas (Tanda Tangan)</div>
              <div className="text-sm text-amber-700 mt-1">Resume medis belum ditandatangani oleh DPJP.</div>
            </div>
          </div>
          <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-900 text-sm">Validitas SEP & Rujukan</div>
              <div className="text-sm text-emerald-700 mt-1">SEP aktif, rujukan sesuai, dan kepesertaan aktif saat pelayanan diberikan.</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" /> Rekomendasi Tindakan
        </h3>
        <ul className="list-disc list-inside text-sm text-slate-600 space-y-2 ml-1">
          <li>Tambahkan dokumen hasil pembacaan EKG ke dalam lampiran klaim.</li>
          <li>Minta DPJP untuk menandatangani digital resume medis pasien ini.</li>
          <li>Setelah diperbaiki, jalankan ulang validator.</li>
        </ul>
        <div className="pt-4 flex gap-3">
          <button onClick={() => toast.success('Status diupdate')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200">Tandai Belum Lengkap</button>
          <button onClick={handleScan} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
            {isScanning ? 'Menganalisa...' : 'Re-Scan Klaim Ini'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return (
      <div className="p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600" /> AI Claim Validator
          </h1>
          <p className="text-slate-500">Analisis cerdas untuk mencegah pending/dispute klaim INA-CBG</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="max-w-xl mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Klaim untuk Dianalisis</label>
          <div className="flex gap-2">
            <select className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none bg-white">
              <option>KLM-001 (Budi Santoso)</option>
            </select>
            <button onClick={handleScan} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
              Analisis
            </button>
          </div>
        </div>
        
        {content}
      </div>
    </div>
  );
}
