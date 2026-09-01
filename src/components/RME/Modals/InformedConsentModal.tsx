import { toast } from "react-hot-toast";
import React, { useState, useRef } from 'react';
// ═══════════════════════════════════════════════════════════
// INFORMED CONSENT MODAL (dipindah dari MedicalRecords)
// ═══════════════════════════════════════════════════════════
export function InformedConsentModal({ onClose, patient }: { onClose: () => void, patient?: any }) {
  const [consent, setConsent] = useState({
    tindakan: [] as string[],
    setuju: false,
    nama: '',
    hubungan: 'Pasien Sendiri',
    ttd: null as string | null
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tindakanList = [
    'Pemeriksaan Fisik', 'Pengambilan Sampel Darah', 'Pengambilan Sampel Urine',
    'Nebulizer', 'Jahit Luka', 'Pemberian Injeksi', 'Pemasangan Infus', 'Tindakan Medis Lainnya'
  ];

  const handleTtd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setConsent((c) => ({ ...c, ttd: canvas.toDataURL() }));
  };

  const handleSave = () => {
    if (!consent.setuju || !consent.nama) {
      toast.error('Persetujuan dan nama wajib diisi');
      return;
    }
    const saved = [];
    saved.push({ ...consent, id: Date.now(), tanggal: new Date().toISOString(), patientId: patient?.id, patientName: patient?.nama });

    toast.success('Informed Consent berhasil disimpan');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
          <h2 className="text-xl font-bold">✍️ Informed Consent - Persetujuan Tindakan Medis</h2>
          <button onClick={onClose} className="text-2xl hover:bg-emerald-700 w-8 h-8 rounded flex items-center justify-center">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">📋 Informasi Penting</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Dengan menandatangani formulir ini, Anda menyatakan telah memahami dan menyetujui tindakan medis yang akan dilakukan oleh tenaga medis.
            </p>
          </div>
          <div>
            <label className="block font-semibold mb-3 text-slate-800 dark:text-slate-200">Pilih Tindakan yang Disetujui:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tindakanList.map((t) => (
                <label key={t} className="flex items-center gap-3 p-3 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 rounded"
                    checked={consent.tindakan.includes(t)}
                    onChange={(e) => {
                      if (e.target.checked) setConsent((c) => ({ ...c, tindakan: [...c.tindakan, t] }));
                      else setConsent((c) => ({ ...c, tindakan: c.tindakan.filter((x) => x !== t) }));
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg cursor-pointer">
            <input type="checkbox" checked={consent.setuju} onChange={(e) => setConsent((c) => ({ ...c, setuju: e.target.checked }))} className="w-5 h-5 mt-0.5 text-amber-600 rounded" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Saya menyatakan telah memahami penjelasan tentang tindakan medis di atas dan <strong>menyetujui</strong> untuk dilakukan tindakan tersebut.
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Nama Penandatangan *</label>
              <input type="text" value={consent.nama} onChange={(e) => setConsent((c) => ({ ...c, nama: e.target.value }))} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg" placeholder="Masukkan nama lengkap" />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Hubungan dengan Pasien</label>
              <select value={consent.hubungan} onChange={(e) => setConsent((c) => ({ ...c, hubungan: e.target.value }))} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg">
                <option>Pasien Sendiri</option>
                <option>Suami/Istri</option>
                <option>Orang Tua</option>
                <option>Anak</option>
                <option>Wali</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Tanda Tangan Digital:</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                className="w-full h-48 cursor-crosshair touch-none"
                onMouseDown={(e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.beginPath();
                  ctx.moveTo(((e.clientX - rect.left) * canvas.width) / rect.width, ((e.clientY - rect.top) * canvas.height) / rect.height);
                }}
                onMouseMove={handleTtd}
                onMouseUp={() => {
                  const canvas = canvasRef.current;
                  const ctx = canvas?.getContext('2d');
                  ctx?.beginPath();
                }}
              />
            </div>
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                setConsent((c) => ({ ...c, ttd: null }));
              }}
              className="mt-3 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              🗑️ Hapus Tanda Tangan
            </button>
          </div>
        </div>
        <div className="border-t dark:border-slate-700 p-6 flex gap-4 sticky bottom-0 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-b-xl">
          <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Batal</button>
          <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm">💾 Simpan Persetujuan</button>
        </div>
      </div>
    </div>
  );
}
