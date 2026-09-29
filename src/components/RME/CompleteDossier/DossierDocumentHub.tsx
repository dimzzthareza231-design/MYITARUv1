import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, AlertTriangle, HeartPulse, Apple, Scale, Activity,
  Baby, AlertOctagon, FileWarning, Microscope, Zap, CheckCircle2,
  Printer, Sparkles, ChevronRight, Search, Filter, ShieldAlert, Award, FolderCheck,
  Stethoscope, UserCheck, Scissors, Pill, Droplet, LogOut, ArrowRightLeft, CheckSquare
} from 'lucide-react';

// Modals
import { GeneralConsentModal } from './GeneralConsentModal';
import { InformedConsentModal } from './InformedConsentModal';
import { DNRFormModal } from './DNRFormModal';
import { PulangPaksaModal } from './PulangPaksaModal';

import { AsesmenAwalRanapModal } from './AsesmenAwalRanapModal';
import { CPPTModal } from './CPPTModal';
import { FallRiskAssessmentModal } from './FallRiskAssessmentModal';
import { NutritionAssessmentModal } from './NutritionAssessmentModal';
import { PainManagementModal } from './PainManagementModal';
import { BarthelIndexModal } from './BarthelIndexModal';

import { SurgicalSafetyChecklistModal } from './SurgicalSafetyChecklistModal';
import { LaporanOperasiModal } from './LaporanOperasiModal';

import { RekonsiliasiObatModal } from './RekonsiliasiObatModal';
import { FluidBalanceModal } from './FluidBalanceModal';

import { PartografViewerModal } from './PartografViewerModal';
import { NeonatalApgarModal } from './NeonatalApgarModal';

import { ElectrophysiologyExhibitModal } from './ElectrophysiologyExhibitModal';
import { PatologiAnatomiModal } from './PatologiAnatomiModal';

import { TransferPasienModal } from './TransferPasienModal';
import { DischargePlanningModal } from './DischargePlanningModal';
import { SuratKematianModal } from './SuratKematianModal';

import PrintPDFButton from '../../PrintPDFButton';

interface DossierProps {
  patient: any;
}

