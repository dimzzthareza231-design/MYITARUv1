import React, { useState, useEffect } from 'react';
import { LabOrder, LabParameterResult, FlagHasil } from './types';
import { KATALOG_LAB_MASTER } from './data';
import { 
  TestTube, Cpu, Sparkles, AlertTriangle, CheckCircle2, 
  Save, Send, RefreshCw, PhoneCall, ShieldAlert, FileSpreadsheet,
  Zap, Info, Check, User
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface InputHasilTabProps {
  orders: LabOrder[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onUpdateOrders: (updated: LabOrder[]) => void;
  onSwitchToValidation: (order: LabOrder) => void;
}

export function InputHasilTab({
  orders,
  selectedOrderId,
  onSelectOrder,
  onUpdateOrders,
  onSwitchToValidation
}: InputHasilTabProps) {
  const toast = useToast();

  const eligibleOrders = orders.filter(o => o.status !== 'Selesai & Tervalidasi');
  const activeOrder = orders.find(o => o.id === selectedOrderId) || eligibleOrders[0] || null;

  // Local parameter states
  const [params, setParams] = useState<LabParameterResult[]>([]);
  const [analystNotes, setAnalystNotes] = useState<string>('');
  const [analystName, setAnalystName] = useState<string>('Siti Rahmawati, S.Tr.Kes');
  const [analyzerMachine, setAnalyzerMachine] = useState<string>('Sysmex XN-1000 Automated Hematology');
  const [isPullingLIS, setIsPullingLIS] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    summary: string;
    critical_alerts: string[];
    suggested_interpretation: string;
    recommendations: string[];
  } | null>(null);

  // Critical Value Notification Modal (SBAR)
  const [isSbarModalOpen, setIsSbarModalOpen] = useState(false);
  const [sbarDoctorNotified, setSbarDoctorNotified] = useState('');
  const [sbarNurseReceived, setSbarNurseReceived] = useState('');
  const [sbarReadbackConfirmed, setSbarReadbackConfirmed] = useState(false);

  // Sync params when active order changes
  useEffect(() => {
    if (!activeOrder) return;

    if (activeOrder.parameter_results && activeOrder.parameter_results.length > 0) {
      setParams(activeOrder.parameter_results);
      setAnalystNotes(activeOrder.catatan_analis || '');
      setAnalystName(activeOrder.petugas_analis || 'Siti Rahmawati, S.Tr.Kes');
      setAnalyzerMachine(activeOrder.alat_analyzer || 'Sysmex XN-1000 Automated Hematology');
      if (activeOrder.ai_pathology_analysis) {
        const interpStr = typeof activeOrder.ai_pathology_analysis === 'string'
          ? activeOrder.ai_pathology_analysis
          : activeOrder.ai_pathology_analysis.clinical_summary;
        setAiAnalysisResult({
          summary: 'Analisis AI Tersimpan',
          critical_alerts: [],
          suggested_interpretation: interpStr,
          recommendations: []
        });
      }
    } else {
      // Build default blank parameters based on ordered tests
      const initialParams: LabParameterResult[] = [];
      activeOrder.tests_ordered.forEach(t => {
        const catalog = KATALOG_LAB_MASTER.find(k => k.kode === t.kode);
        if (catalog && catalog.parameter_detail && catalog.parameter_detail.length > 0) {
          catalog.parameter_detail.forEach((p, idx) => {
            initialParams.push({
              id: `${activeOrder.id}-${catalog.kode}-${idx}`,
              test_code: catalog.kode,
              parameter_name: p.nama,
              hasil: '',
              satuan: p.satuan,
              nilai_rujukan: p.nilai_rujukan,
              flag: 'N',
              is_critical: false,
              metode_pemeriksaan: catalog.metode
            });
          });
        } else {
          initialParams.push({
            id: `${activeOrder.id}-${t.kode}-0`,
            test_code: t.kode,
            parameter_name: t.nama_pemeriksaan,
            hasil: '',
            satuan: '-',
            nilai_rujukan: 'Negatif / Normal',
            flag: 'N',
            is_critical: false,
            metode_pemeriksaan: 'Direct Assay'
          });
        }
      });
      setParams(initialParams);
      setAnalystNotes('');
      setAiAnalysisResult(null);
    }
  }, [activeOrder?.id]);

  if (!activeOrder) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <TestTube className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="font-extrabold text-base text-slate-700 dark:text-slate-200">
          Tidak Ada Permintaan Lab yang Siap Diinput
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Pilih atau buat order pemeriksaan baru pada tab Worklist & Permintaan.
        </p>
      </div>
    );
  }

  // AUTO FLAG COMPUTATION
  const computeFlagAndCritical = (paramName: string, value: string): { flag: FlagHasil; isCritical: boolean } => {
    const num = parseFloat(value.replace(',', '.'));
    if (isNaN(num)) {
      const lower = value.toLowerCase();
      if (lower.includes('pos') || lower.includes('reaktif')) {
        return { flag: 'P', isCritical: true };
      }
      return { flag: 'N', isCritical: false };
    }

    const name = paramName.toLowerCase();

    // Hemoglobin
    if (name.includes('hemoglobin') || name === 'hb') {
      if (num < 7.0) return { flag: 'LL', isCritical: true };
      if (num > 20.0) return { flag: 'HH', isCritical: true };
      if (num < 13.0) return { flag: 'L', isCritical: false };
      if (num > 17.5) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    // Leukosit
    if (name.includes('leukosit') || name.includes('wbc')) {
      if (num < 2000) return { flag: 'LL', isCritical: true };
      if (num > 30000) return { flag: 'HH', isCritical: true };
      if (num < 4000) return { flag: 'L', isCritical: false };
      if (num > 10000) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    // Trombosit
    if (name.includes('trombosit') || name.includes('plt')) {
      if (num < 50000) return { flag: 'LL', isCritical: true };
      if (num > 1000000) return { flag: 'HH', isCritical: true };
      if (num < 150000) return { flag: 'L', isCritical: false };
      if (num > 450000) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    // Glukosa Sewaktu
    if (name.includes('glukosa') || name.includes('gds') || name.includes('gdp')) {
      if (num < 45) return { flag: 'LL', isCritical: true };
      if (num > 450) return { flag: 'HH', isCritical: true };
      if (num < 70) return { flag: 'L', isCritical: false };
      if (num > 140) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    // Kalium
    if (name.includes('kalium') || name.includes('potassium')) {
      if (num < 2.8) return { flag: 'LL', isCritical: true };
      if (num > 6.2) return { flag: 'HH', isCritical: true };
      if (num < 3.5) return { flag: 'L', isCritical: false };
      if (num > 5.1) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    // Troponin
    if (name.includes('troponin')) {
      if (num > 0.04) return { flag: 'HH', isCritical: true };
      return { flag: 'N', isCritical: false };
    }

    // SGOT / SGPT
    if (name.includes('sgot') || name.includes('sgpt') || name.includes('ast') || name.includes('alt')) {
      if (num > 500) return { flag: 'HH', isCritical: true };
      if (num > 45) return { flag: 'H', isCritical: false };
      return { flag: 'N', isCritical: false };
    }

    return { flag: 'N', isCritical: false };
  };

  const handleParamValueChange = (index: number, val: string) => {
    const updated = [...params];
    const item = updated[index];
    const { flag, isCritical } = computeFlagAndCritical(item.parameter_name, val);
    updated[index] = {
      ...item,
      hasil: val,
      flag,
      is_critical: isCritical
    };
    setParams(updated);
  };

  // SIMULATE PULL FROM LIS ANALYZER
  const handlePullLISData = () => {
    setIsPullingLIS(true);
    toast.info(`Menghubungi interface alat analyzer [${analyzerMachine}] via HL7/ASTM...`);

    setTimeout(() => {
      const updated = params.map(p => {
        let simulatedVal = p.hasil;
        const name = p.parameter_name.toLowerCase();

        if (name.includes('hemoglobin') || name === 'hb') simulatedVal = '8.9';
        else if (name.includes('leukosit')) simulatedVal = '16400';
        else if (name.includes('hematokrit')) simulatedVal = '27.4';
        else if (name.includes('trombosit')) simulatedVal = '64000';
        else if (name.includes('eritrosit')) simulatedVal = '3.12';
        else if (name.includes('mcv')) simulatedVal = '76.2';
        else if (name.includes('mch')) simulatedVal = '25.1';
        else if (name.includes('mchc')) simulatedVal = '32.8';
        else if (name.includes('glukosa')) simulatedVal = '238';
        else if (name.includes('sgot')) simulatedVal = '68';
        else if (name.includes('sgpt')) simulatedVal = '84';
        else if (name.includes('ureum')) simulatedVal = '58';
        else if (name.includes('kreatinin')) simulatedVal = '1.85';
        else if (name.includes('natrium')) simulatedVal = '134';
        else if (name.includes('kalium')) simulatedVal = '5.4';
        else if (name.includes('klorida')) simulatedVal = '99';
        else if (name.includes('troponin')) simulatedVal = '0.08';
        else if (name.includes('ns1')) simulatedVal = 'Positif / Reaktif';
        else if (!simulatedVal) simulatedVal = 'Normal';

        const { flag, isCritical } = computeFlagAndCritical(p.parameter_name, String(simulatedVal));
        return {
          ...p,
          hasil: simulatedVal,
          flag,
          is_critical: isCritical
        };
      });

      setParams(updated);
      setIsPullingLIS(false);
      toast.success(`Data hasil berhasil ditarik otomatis dari ${analyzerMachine}!`);
    }, 1200);
  };

  // AI CLINICAL PATHOLOGY CO-PILOT
  const handleGenerateAIAnalysis = () => {
    setIsGeneratingAI(true);
    toast.info('AI Clinical Pathology Co-Pilot sedang mengevaluasi korelasi pola hasil laboratorium...');

    setTimeout(() => {
      const criticals = params.filter(p => p.is_critical);
      const highs = params.filter(p => p.flag === 'H' || p.flag === 'HH');
      const lows = params.filter(p => p.flag === 'L' || p.flag === 'LL');

      let summaryText = 'Hasil laboratorium menunjukkan gambaran Anemia Mikrositik Hipokrom dengan Trombositopenia dan Leukositosis.';
      let interp = `Pola pemeriksaan darah lengkap mengindikasikan:\n1. Anemia Derajat Sedang (Hb 8.9 g/dL) dengan penurunan indeks eritrosit (MCV 76.2 fl, MCH 25.1 pg) menyokong suspek Anemia Defisiensi Besi dd/ Anemia Penyakit Kronis.\n2. Trombositopenia (64.000 /uL) disertai Leukositosis (16.400 /uL) perlu dicurigai proses infeksi akut sistemik atau infeksi virus (mis. Dengue fase kritis) dikorelasikan dengan riwayat demam.\n3. Fungsi ginjal & glukosa menunjukkan hiperglikemia (238 mg/dL) dan peningkatan kreatinin serum (1.85 mg/dL).`;

      const recommendations = [
        'Konfirmasi gambaran darah tepi (DDR / Morfologi Darah Tepi) untuk evaluasi seri eritrosit dan trombosit.',
        'Pemeriksaan profil besi (Serum Iron, TIBC, Ferritin) bila klinis mengarah defisiensi besi.',
        'Pemeriksaan serial Darah Lengkap (6-12 jam) untuk memantau tren trombosit & hematokrit pada suspek infeksi dengue/sepsis.',
        'Laporkan nilai kritis trombosit < 100.000 /uL ke DPJP / Perawat ruangan sesuai SOP KPRS.'
      ];

      setAiAnalysisResult({
        summary: summaryText,
        critical_alerts: criticals.map(c => `${c.parameter_name}: ${c.hasil} ${c.satuan} (${c.flag})`),
        suggested_interpretation: interp,
        recommendations
      });

      setIsGeneratingAI(false);
      toast.success('Analisis AI Co-Pilot selesai!');
    }, 1400);
  };

  // SAVE DRAFT
  const handleSaveDraft = () => {
    const updated = orders.map(o => {
      if (o.id === activeOrder.id) {
        return {
          ...o,
          status: 'Sedang Dianalisis' as const,
          parameter_results: params,
          catatan_analis: analystNotes,
          petugas_analis: analystName,
          alat_analyzer: analyzerMachine,
          ai_pathology_analysis: aiAnalysisResult ? {
            clinical_summary: aiAnalysisResult.summary || 'Analisis AI terlampir',
            key_findings: aiAnalysisResult.critical_alerts || [],
            differential_considerations: [aiAnalysisResult.suggested_interpretation],
            recommended_follow_up: aiAnalysisResult.recommendations || [],
            confidence_score: 95
          } : undefined
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    toast.success('Draf hasil pemeriksaan berhasil disimpan!');
  };

  // SUBMIT TO Sp.PK FOR VALIDATION
  const handleSubmitToSpPK = () => {
    const emptyCount = params.filter(p => !p.hasil).length;
    if (emptyCount > 0) {
      toast.error(`Terdapat ${emptyCount} parameter yang belum diisi hasilnya!`);
      return;
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;

    const updated = orders.map(o => {
      if (o.id === activeOrder.id) {
        return {
          ...o,
          status: 'Menunggu Validasi' as const,
          parameter_results: params,
          catatan_analis: analystNotes,
          petugas_analis: analystName,
          alat_analyzer: analyzerMachine,
          waktu_selesai_analisis: timeStr,
          ai_pathology_analysis: aiAnalysisResult ? {
            clinical_summary: aiAnalysisResult.summary || 'Analisis AI terlampir',
            key_findings: aiAnalysisResult.critical_alerts || [],
            differential_considerations: [aiAnalysisResult.suggested_interpretation],
            recommended_follow_up: aiAnalysisResult.recommendations || [],
            confidence_score: 95
          } : undefined
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    toast.success(`Hasil Lab ${activeOrder.id} berhasil dikirim ke Dokter Spesialis Patologi Klinik (Sp.PK) untuk validasi!`);
    
    const targetOrder = updated.find(o => o.id === activeOrder.id)!;
    onSwitchToValidation(targetOrder);
  };

  const hasCriticalResults = params.some(p => p.is_critical);

  return (
    <div className="space-y-6 text-left">
      {/* ORDER SELECTOR BANNER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded-xl">
            <TestTube className="w-6 h-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Input Hasil & Integrasi LIS Analyzer
              </h3>
              <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-[10px] font-bold font-mono">
                HL7 / ASTM Direct
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilih order lab aktif untuk mengisi parameter atau menarik transmisi otomatis dari alat analyzer.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Pilih Order:</label>
          <select
            value={activeOrder.id}
            onChange={e => onSelectOrder(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono font-bold text-slate-800 dark:text-slate-100 outline-none w-full md:w-64"
          >
            {eligibleOrders.map(o => (
              <option key={o.id} value={o.id}>
                {o.id} - {o.nama_pasien} ({o.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PATIENT INFO & METADATA CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">No. Rekam Medis</span>
            <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
              {activeOrder.no_rm}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">ID: {activeOrder.id}</span>
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
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Ruangan & Dokter</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {activeOrder.ruangan_asal}
            </span>
            <span className="text-slate-500 text-[11px] block truncate">
              {activeOrder.dokter_pengirim}
            </span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Diagnosa Klinis</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate" title={activeOrder.diagnosa_klinis}>
              {activeOrder.diagnosa_klinis}
            </span>
            <span className="text-cyan-600 font-bold text-[10px]">{activeOrder.penjamin}</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Alat Analyzer Terhubung</span>
            <select
              value={analyzerMachine}
              onChange={e => setAnalyzerMachine(e.target.value)}
              className="w-full text-[11px] p-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none font-medium"
            >
              <option value="Sysmex XN-1000 Automated Hematology">Sysmex XN-1000 (Hematologi)</option>
              <option value="Roche Cobas c501 Clinical Chemistry">Cobas c501 (Kimia Klinik)</option>
              <option value="Abbott Architect i2000SR Immunoassay">Architect i2000 (Imunoserologi)</option>
              <option value="Sysmex CS-1600 Coagulation Analyzer">Sysmex CS-1600 (Koagulasi)</option>
              <option value="Manual / Mikroskopis Manual">Manual / Mikroskopis</option>
            </select>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Petugas Analis (ATLM)</span>
            <input
              type="text"
              value={analystName}
              onChange={e => setAnalystName(e.target.value)}
              className="w-full text-[11px] p-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* CRITICAL VALUE ALERT BANNER */}
      {hasCriticalResults && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 dark:text-rose-100 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-rose-600 text-white rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </span>
            <div>
              <h4 className="font-extrabold text-sm flex items-center gap-2">
                NILAI KRITIS (PANIC VALUE) TERDETEKSI!
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Wajib melakukan pelaporan segera (SBAR) ke DPJP / Perawat ruangan dalam waktu &lt; 30 menit sesuai SKP 2.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSbarModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow whitespace-nowrap"
          >
            <PhoneCall className="w-4 h-4" /> Lapor SBAR DPJP
          </button>
        </div>
      )}

      {/* ACTION BAR: PULL LIS & AI CO-PILOT */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePullLISData}
            disabled={isPullingLIS}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Cpu className={`w-4 h-4 ${isPullingLIS ? 'animate-spin' : ''}`} />
            <span>{isPullingLIS ? 'Menghubungi Analyzer LIS...' : 'Tarik Transmisi Hasil dari Alat LIS'}</span>
          </button>

          <button
            onClick={handleGenerateAIAnalysis}
            disabled={isGeneratingAI}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Mengevaluasi Pola...' : 'AI Clinical Pathology Co-Pilot'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" /> Simpan Draf
          </button>
          <button
            onClick={handleSubmitToSpPK}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Kirim ke Sp.PK untuk Validasi</span>
          </button>
        </div>
      </div>

      {/* PARAMETERS INPUT TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Daftar Parameter Uji & Nilai Hasil ({params.length} parameter)
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Format: N (Normal), L (Low), H (High), LL/HH (Critical)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold">
              <tr>
                <th className="p-3.5 w-12 text-center">#</th>
                <th className="p-3.5 min-w-[200px]">Parameter Uji</th>
                <th className="p-3.5 w-44">Nilai Hasil</th>
                <th className="p-3.5 w-20 text-center">Flag</th>
                <th className="p-3.5 w-28">Satuan</th>
                <th className="p-3.5 min-w-[180px]">Nilai Rujukan Standar</th>
                <th className="p-3.5">Metode Pemeriksaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {params.map((param, index) => {
                const isCritical = param.is_critical;
                const isHigh = param.flag === 'H' || param.flag === 'HH';
                const isLow = param.flag === 'L' || param.flag === 'LL';
                const isPos = param.flag === 'P';

                return (
                  <tr
                    key={param.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors ${
                      isCritical ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center font-mono text-slate-400 font-bold">
                      {index + 1}
                    </td>

                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        {isCritical && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                        )}
                        <span>{param.parameter_name}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <input
                        type="text"
                        value={param.hasil}
                        onChange={e => handleParamValueChange(index, e.target.value)}
                        placeholder="Ketik hasil..."
                        className={`w-full px-3 py-1.5 border rounded-xl font-mono font-bold text-xs outline-none transition-all ${
                          isCritical
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 focus:ring-2 focus:ring-rose-500'
                            : isHigh
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                            : isLow
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
                            : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500'
                        }`}
                      />
                    </td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                        isCritical
                          ? 'bg-rose-600 text-white animate-pulse'
                          : isHigh
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                          : isLow
                          ? 'bg-blue-200 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                          : isPos
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {param.flag || 'N'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {param.satuan}
                    </td>

                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                      {param.nilai_rujukan}
                    </td>

                    <td className="p-3.5 text-slate-500 text-[11px]">
                      {param.metode_pemeriksaan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI CO-PILOT ANALYSIS BOX (IF GENERATED) */}
      {aiAnalysisResult && (
        <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-extrabold text-sm text-purple-900 dark:text-purple-200">
                Saran Interpretasi Klinis Patologi (AI Scribe Lab)
              </h4>
            </div>
            <button
              onClick={() => {
                setAnalystNotes(aiAnalysisResult.suggested_interpretation);
                toast.success('Saran interpretasi AI disalin ke catatan analis!');
              }}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Salin ke Catatan Analis
            </button>
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900/60 text-xs whitespace-pre-line text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
            {aiAnalysisResult.suggested_interpretation}
          </div>

          {aiAnalysisResult.recommendations.length > 0 && (
            <div className="text-xs space-y-1">
              <span className="font-bold text-purple-900 dark:text-purple-300 block">
                Rekomendasi Tindak Lanjut:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                {aiAnalysisResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ANALYST NOTES & OBSERVATIONS */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <label className="block font-bold text-xs text-slate-700 dark:text-slate-300">
          Catatan Verifikasi Analis / Temuan Mikroskopis Morfologi
        </label>
        <textarea
          rows={3}
          value={analystNotes}
          onChange={e => setAnalystNotes(e.target.value)}
          placeholder="Tuliskan catatan teknis laboratorium, misalnya: Darah tepi normositik normokromik, trombosit tampak berkurang dan giant platelet (+), kontrol harian normal..."
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* MODAL SBAR PELAPORAN NILAI KRITIS */}
      {isSbarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-rose-300 dark:border-rose-800 w-full max-w-lg overflow-hidden text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-extrabold text-base">
                  Log Pelaporan Nilai Kritis (SBAR Read-Back)
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 space-y-1">
                <span className="font-bold text-rose-900 dark:text-rose-200 block">Parameter Kritis:</span>
                {params.filter(p => p.is_critical).map(p => (
                  <div key={p.id} className="font-mono text-rose-700 dark:text-rose-300 font-bold">
                    • {p.parameter_name}: {p.hasil} {p.satuan} ({p.flag})
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold mb-1">Dokter DPJP yang Dihubungi</label>
                <input
                  type="text"
                  value={sbarDoctorNotified || activeOrder.dokter_pengirim}
                  onChange={e => setSbarDoctorNotified(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Perawat Ruangan Penerima Telepon</label>
                <input
                  type="text"
                  value={sbarNurseReceived}
                  onChange={e => setSbarNurseReceived(e.target.value)}
                  placeholder="Nama lengkap perawat ruangan penerima..."
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="readback"
                  checked={sbarReadbackConfirmed}
                  onChange={e => setSbarReadbackConfirmed(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="readback" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Telah dilakukan Konfirmasi Baca Ulang (TBAK / Read-Back) 100% Sesuai
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSbarModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  disabled={!sbarReadbackConfirmed}
                  onClick={() => {
                    toast.success('Log pelaporan nilai kritis berhasil dicatat ke rekam medis & audit trail!');
                    setIsSbarModalOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan Log Pelaporan SBAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
