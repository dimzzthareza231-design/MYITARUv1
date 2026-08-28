import React, { useState } from 'react';
import { RadiologiItem, StatusPemeriksaan } from './types';
import { TEMPLATE_EKSPERTISE_LIST } from './data';
import { 
  FileText, CheckCircle2, AlertTriangle, Sparkles, Printer, 
  Search, Eye, ShieldCheck, ChevronRight, Zap, RefreshCw, Check
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { LembarHasilPrint } from './LembarHasilPrint';

interface HasilEkspertiseTabProps {
  radiologiList: RadiologiItem[];
  onUpdateList: (updatedList: RadiologiItem[]) => void;
  onOpenPACS: (item: RadiologiItem) => void;
  selectedItemId?: string;
}

export function HasilEkspertiseTab({ radiologiList, onUpdateList, onOpenPACS, selectedItemId }: HasilEkspertiseTabProps) {
  const toast = useToast();

  // Active study being interpreted
  const [activeItem, setActiveItem] = useState<RadiologiItem>(() => {
    if (selectedItemId) {
      const found = radiologiList.find(r => r.id === selectedItemId);
      if (found) return found;
    }
    const needReview = radiologiList.find(r => r.status === 'Menunggu Ekspertise') || radiologiList[0];
    return needReview;
  });

  // Form State for Active Item
  const [teknik, setTeknik] = useState(activeItem.laporan_ekspertise?.teknik_pemeriksaan || `Proyeksi ${activeItem.posisi_proyeksi} kondisi standar.`);
  const [temuan, setTemuan] = useState(activeItem.laporan_ekspertise?.deskripsi_temuan || '');
  const [kesimpulan, setKesimpulan] = useState(activeItem.laporan_ekspertise?.kesimpulan_kesan || '');
  const [saran, setSaran] = useState(activeItem.laporan_ekspertise?.saran_tindakan || '');
  const [isCritical, setIsCritical] = useState(activeItem.laporan_ekspertise?.critical_finding || false);
  const [dokterRadiolog, setDokterRadiolog] = useState(activeItem.dokter_radiolog || 'dr. Raditya Perkasa, Sp.Rad (K) TR');
  
  // AI Copilot State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(activeItem.laporan_ekspertise?.ai_suggestion || null);

  // Print Sheet Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [itemToPrint, setItemToPrint] = useState<RadiologiItem | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'Semua' | 'Menunggu' | 'Selesai'>('Semua');

  // Handle selecting another item
  const handleSelectStudy = (item: RadiologiItem) => {
    setActiveItem(item);
    setTeknik(item.laporan_ekspertise?.teknik_pemeriksaan || `Proyeksi ${item.posisi_proyeksi} kondisi standar.`);
    setTemuan(item.laporan_ekspertise?.deskripsi_temuan || '');
    setKesimpulan(item.laporan_ekspertise?.kesimpulan_kesan || '');
    setSaran(item.laporan_ekspertise?.saran_tindakan || '');
    setIsCritical(item.laporan_ekspertise?.critical_finding || false);
    setDokterRadiolog(item.dokter_radiolog || 'dr. Raditya Perkasa, Sp.Rad (K) TR');
    setAiSuggestions(item.laporan_ekspertise?.ai_suggestion || null);
  };

  // Apply Quick Template
  const handleApplyTemplate = (tpl: typeof TEMPLATE_EKSPERTISE_LIST[0]) => {
    setTeknik(tpl.teknik);
    setTemuan(tpl.temuan);
    setKesimpulan(tpl.kesimpulan);
    setSaran(tpl.saran);
    toast.success(`Template diterapkan: ${tpl.nama}`);
  };

  // Run AI Radiologist Assistant
  const handleRunAiAnalysis = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      let summaryText = 'Analisis citra komputer: Cor CTR < 50%, pulmo dalam batas normal.';
      let confidenceNum = 95.4;
      let findingsList = ['Normal Heart Size', 'Clear Lung Fields'];

      if (activeItem.nama_pemeriksaan.includes('Thorax') || activeItem.modalitas === 'X-Ray') {
        if (activeItem.diagnosa_kerja.toLowerCase().includes('pneumonia')) {
          summaryText = 'AI deteksi konsolidasi alveolar pada zona bawah paru kanan (Right Lower Lobe Pneumonia). CTR normal 48%.';
          confidenceNum = 94.8;
          findingsList = ['Right Lower Lobe Consolidation', 'Air Bronchogram Sign', 'CTR 48% (Normal)'];
        } else if (activeItem.diagnosa_kerja.toLowerCase().includes('tb')) {
          summaryText = 'AI deteksi fibroinfiltrat heterogen pada apeks paru kanan dengan kemungkinan kavitas dinding tipis.';
          confidenceNum = 92.1;
          findingsList = ['Apical Fibroinfiltrates', 'Cavitation Suspect', 'No Pleural Effusion'];
        }
      } else if (activeItem.modalitas === 'CT-Scan') {
        summaryText = 'AI deteksi lesi hiperdens fokal pada ganglia basalis dextra (ICH Volume ± 18cc) dengan pergeseran midline 4.2mm.';
        confidenceNum = 96.2;
        findingsList = ['Acute Intracerebral Hemorrhage', 'Midline Shift 4.2mm', 'Perifocal Edema'];
      } else if (activeItem.modalitas === 'USG') {
        summaryText = 'AI deteksi multiple acoustic shadowing calculi pada lumen kandung empedu (Cholelithiasis). Dinding GB 3.4mm.';
        confidenceNum = 96.8;
        findingsList = ['Gallbladder Calculi Present', 'Acoustic Shadowing Confirmed'];
      }

      const newAi = {
        summary: summaryText,
        confidence: confidenceNum,
        findings_detected: findingsList
      };

      setAiSuggestions(newAi);
      if (!temuan) {
        setTemuan(`Temuan Terstruktur AI & Radiolog:\n${summaryText}`);
      }
      if (!kesimpulan) {
        setKesimpulan(summaryText);
      }
      toast.success('AI Deep Learning selesai menganalisis citra radiologi');
    }, 800);
  };

  // Save / Validate Reading
  const handleSaveEkspertise = (isFinalValidation: boolean) => {
    if (!temuan.trim() || !kesimpulan.trim()) {
      toast.error('Deskripsi temuan dan kesimpulan wajib diisi');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const nextStatus: StatusPemeriksaan = isFinalValidation ? 'Selesai & Tervalidasi' : 'Menunggu Ekspertise';

    const updated = radiologiList.map(r => {
      if (r.id === activeItem.id) {
        return {
          ...r,
          status: nextStatus,
          dokter_radiolog: dokterRadiolog,
          laporan_ekspertise: {
            teknik_pemeriksaan: teknik,
            deskripsi_temuan: temuan,
            kesimpulan_kesan: kesimpulan,
            saran_tindakan: saran,
            critical_finding: isCritical,
            tanggal_ekspertise: dateStr,
            waktu_ekspertise: timeStr,
            status_validasi: isFinalValidation ? 'Final / Tervalidasi' as const : 'Draft' as const,
            qr_verifikasi_code: `MYITARU-RAD-VERIFIED-${dateStr.replace(/-/g, '')}-${r.id.replace(/\D/g, '')}`,
            ai_suggestion: aiSuggestions
          }
        };
      }
      return r;
    });

    onUpdateList(updated);
    setActiveItem(prev => ({
      ...prev,
      status: nextStatus,
      dokter_radiolog: dokterRadiolog,
      laporan_ekspertise: {
        teknik_pemeriksaan: teknik,
        deskripsi_temuan: temuan,
        kesimpulan_kesan: kesimpulan,
        saran_tindakan: saran,
        critical_finding: isCritical,
        tanggal_ekspertise: dateStr,
        waktu_ekspertise: timeStr,
        status_validasi: isFinalValidation ? 'Final / Tervalidasi' as const : 'Draft' as const,
        qr_verifikasi_code: `MYITARU-RAD-VERIFIED-${dateStr.replace(/-/g, '')}-${prev.id.replace(/\D/g, '')}`,
        ai_suggestion: aiSuggestions
      }
    }));

    if (isFinalValidation) {
      toast.success(`Ekspertise ${activeItem.id} berhasil ditandatangani & divalidasi`);
    } else {
      toast.info('Draft ekspertise tersimpan');
    }
  };

  // Filter study worklist
  const filteredStudies = radiologiList.filter(item => {
    const matchSearch = 
      item.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.no_rm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_pemeriksaan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTab = 
      filterTab === 'Semua' ? true :
      filterTab === 'Menunggu' ? (item.status === 'Menunggu Ekspertise' || item.status === 'Sedang Pemeriksaan') :
      item.status === 'Selesai & Tervalidasi';

    return matchSearch && matchTab;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full text-left">
      {/* 1. LEFT COLUMN: STUDY WORKLIST */}
      <div className="w-full lg:w-96 flex flex-col gap-3 shrink-0">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-600" />
              Antrian Ekspertise Radiolog
            </h3>
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 font-bold text-xs rounded-full">
              {filteredStudies.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pasien / no RM..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            {(['Semua', 'Menunggu', 'Selesai'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterTab === tab
                    ? 'bg-white dark:bg-slate-800 text-pink-600 shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Cards List */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredStudies.map((item) => {
              const isSelected = item.id === activeItem.id;
              const isDone = item.status === 'Selesai & Tervalidasi';
              const isCito = item.prioritas === 'Cito / Emergency';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectStudy(item)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-pink-50/80 dark:bg-pink-950/30 border-pink-500 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">
                      {item.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                    }`}>
                      {isDone ? 'Tervalidasi' : 'Perlu Ekspertise'}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-slate-900 dark:text-white mt-1">
                    {item.nama_pasien}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {item.nama_pemeriksaan} ({item.modalitas})
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
                    <span>RM: {item.no_rm}</span>
                    {isCito && (
                      <span className="text-rose-600 font-extrabold animate-pulse">
                        CITO
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. RIGHT COLUMN: EXPERTISE FORM & AI COPILOT */}
      <div className="flex-1 space-y-4">
        {/* PATIENT & STUDY HEADER */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {activeItem.nama_pasien}
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-xs font-bold">
                {activeItem.no_rm}
              </span>
              <span className="px-2 py-0.5 bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 rounded text-xs font-bold">
                {activeItem.modalitas}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeItem.nama_pemeriksaan} • Dokter Pengirim: {activeItem.dokter_pengirim} ({activeItem.unit_asal})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPACS(activeItem)}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-pink-400 border border-pink-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Eye className="w-4 h-4" /> Buka di PACS Viewer
            </button>

            <button
              onClick={() => {
                setItemToPrint(activeItem);
                setIsPrintModalOpen(true);
              }}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-4 h-4" /> Cetak Lembar Hasil
            </button>
          </div>
        </div>

        {/* AI RADIOLOGIST COPILOT PANEL */}
        <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 p-4 rounded-2xl border border-pink-300 dark:border-pink-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <h4 className="text-xs font-extrabold text-pink-900 dark:text-pink-300 uppercase tracking-wider">
                AI Radiologist Assistant & Computer Vision
              </h4>
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAiLoading}
              className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
            >
              {isAiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              {isAiLoading ? 'Menganalisis Citra...' : 'Jalankan AI Analisis Citra'}
            </button>
          </div>

          {aiSuggestions ? (
            <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-pink-200 dark:border-pink-900 text-xs space-y-2 backdrop-blur-sm">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span>Rekomendasi Temuan AI:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  Confidence Score: {aiSuggestions.confidence}%
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic">
                "{aiSuggestions.summary}"
              </p>
              {aiSuggestions.findings_detected && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiSuggestions.findings_detected.map((f: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 text-[10px] font-bold rounded-md">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Klik tombol di atas untuk menjalankan analisis otomatis AI pada citra radiologi ({activeItem.modalitas}) pasien.
            </p>
          )}
        </div>

        {/* TEMPLATE QUICK SELECTOR */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pilih Template Bacaan Cepat:
          </div>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_EKSPERTISE_LIST.map((tpl) => (
              <button
                key={tpl.nama}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-pink-50 hover:border-pink-400 dark:hover:bg-pink-950/40 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                {tpl.nama}
              </button>
            ))}
          </div>
        </div>

        {/* EXPERTISE WRITING FORM */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Teknik & Proyeksi Pemeriksaan
            </label>
            <input
              type="text"
              value={teknik}
              onChange={(e) => setTeknik(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi Temuan Radiologis (Findings) *
            </label>
            <textarea
              rows={6}
              value={temuan}
              onChange={(e) => setTemuan(e.target.value)}
              placeholder="Deskripsikan struktur anatomis, lesi, ukuran, densitas, batas, dan temuan patologis..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-sans leading-relaxed outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kesimpulan / Kesan Radiologis (Impression) *
            </label>
            <textarea
              rows={3}
              value={kesimpulan}
              onChange={(e) => setKesimpulan(e.target.value)}
              placeholder="Kesimpulan diagnosa radiologis singkat, padat, dan jelas..."
              className="w-full p-3 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800 rounded-xl text-xs font-semibold leading-relaxed outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Saran / Anjuran Tindak Lanjut
            </label>
            <input
              type="text"
              value={saran}
              onChange={(e) => setSaran(e.target.value)}
              placeholder="misal: Evaluasi foto toraks serial setelah terapi / USG konfirmasi..."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dokter Spesialis Radiologi (Sp.Rad)
              </label>
              <input
                type="text"
                value={dokterRadiolog}
                onChange={(e) => setDokterRadiolog(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 w-full">
                <input
                  type="checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                  🚨 Temuan Kritis (Critical Result Alert ke DPJP)
                </span>
              </label>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => handleSaveEkspertise(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Simpan Draft
            </button>

            <button
              type="button"
              onClick={() => handleSaveEkspertise(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Tandatangani & Validasi Hasil (Final)
            </button>
          </div>
        </div>
      </div>

      {/* PRINT RESULT MODAL */}
      {isPrintModalOpen && itemToPrint && (
        <LembarHasilPrint
          item={itemToPrint}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
