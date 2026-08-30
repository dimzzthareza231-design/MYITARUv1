import React, { useState } from 'react';
import { ScanLine, Plus, CheckCircle2, Eye, ZoomIn, ZoomOut, RotateCw, Contrast, Sun, Sliders, Printer, Image as ImageIcon, ShieldCheck, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../PrintPDFButton';

export interface RadOrder {
  id: string;
  orderNumber: string;
  modality: 'X-Ray' | 'CT-Scan' | 'USG' | 'MRI';
  examName: string;
  orderDate: string;
  doctor: string;
  clinicalIndication: string;
  status: 'Selesai' | 'Dalam Proses' | 'Pending Expertise';
  radiologist?: string;
  verifiedAt?: string;
  findings: string;
  impression: string;
  recommendation: string;
  imageUrl?: string;
}

export function RadiologyTab({ patientData }: { patientData: any }) {
  const [orders, setOrders] = useState<RadOrder[]>([
    {
      id: 'RAD-001',
      orderNumber: 'ORD-RAD-90411',
      modality: 'X-Ray',
      examName: 'Foto Thorax PA (Rontgen Dada)',
      orderDate: '30 Aug 2026 09:15',
      doctor: 'dr. Budi Santoso, Sp.PD',
      clinicalIndication: 'Evaluasi kardiomegali pada pasien Hipertensi Primer lama',
      status: 'Selesai',
      radiologist: 'dr. Hendra Wijaya, Sp.Rad',
      verifiedAt: '30 Aug 2026 11:30',
      findings: 'COR: Membesar ke lateral kiri dengan apex downward (Cardiomegaly, CTR ± 54%). Aorta elongasi dengan kalsifikasi arcus aorta. PULMO: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat/konsolidasi aktif. Sinus costophrenicus kanan dan kiri lancip. Diafragma kanan dan kiri licin. Tulang-tulang dinding thorax intak.',
      impression: '1. Kardiomegali (CTR ~54%) suspek LVH ec Hypertensive Heart Disease.\n2. Elongatio et aterosklerosis aortae.\n3. Pulmo tenang, tidak tampak gambaran pneumonia atau TB aktif.',
      recommendation: 'Korelasi klinis dan pertimbangkan ekokardiografi konfirmasi LV mass & EF.'
    },
    {
      id: 'RAD-002',
      orderNumber: 'ORD-RAD-78220',
      modality: 'USG',
      examName: 'USG Abdomen Upper-Lower',
      orderDate: '15 Jul 2026 11:00',
      doctor: 'dr. Budi Santoso, Sp.PD',
      clinicalIndication: 'Skrining organ abdomen & fatty liver',
      status: 'Selesai',
      radiologist: 'dr. Hendra Wijaya, Sp.Rad',
      verifiedAt: '15 Jul 2026 13:10',
      findings: 'Hepar: Ukuran normal, ekogenisitas parenkim meningkat difus halus, vaskularisasi normal, tidak tampak massa/kista. Kandung empedu: Dinding tidak menebal, tidak tampak batu. Pankreas dan Lien: Normal. Ginjal bilateral: Ukuran dan batas kortikomeduler normal, tidak tampak batu/hidronefrosis.',
      impression: 'Mild Fatty Liver (Grade I hepatosteatosis). Organ intraabdominal lainnya dalam batas normal.',
      recommendation: 'Modifikasi gaya hidup dan kontrol profil lipid darah.'
    }
  ]);

  const [selectedOrderId, setSelectedOrderId] = useState<string>('RAD-001');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // PACS / DICOM Viewer Controls
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);

  // Modal order state
  const [modality, setModality] = useState<'X-Ray' | 'CT-Scan' | 'USG' | 'MRI'>('X-Ray');
  const [examName, setExamName] = useState('Foto Thorax PA');
  const [clinicalIndication, setClinicalIndication] = useState('');

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const resetViewer = () => {
    setZoom(100);
    setBrightness(100);
    setContrast(100);
    setInvert(false);
    toast.success('Pengaturan tampilan DICOM di-reset');
  };

  const handleCreateOrder = () => {
    if (!clinicalIndication) {
      toast.error('Indikasi klinis wajib diisi!');
      return;
    }

    const newOrder: RadOrder = {
      id: `RAD-${Date.now()}`,
      orderNumber: `ORD-RAD-${Math.floor(10000 + Math.random() * 90000)}`,
      modality: modality,
      examName: examName,
      orderDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      doctor: 'dr. Budi Santoso (DPJP)',
      clinicalIndication: clinicalIndication,
      status: 'Dalam Proses',
      findings: 'Pemeriksaan radiologi sedang dalam antrean pemindaian di instalasi Radiologi.',
      impression: 'Menunggu hasil pembacaan oleh Dokter Spesialis Radiologi (Sp.Rad).',
      recommendation: '-'
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newOrder.id);
    setShowOrderModal(false);
    setClinicalIndication('');
    toast.success('Permintaan radiologi berhasil dikirim ke RIS/PACS');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <ScanLine className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Pemeriksaan Radiologi & PACS DICOM Viewer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Viewer citra diagnostik terintegrasi RIS/PACS dengan pembacaan ekspertise spesialis radiologi (Sp.Rad).
            </p>
          </div>
          <button
            onClick={() => setShowOrderModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Order Radiologi Baru
          </button>
        </div>

        {/* ORDER SELECTOR */}
        <div className="flex items-center gap-3 overflow-x-auto pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 custom-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Riwayat Foto/Scan:</span>
          {orders.map(order => {
            const isSelected = order.id === selectedOrderId;
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded font-mono text-[10px]">
                  {order.modality}
                </span>
                <span>{order.examName}</span>
                <span className="text-[10px] opacity-70 font-normal">({order.orderDate.split(' ')[0]} {order.orderDate.split(' ')[1]})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEWER & EXPERTISE SPLIT VIEW */}
      {activeOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* DICOM PACS SIMULATOR CANVAS (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
            {/* VIEWER TOOLBAR */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-300 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700">
                  {activeOrder.modality}
                </span>
                <span>{activeOrder.examName}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom(prev => Math.max(50, prev - 15))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[11px] w-10 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(prev => Math.min(200, prev + 15))}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-4 bg-slate-700 mx-1" />

                <button
                  onClick={() => setInvert(!invert)}
                  className={`p-1.5 rounded transition-colors ${invert ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                  title="Invert Negative/Positive"
                >
                  <Contrast className="w-4 h-4" />
                </button>

                <button
                  onClick={resetViewer}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
                  title="Reset View"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* VIEWER CANVAS DISPLAY */}
            <div className="relative flex-1 min-h-[380px] flex items-center justify-center p-6 bg-radial from-slate-900 to-black overflow-hidden select-none">
              {/* OSD (On-Screen Display Metadata) */}
              <div className="absolute top-3 left-3 text-[11px] font-mono text-cyan-400/80 space-y-0.5 pointer-events-none z-10">
                <p>PATIENT: {patientData?.nama || 'PASIEN'}</p>
                <p>MRN: {patientData?.no_rm || 'RM-000000'}</p>
                <p>AGE/SEX: {patientData?.umur || 35}Y / {patientData?.jenis_kelamin || 'L'}</p>
                <p>ACC: {activeOrder.orderNumber}</p>
              </div>

              <div className="absolute top-3 right-3 text-[11px] font-mono text-cyan-400/80 text-right space-y-0.5 pointer-events-none z-10">
                <p>MYITARU PACS v4.2</p>
                <p>STUDY: {activeOrder.orderDate}</p>
                <p>SERIES: 1/1 [THORAX PA]</p>
                <p>W: 2400 L: -400</p>
              </div>

              {/* MEDICAL IMAGE GRAPHIC SIMULATION */}
              <div
                style={{
                  transform: `scale(${zoom / 100})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${invert ? 'invert(1)' : ''}`,
                  transition: 'transform 0.15s ease-out'
                }}
                className="relative w-72 h-88 bg-slate-900 rounded-lg border border-slate-700 shadow-2xl flex flex-col items-center justify-center p-4 overflow-hidden"
              >
                {/* Visual Representation of Thorax X-Ray */}
                <svg viewBox="0 0 200 240" className="w-full h-full opacity-90">
                  <defs>
                    <radialGradient id="lungGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0f172a" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </radialGradient>
                    <radialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </radialGradient>
                  </defs>

                  {/* Spine Column */}
                  <rect x="94" y="20" width="12" height="200" fill="#64748b" opacity="0.4" rx="2" />
                  {/* Clavicles */}
                  <path d="M 20 40 Q 95 60 100 55 Q 105 60 180 40" stroke="#94a3b8" strokeWidth="6" fill="none" opacity="0.7" />
                  {/* Left & Right Ribs */}
                  {[60, 80, 100, 120, 140, 160, 180].map((y, i) => (
                    <g key={i}>
                      <path d={`M 95 ${y} Q 30 ${y - 5} 25 ${y + 20}`} stroke="#64748b" strokeWidth="4" fill="none" opacity="0.5" />
                      <path d={`M 105 ${y} Q 170 ${y - 5} 175 ${y + 20}`} stroke="#64748b" strokeWidth="4" fill="none" opacity="0.5" />
                    </g>
                  ))}

                  {/* Right Lung Field */}
                  <path d="M 30 65 Q 90 65 92 180 Q 50 190 25 150 Z" fill="url(#lungGrad)" stroke="#475569" strokeWidth="1" />
                  {/* Left Lung Field */}
                  <path d="M 170 65 Q 110 65 108 130 Q 150 160 175 150 Z" fill="url(#lungGrad)" stroke="#475569" strokeWidth="1" />

                  {/* Cardiac Silhouette (Enlarged / Cardiomegaly representation) */}
                  <path d="M 90 90 Q 75 130 65 175 Q 105 190 145 175 Q 115 110 95 90 Z" fill="url(#heartGrad)" opacity="0.85" />
                  
                  {/* Aortic Knob */}
                  <circle cx="115" cy="90" r="14" fill="#cbd5e1" opacity="0.7" />
                  {/* Left Marker */}
                  <text x="175" y="45" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">L</text>
                </svg>
              </div>

              {/* SLIDERS CONTROLS FLOATING AT BOTTOM */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/80 flex items-center gap-4 text-slate-300 text-xs">
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    className="w-20 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Contrast className="w-3.5 h-3.5 text-cyan-400" />
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={e => setContrast(Number(e.target.value))}
                    className="w-20 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EXPERTISE REPORT PANEL (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Hasil Ekspertise Radiologi
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeOrder.examName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    No. Order: <strong>{activeOrder.orderNumber}</strong> • {activeOrder.orderDate}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {activeOrder.status}
                </span>
              </div>

              {/* CLINICAL INDICATION */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Indikasi Klinis</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{activeOrder.clinicalIndication}"
                </p>
              </div>

              {/* FINDINGS */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Temuan (Findings)</h4>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-justify">
                  {activeOrder.findings}
                </p>
              </div>

              {/* IMPRESSION */}
              <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1.5">
                  Kesimpulan (Impression)
                </h4>
                <p className="text-xs leading-relaxed font-semibold text-indigo-950 dark:text-indigo-200 whitespace-pre-line">
                  {activeOrder.impression}
                </p>
              </div>

              {/* RECOMMENDATION */}
              {activeOrder.recommendation && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saran / Rekomendasi</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {activeOrder.recommendation}
                  </p>
                </div>
              )}
            </div>

            {/* DOCTOR SIGNATURE & ACTIONS */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400">Dokter Spesialis Radiologi (Sp.Rad):</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {activeOrder.radiologist || 'dr. Hendra Wijaya, Sp.Rad'}
                  </p>
                  <p className="text-[10px] text-slate-400">TTE Terverifikasi • {activeOrder.verifiedAt || '30 Aug 2026'}</p>
                </div>
                <div className="w-12 h-12 border-2 border-emerald-500/40 rounded-lg flex items-center justify-center text-[10px] font-mono text-emerald-600 font-bold p-1 text-center leading-tight">
                  TTE BSrE VALID
                </div>
              </div>

              <PrintPDFButton
                filename={`Radiologi_${patientData?.nama || 'Pasien'}_${activeOrder.orderNumber}`}
                label="Cetak Lembar Ekspertise Radiologi"
                className="w-full justify-center text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-sm"
                documentData={{ ...patientData, radOrder: activeOrder }}
                docType="resume_medis"
                title="LEMBAR HASIL EKSPERTISE RADIOLOGI & IMAGING"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL ORDER RADIOLOGI */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <ScanLine className="w-5 h-5" /> Formulir Permintaan Radiologi
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">Pasien: {patientData?.nama} ({patientData?.no_rm})</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-white/80 hover:text-white p-1">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Modalitas Pemeriksaan
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['X-Ray', 'CT-Scan', 'USG', 'MRI'] as const).map(mod => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => {
                        setModality(mod);
                        if (mod === 'X-Ray') setExamName('Foto Thorax PA');
                        if (mod === 'CT-Scan') setExamName('CT-Scan Kepala Non Kontras');
                        if (mod === 'USG') setExamName('USG Abdomen Upper-Lower');
                        if (mod === 'MRI') setExamName('MRI Lumbal Spine');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        modality === mod
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nama Tindakan Pemeriksaan
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  placeholder="Contoh: Foto Thorax PA / AP, CT Scan Kepala..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Indikasi Klinis / Diagnosis Kerja *
                </label>
                <textarea
                  rows={3}
                  value={clinicalIndication}
                  onChange={e => setClinicalIndication(e.target.value)}
                  placeholder="Jelaskan alasan klinis pemeriksaan..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleCreateOrder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md transition-all"
              >
                Kirim Permintaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