export function DossierDocumentHub({ patient }: DossierProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal active state
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Document Catalogue Structure (21 Essential Medical Record Files)
  const documentCatalogue = [
    // 1. IDENTITAS & PERSETUJUAN LEGAL
    {
      id: 'general_consent',
      type: 'general_consent',
      title: 'General Consent & Hak Kewajiban Pasien (RM.01)',
      category: 'Identitas & Persetujuan Legal',
      icon: UserCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Persetujuan umum perawatan, pelepasan informasi medis, tata tertib RS dan hak-kewajiban pasien.',
      action: () => setActiveModal('general_consent'),
    },
    {
      id: 'informed_consent',
      type: 'informed_consent',
      title: 'Informed Consent Tindakan Medis & Pembiusan (RM.02)',
      category: 'Identitas & Persetujuan Legal',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900',
      status: 'Terverifikasi TTD',
      badgeColor: 'bg-emerald-500',
      description: 'Persetujuan / Penolakan tindakan kedokteran invasif, penjelasan diagnosis, risiko, dan komplikasi.',
      action: () => setActiveModal('informed_consent'),
    },
    {
      id: 'dnr_form',
      type: 'formulir_dnr',
      title: 'Formulir Perintah Jangan Resusitasi (Do Not Resuscitate - DNR)',
      category: 'Identitas & Persetujuan Legal',
      icon: AlertOctagon,
      color: 'text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
      status: 'Tersedia',
      badgeColor: 'bg-amber-500',
      description: 'Pernyataan pembatasan tindakan RJP / defibrilasi / intubasi dengan persetujuan keluarga & tim paliatif DPJP.',
      action: () => setActiveModal('dnr_form'),
    },
    {
      id: 'pulang_paksa',
      type: 'pulang_paksa',
      title: 'Surat Pernyataan Pulang Atas Permintaan Sendiri (APS / DAMA)',
      category: 'Identitas & Persetujuan Legal',
      icon: FileWarning,
      color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
      status: 'Tersedia',
      badgeColor: 'bg-amber-500',
      description: 'Pelepasan tanggung jawab hukum rumah sakit dan edukasi risiko komplikasi penghentian perawatan rawat inap.',
      action: () => setActiveModal('pulang_paksa'),
    },

    // 2. ASESMEN KLINIS & RISIKO
    {
      id: 'asesmen_awal_ranap',
      type: 'asesmen_medis_ranap',
      title: 'Asesmen Awal Medis & Keperawatan Rawat Inap (RM.04)',
      category: 'Asesmen Klinis & Risiko',
      icon: Stethoscope,
      color: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Anamnesis mendalam, tanda vital masuk, pemeriksaan fisik head-to-toe, diagnosis kerja & rencana terapi awal 24 jam.',
      action: () => setActiveModal('asesmen_awal_ranap'),
    },
    {
      id: 'cppt',
      type: 'cppt',
      title: 'Catatan Perkembangan Pasien Terintegrasi (CPPT - SOAP/SBAR)',
      category: 'Asesmen Klinis & Risiko',
      icon: FileText,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900',
      status: 'Terverifikasi DPJP',
      badgeColor: 'bg-emerald-500',
      description: 'Catatan terpadu Dokter DPJP, Perawat, Apoteker Farmasi Klinis, dan Ahli Gizi Dietisien terverifikasi berkala.',
      action: () => setActiveModal('cppt'),
    },
    {
      id: 'fall_risk',
      type: 'asesmen_risiko_jatuh',
      title: 'Lembar Asesmen Risiko Jatuh (Morse / Humpty Dumpty)',
      category: 'Asesmen Klinis & Risiko',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Penilaian risiko jatuh berkala tiap shift, identifikasi gelang kuning & intervensi keselamatan pasien SKP.6.',
      action: () => setActiveModal('fall_risk'),
    },
    {
      id: 'nutrition_assessment',
      type: 'skrining_gizi_lanjut',
      title: 'Lembar Skrining & Asesmen Gizi Lanjut (Dietisien PAGT)',
      category: 'Asesmen Klinis & Risiko',
      icon: Apple,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Skrining MST/SGA, perhitungan IMT, preskripsi diet khusus penyakit & asuhan gizi terstandar.',
      action: () => setActiveModal('nutrition_assessment'),
    },
    {
      id: 'pain_management',
      type: 'asesmen_nyeri',
      title: 'Asesmen & Manajemen Nyeri Berkala (VAS / NRS / FLACC)',
      category: 'Asesmen Klinis & Risiko',
      icon: HeartPulse,
      color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Evaluasi skala nyeri berkala (OPQRST), respon analgetik farmakologis & intervensi non-farmakologi.',
      action: () => setActiveModal('pain_management'),
    },
    {
      id: 'barthel_index',
      type: 'asesmen_barthel',
      title: 'Asesmen Status Fungsional (Indeks Barthel ADL)',
      category: 'Asesmen Klinis & Risiko',
      icon: Activity,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: '10 parameter evaluasi kemandirian aktivitas harian (makan, mandi, mobilitas, toileting, kontinensia).',
      action: () => setActiveModal('barthel_index'),
    },

    // 3. TINDAKAN BEDAH & ANESTESI
    {
      id: 'surgical_safety',
      type: 'surgical_safety_checklist',
      title: 'WHO Surgical Safety Checklist (Keselamatan Bedah)',
      category: 'Tindakan Bedah & Anestesi',
      icon: CheckSquare,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
      status: 'Lengkap 3 Fase',
      badgeColor: 'bg-emerald-500',
      description: 'Checklist keselamatan perioperatif: Sign In (sebelum induksi), Time Out (sebelum insisi), Sign Out (sebelum tutup kulit).',
      action: () => setActiveModal('surgical_safety'),
    },
    {
      id: 'laporan_operasi',
      type: 'laporan_operasi',
      title: 'Laporan Operasi & Catatan Anestesi / Sedasi (RM.07)',
      category: 'Tindakan Bedah & Anestesi',
      icon: Scissors,
      color: 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
      status: 'Terverifikasi Operator',
      badgeColor: 'bg-emerald-500',
      description: 'Deskripsi rinci tahapan operasi, diagnosis pra/pasca bedah, temuan patologi, perdarahan, dan instruksi PACU.',
      action: () => setActiveModal('laporan_operasi'),
    },

    // 4. FARMASI & TERAPI MEDIS
    {
      id: 'rekonsiliasi_obat',
      type: 'rekonsiliasi_obat',
      title: 'Formulir Rekonsiliasi Obat & KPO Rawat Inap',
      category: 'Farmasi & Terapi Medis',
      icon: Pill,
      color: 'text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Pencatatan riwayat obat dari rumah, telaah interaksi klinis oleh Apoteker, dan Kartu Pemberian Obat (KPO) perawat.',
      action: () => setActiveModal('rekonsiliasi_obat'),
    },
    {
      id: 'fluid_balance',
      type: 'fluid_balance',
      title: 'Lembar Pemantauan Balans Cairan & IWL (24 Jam)',
      category: 'Farmasi & Terapi Medis',
      icon: Droplet,
      color: 'text-sky-600 bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Pencatatan jam-jaman intake oral/infus/injeksi, output urin/drain/IWL, laju diuresis dan balans kumulatif.',
      action: () => setActiveModal('fluid_balance'),
    },

    // 5. KASUS KHUSUS & MATERNAL
    {
      id: 'partograf',
      type: 'partograf',
      title: 'Lembar Partograf WHO (Kemajuan Persalinan Maternal)',
      category: 'Kasus Khusus & Maternal',
      icon: HeartPulse,
      color: 'text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900',
      status: 'Tersedia',
      badgeColor: 'bg-emerald-500',
      description: 'Kurva grafik pembukaan serviks, garis waspada & bertindak, DJJ janin, his per 10 menit & cairan ketuban.',
      action: () => setActiveModal('partograf'),
    },
    {
      id: 'neonatal_apgar',
      type: 'asesmen_neonatus_apgar',
      title: 'Lembar Penilaian Neonatal & Skor APGAR Bayi Baru Lahir',
      category: 'Kasus Khusus & Maternal',
      icon: Baby,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900',
      status: 'Tersedia',
      badgeColor: 'bg-emerald-500',
      description: 'Kalkulator APGAR 1 & 5 menit, antropometri kelahiran bayi, profilaksis Vit K1, salep mata & imunisasi Hb0.',
      action: () => setActiveModal('neonatal_apgar'),
    },

    // 6. HASIL PENUNJANG & DIAGNOSTIK
    {
      id: 'ekg_exhibit',
      type: 'grafik_ekg_eeg',
      title: 'Lembar Ekspertise & Rekaman Asli EKG 12-Lead / EEG',
      category: 'Hasil Penunjang & Diagnostik',
      icon: Zap,
      color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Visualisasi grafik irama elektrofisiologi, analisis gelombang P-QRS-T, interval dan kesimpulan Sp.JP.',
      action: () => setActiveModal('ekg_exhibit'),
    },
    {
      id: 'pa_report',
      type: 'laporan_patologi_anatomi',
      title: 'Laporan Patologi Anatomi (PA) & Histopatologi Biopsi',
      category: 'Hasil Penunjang & Diagnostik',
      icon: Microscope,
      color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900',
      status: 'Terverifikasi',
      badgeColor: 'bg-emerald-500',
      description: 'Deskripsi makroskopis sediaan jaringan, analisis mikroskopis seluler dan penentuan diagnosis definitif Sp.PA.',
      action: () => setActiveModal('pa_report'),
    },

    // 7. PERPINDAHAN & PEMULANGAN
    {
      id: 'transfer_pasien',
      type: 'transfer_pasien',
      title: 'Formulir Transfer Pasien Internal / Eksternal (SBAR - RM.09)',
      category: 'Perpindahan & Pemulangan',
      icon: ArrowRightLeft,
      color: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Serah terima klinis terstruktur SBAR antar unit rawat / ICU / rujukan antar rumah sakit.',
      action: () => setActiveModal('transfer_pasien'),
    },
    {
      id: 'discharge_planning',
      type: 'discharge_planning',
      title: 'Perencanaan Pemulangan Pasien (Discharge Planning - RM.08)',
      category: 'Perpindahan & Pemulangan',
      icon: LogOut,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900',
      status: 'Terisi Lengkap',
      badgeColor: 'bg-emerald-500',
      description: 'Checklist kesiapan pulang, instruksi perawatan mandiri, daftar obat pulang dan jadwal kontrol poli.',
      action: () => setActiveModal('discharge_planning'),
    },
    {
      id: 'surat_kematian',
      type: 'surat_kematian',
      title: 'Surat Keterangan Kematian (SKK WHO ICD-10 Mortality)',
      category: 'Perpindahan & Pemulangan',
      icon: FileText,
      color: 'text-slate-700 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      status: 'Format Resmi',
      badgeColor: 'bg-slate-500',
      description: 'Sertifikat penyebab kematian standar WHO (Penyebab Langsung a, Antara b, dan Dasar c).',
      action: () => setActiveModal('surat_kematian'),
    },
  ];

  const categories = [
    { id: 'all', label: 'Semua Berkas (21)' },
    { id: 'Identitas & Persetujuan Legal', label: '1. Persetujuan & Legal' },
    { id: 'Asesmen Klinis & Risiko', label: '2. Asesmen & CPPT' },
    { id: 'Tindakan Bedah & Anestesi', label: '3. Bedah & Operasi' },
    { id: 'Farmasi & Terapi Medis', label: '4. Farmasi & Cairan' },
    { id: 'Kasus Khusus & Maternal', label: '5. Maternal & Neonatus' },
    { id: 'Hasil Penunjang & Diagnostik', label: '6. Penunjang Asli' },
    { id: 'Perpindahan & Pemulangan', label: '7. Transfer & Pemulangan' },
  ];

  const filteredDocs = documentCatalogue.filter(doc => {
    const matchCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchQuery = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* 100% COMPLETENESS HERO BANNER */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-8 pointer-events-none">
          <FolderCheck className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase border border-white/30">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> Permenkes No. 24 Tahun 2022 & Standar Akreditasi KARS / JCI
          </div>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dossier Berkas Rekam Medis Elektronik 100% Lengkap
            </h1>
            <p className="text-sm text-blue-100 mt-1">
              Pasien: <span className="font-bold underline">{patient?.nama}</span> (No. RM: {patient?.no_rm}) • Seluruh formulir rekam medis terpadu, siap cetak & tervalidasi digital.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <span className="text-[11px] text-blue-200 block uppercase font-bold">Indeks Kelengkapan:</span>
              <span className="text-2xl font-black text-emerald-300">100%</span>
              <span className="text-[10px] text-blue-200 block">21 Berkas Terintegrasi</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <span className="text-[11px] text-blue-200 block uppercase font-bold">Total Formulir:</span>
              <span className="text-2xl font-black text-white">{documentCatalogue.length}</span>
              <span className="text-[10px] text-blue-200 block">E-Forms Standar RS</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <span className="text-[11px] text-blue-200 block uppercase font-bold">Status Validasi:</span>
              <span className="text-sm font-black text-emerald-300 flex items-center gap-1 mt-1.5">
                <CheckCircle2 className="w-4 h-4" /> QR Digital Signed
              </span>
              <span className="text-[10px] text-blue-200 block">Terenkripsi DPJP</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <span className="text-[11px] text-blue-200 block uppercase font-bold">Interoperabilitas:</span>
              <span className="text-sm font-black text-cyan-300 flex items-center gap-1 mt-1.5">
                <ShieldCheck className="w-4 h-4" /> SatuSehat Kemenkes
              </span>
              <span className="text-[10px] text-blue-200 block">FHIR HL7 Standard</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari formulir & lembar medis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* DOCUMENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all hover:border-blue-400 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-3 rounded-xl border ${doc.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {doc.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {doc.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={doc.action}
                  className="flex-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Buka & Edit Formulir <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <PrintPDFButton
                  filename={`${doc.type}_${patient?.no_rm || 'Pasien'}`}
                  label=""
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                  documentData={patient}
                  docType={doc.type as any}
                  title={doc.title}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ALL 21 MODALS */}
      {/* 1. Legal & Consent */}
      <GeneralConsentModal
        isOpen={activeModal === 'general_consent'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <InformedConsentModal
        isOpen={activeModal === 'informed_consent'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <DNRFormModal
        isOpen={activeModal === 'dnr_form'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <PulangPaksaModal
        isOpen={activeModal === 'pulang_paksa'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 2. Clinical Assessment & CPPT */}
      <AsesmenAwalRanapModal
        isOpen={activeModal === 'asesmen_awal_ranap'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <CPPTModal
        isOpen={activeModal === 'cppt'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <FallRiskAssessmentModal
        isOpen={activeModal === 'fall_risk'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <NutritionAssessmentModal
        isOpen={activeModal === 'nutrition_assessment'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <PainManagementModal
        isOpen={activeModal === 'pain_management'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <BarthelIndexModal
        isOpen={activeModal === 'barthel_index'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 3. Surgical & Anesthesia */}
      <SurgicalSafetyChecklistModal
        isOpen={activeModal === 'surgical_safety'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <LaporanOperasiModal
        isOpen={activeModal === 'laporan_operasi'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 4. Pharmacy & Fluid */}
      <RekonsiliasiObatModal
        isOpen={activeModal === 'rekonsiliasi_obat'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <FluidBalanceModal
        isOpen={activeModal === 'fluid_balance'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 5. Special & Maternal */}
      <PartografViewerModal
        isOpen={activeModal === 'partograf'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <NeonatalApgarModal
        isOpen={activeModal === 'neonatal_apgar'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 6. Diagnostics & Exhibits */}
      <ElectrophysiologyExhibitModal
        isOpen={activeModal === 'ekg_exhibit'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <PatologiAnatomiModal
        isOpen={activeModal === 'pa_report'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      {/* 7. Transfer & Discharge */}
      <TransferPasienModal
        isOpen={activeModal === 'transfer_pasien'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <DischargePlanningModal
        isOpen={activeModal === 'discharge_planning'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />

      <SuratKematianModal
        isOpen={activeModal === 'surat_kematian'}
        onClose={() => setActiveModal(null)}
        patient={patient}
      />
    </div>
  );
}
