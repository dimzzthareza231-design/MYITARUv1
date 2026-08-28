import React, { useState, useEffect } from 'react';
import { LabOrder } from './types';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, FileText, 
  Sparkles, History, UserCheck, Stethoscope, RefreshCw,
  QrCode, Edit3, ArrowRight, Printer, AlertOctagon
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface ValidasiSpPKTabProps {
  orders: LabOrder[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrders: (updated: LabOrder[]) => void;
  onOpenPrintModal: (order: LabOrder) => void;
}

export function ValidasiSpPKTab({
  orders,
  selectedOrderId,
  onSelectOrder,
  onUpdateOrders,
  onOpenPrintModal
}: ValidasiSpPKTabProps) {
  const toast = useToast();

  const validationQueue = orders.filter(o => o.status === 'Menunggu Validasi' || o.status === 'Selesai & Tervalidasi');
  const activeOrder = orders.find(o => o.id === selectedOrderId) || validationQueue[0] || null;

  // Sp.PK Review State
  const [spPkName, setSpPkName] = useState('dr. Hendra Gunawan, Sp.PK');
  const [interpretasi, setInterpretasi] = useState('');
  const [saranKlinis, setSaranKlinis] = useState('');
  const [isDigitalSigning, setIsDigitalSigning] = useState(false);

  // Sync state when order changes
  useEffect(() => {
    if (!activeOrder) return;

    if (activeOrder.interpretasi_sp_pk) {
      setInterpretasi(activeOrder.interpretasi_sp_pk);
      setSaranKlinis(activeOrder.saran_klinis || '');
      setSpPkName(activeOrder.dokter_sp_pk || 'dr. Hendra Gunawan, Sp.PK');
    } else if (activeOrder.ai_pathology_analysis) {
      setInterpretasi(typeof activeOrder.ai_pathology_analysis === 'string' ? activeOrder.ai_pathology_analysis : activeOrder.ai_pathology_analysis.clinical_summary || '');
      setSaranKlinis('Korelasikan dengan respon klinis pasien dan pertimbangkan evaluasi serial.');
    } else if (activeOrder.catatan_analis) {
      setInterpretasi(activeOrder.catatan_analis);
      setSaranKlinis('Korelasikan dengan respon klinis pasien.');
    } else {
      setInterpretasi('Hasil pemeriksaan laboratorium dalam batas normal atau sesuai catatan klinis terlampir.');
      setSaranKlinis('Tidak ada tindakan khusus yang mendesak.');
    }
  }, [activeOrder?.id]);

  if (!activeOrder) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-200">
          Tidak Ada Antrian Validasi Dokter Sp.PK
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Semua hasil laboratorium telah tervalidasi atau belum ada hasil yang dikirim analis.
        </p>
      </div>
    );
  }

  const isAlreadyValidated = activeOrder.status === 'Selesai & Tervalidasi';
  const hasCritical = activeOrder.parameter_results.some(p => p.is_critical);

  // PRE-BUILT TEMPLATES
  const applyTemplate = (type: string) => {
    if (type === 'anemia') {
      setInterpretasi('Gambaran Anemia Mikrositik Hipokrom dengan Trombositopenia. Sangat menyokong suspek Anemia Defisiensi Besi dd/ Anemia Penyakit Kronis dan proses infeksi sekunder.');
      setSaranKlinis('Saran pemeriksaan Morfologi Darah Tepi (MDT), Serum Iron, TIBC, dan Ferritin.');
    } else if (type === 'dengue') {
      setInterpretasi('Trombositopenia progresif disertai Leukopenia dan peningkatan Hematokrit (Hemokonsentrasi > 20%). Sangat sesuai dengan Infeksi Dengue Fase Kritis (DHF Grade II).');
      setSaranKlinis('Monitor ketat tanda vital, fluid balance, dan evaluasi ulang DL serial per 6 jam.');
    } else if (type === 'dm') {
      setInterpretasi('Hiperglikemia tidak terkontrol dengan gangguan fungsi ginjal stadium awal (Peningkatan Serum Kreatinin & Ureum).');
      setSaranKlinis('Pemeriksaan HbA1c, Profil Lipid lengkap, dan Mikroalbuminuria urin.');
    } else if (type === 'cardiac') {
      setInterpretasi('Peningkatan bermakna enzim penanda nekrosis miokard (Troponin I / CK-MB Positif Kuat). Sesuai dengan Sindrom Koroner Akut (NSTEMI / STEMI).');
      setSaranKlinis('Konsul cito Sp.JP, rekaman EKG 12-lead serial, dan tata laksana ACS sesuai protokol.');
    }
    toast.success('Template ekspertise berhasil diterapkan!');
  };

  // HANDLE FINAL VALIDATION
  const handleValidateAndSign = () => {
    setIsDigitalSigning(true);
    toast.info('Menghubungi Certificate Authority (BSrE BSSN) untuk penerbitan Digital Signature...');

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      const qrCode = `MYITARU-BSRE-LAB-${activeOrder.id}-${Math.floor(100000 + Math.random() * 900000)}`;

      const updated = orders.map(o => {
        if (o.id === activeOrder.id) {
          return {
            ...o,
            status: 'Selesai & Tervalidasi' as const,
            dokter_sp_pk: spPkName,
            interpretasi_sp_pk: interpretasi,
            saran_klinis: saranKlinis,
            waktu_validasi: timeStr,
            qr_verifikasi_code: qrCode
          };
        }
        return o;
      });

      onUpdateOrders(updated);
      setIsDigitalSigning(false);
      toast.success(`Hasil Laboratorium ${activeOrder.id} resmi Tervalidasi & Ditandatangani Elektronik!`);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left">
      {/* BANNER HEADER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Validasi & Digital Signature Dokter Spesialis Patologi Klinik (Sp.PK)
              </h3>
              {isAlreadyValidated && (
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-bold">
                  ✓ FINAL TERVALIDASI
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Telaah hasil, korelasi klinis delta check, dan otorisasi lembar hasil resmi untuk rekam medis & pasien.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Antrian Validasi:</label>
          <select
            value={activeOrder.id}
            onChange={e => onSelectOrder(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-100 outline-none w-full md:w-64"
          >
            {validationQueue.map(o => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.nama_pasien} ({o.status === 'Selesai & Tervalidasi' ? 'Tervalidasi' : 'Menunggu Validasi'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PATIENT & LAB METADATA */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">No. Rekam Medis</span>
            <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
              {activeOrder.no_rm}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">Order: {activeOrder.id}</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Nama Pasien</span>
            <span className="font-bold text-slate-900 dark:text-white block truncate">
              {activeOrder.nama_pasien}
            </span>
            <span className="text-slate-500 text-[11px]">
              {activeOrder.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {activeOrder.umur}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Ruangan & Dokter DPJP</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {activeOrder.ruangan_asal}
            </span>
            <span className="text-slate-500 text-[11px] block truncate">
              {activeOrder.dokter_pengirim}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Diagnosa Klinis Pengirim</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate" title={activeOrder.diagnosa_klinis}>
              {activeOrder.diagnosa_klinis}
            </span>
            <span className="text-cyan-600 font-bold text-[10px]">{activeOrder.prioritas}</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Analis Pelaksana</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {activeOrder.petugas_analis || 'Analis Lab'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {activeOrder.alat_analyzer || 'LIS Direct'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Waktu Selesai Analisis</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
              {activeOrder.waktu_selesai_analisis || 'Hari ini'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">Siap Disahkan</span>
          </div>
        </div>
      </div>

      {/* DELTA CHECK & CRITICAL BANNER */}
      {hasCritical && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border-l-4 border-rose-600 rounded-xl flex items-center gap-3 text-rose-900 dark:text-rose-200 text-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-extrabold block">Terdapat Parameter Kritis (Panic Value)</span>
            <span>Pastikan pelaporan SBAR ke ruangan telah terkonfirmasi sebelum mengesahkan hasil resmi.</span>
          </div>
        </div>
      )}

      {/* MAIN REVIEW & VALIDATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT 7 COLS: PARAMETERS REVIEW TABLE */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Hasil Pengujian Laboratorium
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">
              Total {activeOrder.parameter_results.length} Parameter
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold">
                <tr>
                  <th className="p-3">Pemeriksaan</th>
                  <th className="p-3 text-center">Nilai Hasil</th>
                  <th className="p-3 text-center">Flag</th>
                  <th className="p-3">Satuan</th>
                  <th className="p-3">Nilai Rujukan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {activeOrder.parameter_results.map((p) => {
                  const isHigh = p.flag === 'H' || p.flag === 'HH';
                  const isLow = p.flag === 'L' || p.flag === 'LL';
                  const isPos = p.flag === 'P';

                  return (
                    <tr
                      key={p.id}
                      className={p.is_critical ? 'bg-rose-50/70 dark:bg-rose-950/30 font-semibold' : ''}
                    >
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {p.parameter_name}
                      </td>
                      <td className={`p-3 text-center font-mono font-extrabold ${
                        p.is_critical ? 'text-rose-600 text-sm' :
                        isHigh ? 'text-amber-600' :
                        isLow ? 'text-blue-600' :
                        isPos ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'
                      }`}>
                        {p.hasil}
                      </td>
                      <td className="p-3 text-center">
                        {p.flag && p.flag !== 'N' && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            p.is_critical ? 'bg-rose-600 text-white' :
                            isHigh ? 'bg-amber-200 text-amber-900' :
                            isLow ? 'bg-blue-200 text-blue-900' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {p.flag}
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{p.satuan}</td>
                      <td className="p-3 font-mono text-slate-500 text-[11px]">{p.nilai_rujukan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {activeOrder.catatan_analis && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan Analis:</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium italic mt-0.5">
                "{activeOrder.catatan_analis}"
              </p>
            </div>
          )}
        </div>

        {/* RIGHT 5 COLS: INTERPRETASI, TEMPLATES, DIGITAL SIGNATURE */}
        <div className="lg:col-span-5 space-y-4">
          {/* QUICK TEMPLATES */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
              Template Kesan Klinis Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyTemplate('anemia')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Suspek Anemia
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('dengue')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Infeksi Dengue (DHF)
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('dm')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Diabetes & Ginjal
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('cardiac')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Cardiac / ACS
              </button>
            </div>
          </div>

          {/* INTERPRETASI INPUT */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div>
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Kesan / Interpretasi Patologi Klinik (Sp.PK)
              </label>
              <textarea
                rows={4}
                value={interpretasi}
                onChange={e => setInterpretasi(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Saran Tindak Lanjut Klinis
              </label>
              <textarea
                rows={2}
                value={saranKlinis}
                onChange={e => setSaranKlinis(e.target.value)}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-1">
                Dokter Penanggung Jawab Lab
              </label>
              <input
                type="text"
                value={spPkName}
                onChange={e => setSpPkName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
              />
            </div>
          </div>

          {/* ACTION BUTTONS & SIGNATURE */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <button
              onClick={handleValidateAndSign}
              disabled={isDigitalSigning}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <ShieldCheck className={`w-4 h-4 ${isDigitalSigning ? 'animate-spin' : ''}`} />
              <span>{isDigitalSigning ? 'Menerbitkan Digital Signature...' : 'Sahkan & Terbitkan Tanda Tangan Digital'}</span>
            </button>

            {isAlreadyValidated && (
              <button
                onClick={() => onOpenPrintModal(activeOrder)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" /> Lihat Lembar Hasil Cetak Resmi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
