import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, UserCheck, ListOrdered, History, Search, Plus, Printer, 
  ChevronRight, ArrowRight, CheckCircle2, Clock, AlertTriangle, 
  Volume2, ShieldCheck, Heart, Stethoscope, Building2, Bed, 
  Ambulance, CreditCard, Phone, MapPin, UserPlus, FileText, 
  RotateCcw, X, Edit3, Check, Filter, Calendar, Sparkles, Tag, Save
} from 'lucide-react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useHospital, MASTER_POLI_LIST } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { usePatientFlow } from '../contexts/PatientFlowContext';
import { useAntrian, DAFTAR_POLI } from '../contexts/AntrianContext';
import { RegistrationForm } from './Registration/RegistrationForm';
import { ProfessionalTable } from './ProfessionalTable';
import PrintPDFButton from './PrintPDFButton';
import { Pasien, Kunjungan } from '../types';

type MainSection = '1. Master Pasien' | '2. Registrasi Kunjungan' | '3. Antrian' | '4. Riwayat Pendaftaran';

export function Registration() {
  const { activeTab: outletTab } = useOutletContext<{ activeTab?: string }>() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    pasien, 
    addPasien, 
    updatePasien, 
    kunjungan, 
    addKunjungan: addKunjunganHospital, 
    updateKunjunganStatus,
    dokter,
    poli,
    penjamin
  } = useHospital();
  const { addKunjungan: addKunjunganFlow } = usePatientFlow();
  const { daftarkanAntrian } = useAntrian();
  const toast = useToast();

  // Helper Badge Renderer
  const renderBadge = (value: string | undefined, colorScheme: 'blue' | 'emerald' | 'amber' | 'purple' | 'teal' | 'rose' = 'blue') => {
    if (!value) return <span className="text-slate-400">-</span>;
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      teal: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colorMap[colorScheme] || colorMap.blue}`}>
        {value}
      </span>
    );
  };

  // Determine current active section & sub-tab based on URL or defaults
  const [activeSection, setActiveSection] = useState<MainSection>('1. Master Pasien');
  const [activeSubTab, setActiveSubTab] = useState<string>('Pasien Lama');

  // Sync with outletTab or query params
  useEffect(() => {
    const tabParam = searchParams.get('tab') || outletTab;
    if (!tabParam) return;

    if (tabParam === '1. Master Pasien' || tabParam.startsWith('1.')) {
      setActiveSection('1. Master Pasien');
    } else if (tabParam === '2. Registrasi Kunjungan' || tabParam.startsWith('2.')) {
      setActiveSection('2. Registrasi Kunjungan');
    } else if (tabParam === '3. Antrian' || tabParam.startsWith('3.')) {
      setActiveSection('3. Antrian');
    } else if (tabParam === '4. Riwayat Pendaftaran' || tabParam.startsWith('4.')) {
      setActiveSection('4. Riwayat Pendaftaran');
    } else {
      // Direct sub-tab mapping
      const masterSub = ['Pasien Baru', 'Pasien Lama', 'Identitas', 'Data Sosial', 'Data Penjamin'];
      const regSub = ['Rawat Jalan', 'IGD', 'Rawat Inap', 'Poli', 'Dokter', 'Penjamin'];
      const antrianSub = ['Nomor Antrian', 'Loket', 'Poli', 'Dokter', 'Status'];
      const riwayatSub = ['Kunjungan', 'Status', 'Penjamin', 'Riwayat Pembatalan'];

      if (masterSub.includes(tabParam)) {
        setActiveSection('1. Master Pasien');
        setActiveSubTab(tabParam);
      } else if (regSub.includes(tabParam)) {
        setActiveSection('2. Registrasi Kunjungan');
        setActiveSubTab(tabParam);
      } else if (antrianSub.includes(tabParam)) {
        setActiveSection('3. Antrian');
        setActiveSubTab(tabParam);
      } else if (riwayatSub.includes(tabParam)) {
        setActiveSection('4. Riwayat Pendaftaran');
        setActiveSubTab(tabParam);
      }
    }
  }, [outletTab, searchParams]);

  // Handle section switch
  const handleSectionChange = (section: MainSection) => {
    setActiveSection(section);
    let defaultSub = 'Pasien Lama';
    if (section === '1. Master Pasien') defaultSub = 'Pasien Lama';
    if (section === '2. Registrasi Kunjungan') defaultSub = 'Rawat Jalan';
    if (section === '3. Antrian') defaultSub = 'Nomor Antrian';
    if (section === '4. Riwayat Pendaftaran') defaultSub = 'Kunjungan';
    setActiveSubTab(defaultSub);
    setSearchParams({ tab: section });
  };

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  // State Modals
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showQuickRegisterModal, setShowQuickRegisterModal] = useState(false);
  const [showDetailPatientModal, setShowDetailPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showCancelVisitModal, setShowCancelVisitModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);

  // Quick Register Form State
  const [quickRegForm, setQuickRegForm] = useState({
    pasienId: '',
    tipePelayanan: 'Rawat Jalan' as 'Rawat Jalan' | 'IGD' | 'Rawat Inap',
    poliId: 'POL-01',
    dokterId: 'D1',
    penjaminId: 'PJ-02',
    keluhanUtama: '',
    ruangan: 'Bangsal Melati (Kelas 2)',
    triase: 'Hijau' as 'Merah' | 'Kuning' | 'Hijau'
  });

  // Edit Patient Form State
  const [editPatientForm, setEditPatientForm] = useState<any>({});

  // Cancel Visit State
  const [cancelReason, setCancelReason] = useState('Permintaan Pasien / Tidak Hadir');

  // Loket Admisi Queue State
  const [loketStatus, setLoketStatus] = useState<Record<number, { activeNo: string; status: 'Aktif' | 'Istirahat'; petugas: string }>>({
    1: { activeNo: 'A-001', status: 'Aktif', petugas: 'Siti Rahma (BPJS)' },
    2: { activeNo: 'B-001', status: 'Aktif', petugas: 'Ahmad Fauzi (Umum/Eksekutif)' },
    3: { activeNo: 'P-001', status: 'Aktif', petugas: 'Dewi Lestari (Prioritas/Lansia)' },
    4: { activeNo: 'C-001', status: 'Aktif', petugas: 'Rudi Hartono (Informasi & Kasir)' }
  });

  // Text-To-Speech Queue Caller
  const callQueueAudio = (queueNo: string, loketNo: number | string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Nomor antrian, ${queueNo}, silakan menuju, Loket ${loketNo}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
    toast.success(`🔊 Memanggil Nomor Antrian ${queueNo} ke Loket ${loketNo}`);
  };

  // Direct Quick Register Handler
  const handleSaveQuickRegistration = async () => {
    const targetPatient = pasien.find(p => String(p.id) === String(quickRegForm.pasienId));
    if (!targetPatient) {
      toast.error('Pilih data pasien terlebih dahulu');
      return;
    }

    const targetPoli = MASTER_POLI_LIST.find(p => p.id === quickRegForm.poliId) || MASTER_POLI_LIST[0];
    const targetDoc = dokter.find(d => d.id === quickRegForm.dokterId) || dokter[0];
    const queueCode = targetPoli.kode || targetPoli.nama.substring(0, 3).toUpperCase();
    const existingPoliQueues = kunjungan.filter(k => k.poli_id === targetPoli.id);
    const queueNum = String(existingPoliQueues.length + 1).padStart(3, '0');
    const nomorAntrian = `${queueCode}-${queueNum}`;

    const newKunjunganData: Kunjungan = {
      id: `K-${targetPoli.kode}-${Date.now().toString().slice(-4)}`,
      pasien_id: String(targetPatient.id),
      tanggal: new Date().toISOString().split('T')[0],
      poli_id: targetPoli.id,
      dokter_id: targetDoc.id,
      penjamin_id: quickRegForm.penjaminId,
      status: 'Menunggu',
      tipe: quickRegForm.tipePelayanan,
      nomor_antrian: nomorAntrian,
      keluhan_utama: quickRegForm.keluhanUtama || `Kunjungan ${quickRegForm.tipePelayanan} di ${targetPoli.nama}`
    };

    // Save to HospitalContext (Master Visit)
    await addKunjunganHospital(newKunjunganData);

    // Save to PatientFlowContext
    addKunjunganFlow({
      no_rm: targetPatient.no_rm,
      nama_pasien: targetPatient.nama,
      jenis_kunjungan: quickRegForm.tipePelayanan,
      poli: targetPoli.nama,
      dokter: targetDoc.nama,
      penjamin: targetPatient.penjamin || 'BPJS Kesehatan'
    });

    // Save to AntrianContext
    daftarkanAntrian({
      pasienId: targetPatient.id,
      namaPasien: targetPatient.nama,
      noRm: targetPatient.no_rm,
      poliId: targetPoli.id,
      keluhan: quickRegForm.keluhanUtama,
      penjamin: targetPatient.penjamin
    });

    setSelectedVisit(newKunjunganData);
    setShowQuickRegisterModal(false);
    toast.success(`✅ Pendaftaran kunjungan berhasil! Nomor Antrian: ${nomorAntrian}`);
    setShowTicketModal(true);
  };

  // Save Edit Patient
  const handleSaveEditPatient = async () => {
    if (!editPatientForm.id) return;
    await updatePasien(editPatientForm.id, editPatientForm);
    toast.success(`Data pasien ${editPatientForm.nama} berhasil diperbarui!`);
    setShowEditPatientModal(false);
  };

  // Cancel Visit Action
  const handleConfirmCancelVisit = async () => {
    if (!selectedVisit) return;
    await updateKunjunganStatus(selectedVisit.id, 'Selesai');
    // Store cancellation record in localStorage
    const cancelLogs = JSON.parse(localStorage.getItem('hospital_riwayat_pembatalan') || '[]');
    cancelLogs.unshift({
      id: `BATAL-${Date.now()}`,
      kunjungan_id: selectedVisit.id,
      pasien_id: selectedVisit.pasien_id,
      no_rm: selectedVisit.pasien?.no_rm || '-',
      nama_pasien: selectedVisit.pasien?.nama || 'Pasien',
      poli: selectedVisit.poli_nama || selectedVisit.poli_id,
      dokter: selectedVisit.dokter_nama || selectedVisit.dokter_id,
      penjamin: selectedVisit.penjamin_id || 'BPJS',
      nomor_antrian: selectedVisit.nomor_antrian,
      alasan: cancelReason,
      waktu_batal: new Date().toLocaleString('id-ID'),
      petugas: 'Admisi Pendaftaran'
    });
    localStorage.setItem('hospital_riwayat_pembatalan', JSON.stringify(cancelLogs));

    toast.success(`Pendaftaran antrian ${selectedVisit.nomor_antrian} berhasil dibatalkan.`);
    setShowCancelVisitModal(false);
  };

  // Enriched Kunjungan with Patient and Doctor data
  const enrichedKunjungan = useMemo(() => {
    return kunjungan.map(k => {
      const p = pasien.find(px => String(px.id) === String(k.pasien_id));
      const d = dokter.find(dx => dx.id === k.dokter_id || dx.poli_id === k.poli_id);
      const poliObj = MASTER_POLI_LIST.find(po => po.id === k.poli_id);
      const penjaminObj = penjamin.find(pj => pj.id === k.penjamin_id);

      return {
        ...k,
        pasien: p || null,
        nama_pasien: p ? p.nama : 'Pasien',
        no_rm: p ? p.no_rm : '-',
        nik: p ? p.nik : '-',
        no_hp: p ? (p.no_hp || p.telepon || '-') : '-',
        alamat: p ? (p.alamat || '-') : '-',
        penjamin_nama: p?.penjamin || penjaminObj?.nama || 'Umum / Mandiri',
        dokter_nama: d ? d.nama : 'dr. Jaga Poliklinik',
        poli_nama: poliObj ? poliObj.nama : (k.poli_id || 'Poliklinik Umum')
      };
    });
  }, [kunjungan, pasien, dokter, penjamin]);

  // Statistics Summary
  const stats = useMemo(() => {
    const totalPasien = pasien.length;
    const totalKunjungan = kunjungan.length;
    const antrianMenunggu = kunjungan.filter(k => k.status === 'Menunggu' || k.status === 'Panggil').length;
    const selesaiPeriksa = kunjungan.filter(k => k.status === 'Selesai').length;
    const pasienBpjs = pasien.filter(p => (p.penjamin || '').toLowerCase().includes('bpjs')).length;
    const pasienUmum = totalPasien - pasienBpjs;

    return { totalPasien, totalKunjungan, antrianMenunggu, selesaiPeriksa, pasienBpjs, pasienUmum };
  }, [pasien, kunjungan]);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-900 text-slate-100 flex flex-col gap-6">
      
      {/* 1. HEADER RINGKASAN & STATISTIK REAL-TIME */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/20">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">PENDAFTARAN & ADMISI PASIEN</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Terpadu Poliklinik & RME
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Sistem Registrasi Master Pasien, Admisi Kunjungan, Manajemen Antrian Loket & Riwayat Pelayanan Terintegrasi.
              </p>
            </div>
          </div>

          {/* Quick Action Pasien Baru */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveSection('1. Master Pasien');
                setActiveSubTab('Pasien Baru');
                setShowWizardModal(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Pasien Baru (Wizard)</span>
            </button>
            <button
              onClick={() => {
                if (pasien.length > 0) {
                  setQuickRegForm(prev => ({ ...prev, pasienId: pasien[0].id }));
                  setShowQuickRegisterModal(true);
                } else {
                  toast.error('Belum ada master pasien.');
                }
              }}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow transition-all hover:scale-[1.02]"
            >
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>Daftar Kunjungan Cepat</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Total Master Pasien
            </span>
            <div className="text-xl font-bold text-white mt-1 font-mono">{stats.totalPasien}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" /> Kunjungan Hari Ini
            </span>
            <div className="text-xl font-bold text-teal-300 mt-1 font-mono">{stats.totalKunjungan}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Antrian Menunggu
            </span>
            <div className="text-xl font-bold text-amber-300 mt-1 font-mono">{stats.antrianMenunggu}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Selesai Dilayani
            </span>
            <div className="text-xl font-bold text-emerald-300 mt-1 font-mono">{stats.selesaiPeriksa}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Pasien BPJS (JKN)
            </span>
            <div className="text-xl font-bold text-cyan-300 mt-1 font-mono">{stats.pasienBpjs}</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Pasien Umum/Mandiri
            </span>
            <div className="text-xl font-bold text-purple-300 mt-1 font-mono">{stats.pasienUmum}</div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY 4-SECTION HEADER NAVIGATION */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 bg-slate-800/90 p-2 rounded-2xl border border-slate-700 shadow-lg">
          
          {/* Section 1: MASTER PASIEN */}
          <button
            onClick={() => handleSectionChange('1. Master Pasien')}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-left ${
              activeSection === '1. Master Pasien'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50 border border-blue-400/40'
                : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              activeSection === '1. Master Pasien' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              👤
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-200/80 font-mono">Modul 1</div>
              <div className="text-sm font-bold truncate">MASTER PASIEN</div>
            </div>
          </button>

          {/* Section 2: REGISTRASI KUNJUNGAN */}
          <button
            onClick={() => handleSectionChange('2. Registrasi Kunjungan')}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-left ${
              activeSection === '2. Registrasi Kunjungan'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/50 border border-teal-400/40'
                : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              activeSection === '2. Registrasi Kunjungan' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              🏥
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-teal-200/80 font-mono">Modul 2</div>
              <div className="text-sm font-bold truncate">REGISTRASI KUNJUNGAN</div>
            </div>
          </button>

          {/* Section 3: ANTRIAN */}
          <button
            onClick={() => handleSectionChange('3. Antrian')}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-left ${
              activeSection === '3. Antrian'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-900/50 border border-amber-400/40'
                : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              activeSection === '3. Antrian' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              🎫
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-200/80 font-mono">Modul 3</div>
              <div className="text-sm font-bold truncate">ANTRIAN & LOKET</div>
            </div>
          </button>

          {/* Section 4: RIWAYAT PENDAFTARAN */}
          <button
            onClick={() => handleSectionChange('4. Riwayat Pendaftaran')}
            className={`flex items-center gap-3 p-3.5 rounded-xl transition-all font-bold text-left ${
              activeSection === '4. Riwayat Pendaftaran'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/50 border border-purple-400/40'
                : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
              activeSection === '4. Riwayat Pendaftaran' ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
              📜
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-purple-200/80 font-mono">Modul 4</div>
              <div className="text-sm font-bold truncate">RIWAYAT PENDAFTARAN</div>
            </div>
          </button>

        </div>

        {/* 3. SECONDARY SUBMENU NAVIGATION PILL BAR */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-2 flex items-center gap-2 overflow-x-auto shadow-md">
          
          {/* Submenus for 1. MASTER PASIEN */}
          {activeSection === '1. Master Pasien' && (
            <>
              {['Pasien Baru', 'Pasien Lama', 'Identitas', 'Data Sosial', 'Data Penjamin'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeSubTab === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 scale-100'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab === 'Pasien Baru' && '✨'}
                  {tab === 'Pasien Lama' && '🔍'}
                  {tab === 'Identitas' && '🆔'}
                  {tab === 'Data Sosial' && '👥'}
                  {tab === 'Data Penjamin' && '🛡️'}
                  <span>{tab}</span>
                </button>
              ))}
            </>
          )}

          {/* Submenus for 2. REGISTRASI KUNJUNGAN */}
          {activeSection === '2. Registrasi Kunjungan' && (
            <>
              {['Rawat Jalan', 'IGD', 'Rawat Inap', 'Poli', 'Dokter', 'Penjamin'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeSubTab === tab
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-900/50 scale-100'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab === 'Rawat Jalan' && '🩺'}
                  {tab === 'IGD' && '🚑'}
                  {tab === 'Rawat Inap' && '🛏️'}
                  {tab === 'Poli' && '🏢'}
                  {tab === 'Dokter' && '👨‍⚕️'}
                  {tab === 'Penjamin' && '💳'}
                  <span>{tab}</span>
                </button>
              ))}
            </>
          )}

          {/* Submenus for 3. ANTRIAN */}
          {activeSection === '3. Antrian' && (
            <>
              {['Nomor Antrian', 'Loket', 'Poli', 'Dokter', 'Status'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeSubTab === tab
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 scale-100'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab === 'Nomor Antrian' && '🎫'}
                  {tab === 'Loket' && '🏛️'}
                  {tab === 'Poli' && '🩺'}
                  {tab === 'Dokter' && '👨‍⚕️'}
                  {tab === 'Status' && '📊'}
                  <span>{tab}</span>
                </button>
              ))}
            </>
          )}

          {/* Submenus for 4. RIWAYAT PENDAFTARAN */}
          {activeSection === '4. Riwayat Pendaftaran' && (
            <>
              {['Kunjungan', 'Status', 'Penjamin', 'Riwayat Pembatalan'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleSubTabChange(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeSubTab === tab
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 scale-100'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tab === 'Kunjungan' && '📋'}
                  {tab === 'Status' && '⚡'}
                  {tab === 'Penjamin' && '🛡️'}
                  {tab === 'Riwayat Pembatalan' && '❌'}
                  <span>{tab}</span>
                </button>
              ))}
            </>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER PASIEN                                                  */}
      {/* ========================================================================= */}
      {activeSection === '1. Master Pasien' && (
        <div className="flex flex-col gap-4">
          
          {/* SubTab: Pasien Baru */}
          {activeSubTab === 'Pasien Baru' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-cyan-400" />
                    Formulir Wizard Pendaftaran Pasien Baru (8 Langkah)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Otomatis generate Nomor RM, validasi NIK/BPJS, dan tersinkronisasi langsung ke Poliklinik & Antrian.
                  </p>
                </div>
              </div>
              
              <RegistrationForm 
                onClose={() => {
                  setActiveSubTab('Pasien Lama');
                  toast.success('Pendaftaran pasien baru selesai dan tersimpan.');
                }}
              />
            </div>
          )}

          {/* SubTab: Pasien Lama (Cari & Registrasi Cepat) */}
          {activeSubTab === 'Pasien Lama' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
                <ProfessionalTable
                  title="Master Data Pasien Lama (Pencarian & Tindakan Cepat)"
                  columns={[
                    { key: 'no_rm', label: 'No. RM', sortable: true },
                    { key: 'nik', label: 'NIK', sortable: true, render: (v: any) => v || '-' },
                    { key: 'nama', label: 'Nama Lengkap', sortable: true },
                    { key: 'jenis_kelamin', label: 'L/P', sortable: true, filterable: true },
                    { key: 'tanggal_lahir', label: 'Tgl Lahir', render: (_: any, r: any) => r.tanggal_lahir || r.tgl_lahir || '-' },
                    { key: 'telepon', label: 'No. HP', render: (_: any, r: any) => r.no_hp || r.telepon || '-' },
                    { key: 'penjamin', label: 'Penjamin', filterable: true, render: (v: any) => renderBadge(v, 'blue') },
                    { 
                      key: 'actions', 
                      label: 'Tindakan Registrasi / Kartu', 
                      render: (_: any, row: any) => (
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedPasien(row);
                              setQuickRegForm(prev => ({ ...prev, pasienId: row.id }));
                              setShowQuickRegisterModal(true);
                            }}
                            className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-all hover:scale-105"
                            title="Daftarkan Pasien ini ke Kunjungan Baru"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Daftar Kunjungan</span>
                          </button>
                          
                          <PrintPDFButton
                            documentData={{
                              nama: row.nama,
                              no_rm: row.no_rm,
                              nik: row.nik,
                              jenis_kelamin: row.jenis_kelamin,
                              no_hp: row.no_hp || row.telepon,
                              unit_pelayanan: 'Instalasi Admisi & Rekam Medis',
                              penjamin: row.penjamin || 'BPJS Kesehatan',
                              alamat: row.alamat || 'Kota Bandung'
                            }}
                            docType="general"
                            filename={`Kartu_Pasien_${row.no_rm}`}
                            label="Cetak Kartu"
                            title="KARTU BEROBAT & IDENTITAS PASIEN RS"
                            className="py-1.5 px-2.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600"
                          />

                          <button
                            onClick={() => {
                              setEditPatientForm(row);
                              setShowEditPatientModal(true);
                            }}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs"
                            title="Edit Data Pasien"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    }
                  ]}
                  data={pasien}
                  actions={[
                    {
                      icon: <UserPlus className="w-4 h-4" />,
                      label: 'Tambah Pasien Baru',
                      color: 'bg-blue-600 hover:bg-blue-700',
                      onClick: () => setActiveSubTab('Pasien Baru')
                    }
                  ]}
                  onRowClick={(row) => {
                    setSelectedPasien(row);
                    setShowDetailPatientModal(true);
                  }}
                  pageSize={10}
                  emptyMessage="Belum ada data pasien tersimpan. Klik 'Tambah Pasien Baru'."
                />
              </div>
            </div>
          )}

          {/* SubTab: Identitas Pasien */}
          {activeSubTab === 'Identitas' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Master Data Identitas Pasien Lengkap"
                columns={[
                  { key: 'no_rm', label: 'No. RM', sortable: true },
                  { key: 'nik', label: 'NIK KTP/Paspor', sortable: true },
                  { key: 'nama', label: 'Nama Pasien', sortable: true },
                  { key: 'jenis_kelamin', label: 'Gender', filterable: true },
                  { key: 'golongan_darah', label: 'Gol. Darah', render: (v: any) => v || 'O' },
                  { key: 'alamat', label: 'Alamat Domisili', render: (v: any) => v || 'Kota Bandung, Jawa Barat' },
                  { key: 'status', label: 'Status Pasien', render: (v: any) => renderBadge(v || 'Aktif', 'emerald') }
                ]}
                data={pasien}
                pageSize={12}
              />
            </div>
          )}

          {/* SubTab: Data Sosial */}
          {activeSubTab === 'Data Sosial' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Master Data Sosial, Demografi & Kontak Darurat"
                columns={[
                  { key: 'no_rm', label: 'No. RM' },
                  { key: 'nama', label: 'Nama Pasien' },
                  { key: 'agama', label: 'Agama', render: (v: any) => v || 'Islam' },
                  { key: 'pekerjaan', label: 'Pekerjaan', render: (v: any) => v || 'Karyawan Swasta' },
                  { key: 'pendidikan', label: 'Pendidikan', render: (v: any) => v || 'SMA / Sederajat' },
                  { key: 'status_perkawinan', label: 'Status Nikah', render: (v: any) => v || 'Menikah' },
                  { key: 'suku_bangsa', label: 'Suku / Bahasa', render: (_: any, r: any) => `${r.suku_bangsa || 'Sunda/Jawa'} (${r.bahasa || 'Indonesia'})` },
                  { 
                    key: 'kontak_darurat', 
                    label: 'Kontak Darurat / Penanggung Jawab',
                    render: (_: any, r: any) => {
                      if (Array.isArray(r.kontak_darurat) && r.kontak_darurat.length > 0) {
                        return `${r.kontak_darurat[0].nama} (${r.kontak_darurat[0].hubungan || 'Keluarga'} - ${r.kontak_darurat[0].noHp || '-'})`;
                      }
                      return 'Keluarga Pasien (0812-3456-7890)';
                    }
                  }
                ]}
                data={pasien}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Data Penjamin */}
          {activeSubTab === 'Data Penjamin' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Master Data Kepesertaan & Penjamin Biaya Pasien"
                columns={[
                  { key: 'no_rm', label: 'No. RM' },
                  { key: 'nama', label: 'Nama Pasien' },
                  { key: 'penjamin', label: 'Jenis Penjamin', filterable: true, render: (v: any) => renderBadge(v || 'Umum', 'blue') },
                  { key: 'no_kartu_bpjs', label: 'No. Kartu BPJS / Polis', render: (v: any) => v || '0001234567890' },
                  { key: 'kelas_bpjs', label: 'Hak Kelas Rawat', render: (_: any, r: any) => r.penjamin === 'BPJS' ? 'Kelas 2' : 'Umum / VIP' },
                  { key: 'status_bpjs', label: 'Status Kepesertaan', render: () => <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/20 text-emerald-300">AKTIF (Terverifikasi)</span> }
                ]}
                data={pasien}
                pageSize={10}
              />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: REGISTRASI KUNJUNGAN                                           */}
      {/* ========================================================================= */}
      {activeSection === '2. Registrasi Kunjungan' && (
        <div className="flex flex-col gap-5">
          
          {/* SubTab: Rawat Jalan */}
          {activeSubTab === 'Rawat Jalan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Form Input Registrasi Rawat Jalan */}
              <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-700">
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Registrasi Rawat Jalan (Poliklinik)</h3>
                    <p className="text-xs text-slate-400">Pilih pasien dan poliklinik tujuan untuk cetak nomor antrian.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Pasien Terdaftar *</label>
                    <select
                      value={quickRegForm.pasienId}
                      onChange={e => setQuickRegForm({ ...quickRegForm, pasienId: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                    >
                      <option value="">-- Pilih Pasien Master ({pasien.length} Pasien) --</option>
                      {pasien.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.no_rm} - {p.nama} ({p.penjamin || 'Umum'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Poliklinik Spesialis *</label>
                      <select
                        value={quickRegForm.poliId}
                        onChange={e => {
                          const pId = e.target.value;
                          const foundDoc = dokter.find(d => d.poli_id === pId);
                          setQuickRegForm({ 
                            ...quickRegForm, 
                            poliId: pId,
                            dokterId: foundDoc ? foundDoc.id : quickRegForm.dokterId 
                          });
                        }}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                      >
                        {MASTER_POLI_LIST.map(p => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Dokter DPJP *</label>
                      <select
                        value={quickRegForm.dokterId}
                        onChange={e => setQuickRegForm({ ...quickRegForm, dokterId: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                      >
                        {dokter.map(d => (
                          <option key={d.id} value={d.id}>{d.nama}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Penjamin Biaya *</label>
                      <select
                        value={quickRegForm.penjaminId}
                        onChange={e => setQuickRegForm({ ...quickRegForm, penjaminId: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                      >
                        {penjamin.map(pj => (
                          <option key={pj.id} value={pj.id}>{pj.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Tipe Kunjungan</label>
                      <input
                        type="text"
                        readOnly
                        value="Rawat Jalan (Reguler)"
                        className="w-full p-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-slate-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Keluhan Utama / Alasan Kunjungan</label>
                    <textarea
                      rows={2}
                      value={quickRegForm.keluhanUtama}
                      onChange={e => setQuickRegForm({ ...quickRegForm, keluhanUtama: e.target.value })}
                      placeholder="Cth: Pemeriksaan rutin, kontrol tensi, pusing berputar..."
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-teal-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setQuickRegForm(prev => ({ ...prev, tipePelayanan: 'Rawat Jalan' }));
                      handleSaveQuickRegistration();
                    }}
                    className="w-full mt-2 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-teal-900/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Check className="w-4 h-4" />
                    <span>Daftarkan ke Rawat Jalan & Buat Antrian</span>
                  </button>
                </div>
              </div>

              {/* Tabel Pasien Rawat Jalan Terdaftar Hari Ini */}
              <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
                <ProfessionalTable
                  title="Daftar Kunjungan Rawat Jalan Hari Ini (Live Antrian)"
                  columns={[
                    { key: 'nomor_antrian', label: 'No. Antrian', sortable: true },
                    { key: 'no_rm', label: 'No. RM', sortable: true },
                    { key: 'nama_pasien', label: 'Nama Pasien', sortable: true },
                    { key: 'poli_nama', label: 'Poliklinik Tujuan', filterable: true },
                    { key: 'dokter_nama', label: 'Dokter DPJP' },
                    { key: 'status', label: 'Status', render: (v: any) => renderBadge(v || 'Menunggu', v === 'Selesai' ? 'emerald' : 'amber') },
                    {
                      key: 'actions',
                      label: 'Opsi',
                      render: (_: any, row: any) => (
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => callQueueAudio(row.nomor_antrian, 1)}
                            className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs"
                            title="Panggil Pasien"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVisit(row);
                              setShowCancelVisitModal(true);
                            }}
                            className="p-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg text-xs"
                            title="Batalkan Kunjungan"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    }
                  ]}
                  data={enrichedKunjungan.filter(k => k.tipe === 'Rawat Jalan')}
                  pageSize={8}
                />
              </div>

            </div>
          )}

          {/* SubTab: IGD */}
          {activeSubTab === 'IGD' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300">
                    <Ambulance className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Registrasi Instalasi Gawat Darurat (IGD 24 Jam)</h3>
                    <p className="text-xs text-slate-400">Pendaftaran cepat dengan triase scoring kegawatdaruratan otomatis.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Form Cepat Admisi IGD
                  </span>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Pasien / Input</label>
                    <select
                      value={quickRegForm.pasienId}
                      onChange={e => setQuickRegForm({ ...quickRegForm, pasienId: e.target.value })}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="">-- Pilih Pasien Master --</option>
                      {pasien.map(p => (
                        <option key={p.id} value={p.id}>{p.no_rm} - {p.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Kategori Triase</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setQuickRegForm({ ...quickRegForm, triase: 'Merah' })}
                        className={`p-2 rounded-lg text-xs font-bold border ${
                          quickRegForm.triase === 'Merah' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        🔴 Merah (Resusitasi)
                      </button>
                      <button
                        onClick={() => setQuickRegForm({ ...quickRegForm, triase: 'Kuning' })}
                        className={`p-2 rounded-lg text-xs font-bold border ${
                          quickRegForm.triase === 'Kuning' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        🟡 Kuning (Urgent)
                      </button>
                      <button
                        onClick={() => setQuickRegForm({ ...quickRegForm, triase: 'Hijau' })}
                        className={`p-2 rounded-lg text-xs font-bold border ${
                          quickRegForm.triase === 'Hijau' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        🟢 Hijau (Non-urgent)
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuickRegForm(prev => ({ ...prev, tipePelayanan: 'IGD', poliId: 'POL-IGD' }));
                      handleSaveQuickRegistration();
                    }}
                    className="w-full mt-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg"
                  >
                    Daftarkan Pasien ke IGD
                  </button>
                </div>

                <div className="md:col-span-2">
                  <ProfessionalTable
                    title="Pasien Aktif IGD Hari Ini"
                    columns={[
                      { key: 'nomor_antrian', label: 'No. IGD' },
                      { key: 'no_rm', label: 'No. RM' },
                      { key: 'nama_pasien', label: 'Nama Pasien' },
                      { key: 'penjamin_nama', label: 'Penjamin' },
                      { key: 'status', label: 'Status', render: (v: any) => renderBadge(v || 'IGD Aktif', 'rose') }
                    ]}
                    data={enrichedKunjungan.filter(k => k.tipe === 'IGD')}
                    pageSize={5}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Rawat Inap */}
          {activeSubTab === 'Rawat Inap' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Admisi & Pendaftaran Rawat Inap (Ranap)</h3>
                  <p className="text-xs text-slate-400">Pemesanan bed, kamar bangsal perawatan, dan dokter penanggung jawab.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col gap-3">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Bed className="w-4 h-4" /> Form Admisi Kamar Inap
                  </span>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Pasien</label>
                    <select
                      value={quickRegForm.pasienId}
                      onChange={e => setQuickRegForm({ ...quickRegForm, pasienId: e.target.value })}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="">-- Pilih Pasien Master --</option>
                      {pasien.map(p => (
                        <option key={p.id} value={p.id}>{p.no_rm} - {p.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Bangsal / Kelas</label>
                    <select
                      value={quickRegForm.ruangan}
                      onChange={e => setQuickRegForm({ ...quickRegForm, ruangan: e.target.value })}
                      className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="Bangsal Melati (Kelas 2)">Bangsal Melati (Kelas 2)</option>
                      <option value="Bangsal Mawar (Kelas 1)">Bangsal Mawar (Kelas 1)</option>
                      <option value="Paviliun VIP Cendana">Paviliun VIP Cendana</option>
                      <option value="Ruang ICU Sentral">Ruang ICU Sentral</option>
                      <option value="Bangsal Anggrek (Kelas 3 PBI)">Bangsal Anggrek (Kelas 3 PBI)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setQuickRegForm(prev => ({ ...prev, tipePelayanan: 'Rawat Inap' }));
                      handleSaveQuickRegistration();
                    }}
                    className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg"
                  >
                    Daftarkan Admisi Ranap
                  </button>
                </div>

                <div className="md:col-span-2">
                  <ProfessionalTable
                    title="Daftar Pasien Admisi Rawat Inap Aktif"
                    columns={[
                      { key: 'no_rm', label: 'No. RM' },
                      { key: 'nama_pasien', label: 'Nama Pasien' },
                      { key: 'penjamin_nama', label: 'Penjamin' },
                      { key: 'tanggal', label: 'Tgl Masuk' },
                      { key: 'status', label: 'Status', render: (v: any) => renderBadge(v || 'Dirawat', 'purple') }
                    ]}
                    data={enrichedKunjungan.filter(k => k.tipe === 'Rawat Inap')}
                    pageSize={5}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SubTab: Poli (Monitoring per Poliklinik) */}
          {activeSubTab === 'Poli' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                Monitoring Registrasi Pasien di 24 Poliklinik Spesialis
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {MASTER_POLI_LIST.map(p => {
                  const count = enrichedKunjungan.filter(k => k.poli_id === p.id).length;
                  return (
                    <div key={p.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 hover:border-teal-500/50 transition-all flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{p.nama}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-bold">{p.kode}</span>
                      </div>
                      <div className="flex justify-between items-end mt-3">
                        <span className="text-[11px] text-slate-400">Total Antrian:</span>
                        <span className="text-lg font-bold text-teal-300 font-mono">{count} Pasien</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SubTab: Dokter */}
          {activeSubTab === 'Dokter' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Rekapitulasi Kunjungan Pasien per Dokter DPJP"
                columns={[
                  { key: 'nama', label: 'Nama Dokter Spesialis' },
                  { key: 'spesialisasi', label: 'Spesialisasi' },
                  { key: 'poli_nama', label: 'Poliklinik' },
                  { key: 'jadwal', label: 'Jadwal Praktek', render: (v: any) => v || 'Senin - Jumat (08:00 - 14:00)' },
                  { key: 'status', label: 'Status Jaga', render: (v: any) => renderBadge(v || 'Praktek Aktif', 'emerald') }
                ]}
                data={dokter}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Penjamin */}
          {activeSubTab === 'Penjamin' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Rekapitulasi Pendaftaran Berdasarkan Kelompok Penjamin"
                columns={[
                  { key: 'nama', label: 'Nama Penjamin' },
                  { key: 'tipe', label: 'Kategori Penjamin', render: (v: any) => renderBadge(v, 'teal') },
                  { 
                    key: 'count', 
                    label: 'Total Kunjungan Terdaftar', 
                    render: (_: any, r: any) => {
                      const count = enrichedKunjungan.filter(k => k.penjamin_id === r.id || k.penjamin_nama?.toLowerCase().includes(r.nama.toLowerCase().split(' ')[0])).length;
                      return <span className="font-bold font-mono text-cyan-300">{count} Pasien</span>;
                    } 
                  }
                ]}
                data={penjamin}
                pageSize={10}
              />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ANTRIAN & LOKET                                                */}
      {/* ========================================================================= */}
      {activeSection === '3. Antrian' && (
        <div className="flex flex-col gap-5">
          
          {/* SubTab: Nomor Antrian (Display Board) */}
          {activeSubTab === 'Nomor Antrian' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
                <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ListOrdered className="w-5 h-5 text-amber-400" />
                      Display Antrian Pendaftaran & Poliklinik Real-Time
                    </h3>
                    <p className="text-xs text-slate-400">Tekan tombol panggil audio untuk memanggil pasien ke loket.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {Object.entries(loketStatus).map(([loketId, info]) => (
                    <div key={loketId} className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">LOKET {loketId}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">{info.status}</span>
                      </div>
                      <div className="text-center my-4">
                        <span className="text-[11px] text-slate-400">Nomor Antrian Aktif</span>
                        <div className="text-4xl font-black text-white font-mono tracking-wider mt-1 text-cyan-300">{info.activeNo}</div>
                        <span className="text-xs text-slate-400 mt-1 block">{info.petugas}</span>
                      </div>
                      <button
                        onClick={() => callQueueAudio(info.activeNo, loketId)}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Panggil Suara (Ding-Dong)</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Antrian List */}
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
                <ProfessionalTable
                  title="Daftar Antrian Berjalan Hari Ini"
                  columns={[
                    { key: 'nomor_antrian', label: 'No. Antrian', sortable: true },
                    { key: 'nama_pasien', label: 'Nama Pasien', sortable: true },
                    { key: 'poli_nama', label: 'Poli Tujuan' },
                    { key: 'penjamin_nama', label: 'Penjamin' },
                    { key: 'status', label: 'Status Antrian', render: (v: any) => renderBadge(v || 'Menunggu', v === 'Selesai' ? 'emerald' : 'amber') },
                    {
                      key: 'call',
                      label: 'Panggil',
                      render: (_: any, r: any) => (
                        <button
                          onClick={() => callQueueAudio(r.nomor_antrian, 1)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Panggil</span>
                        </button>
                      )
                    }
                  ]}
                  data={enrichedKunjungan}
                  pageSize={8}
                />
              </div>
            </div>
          )}

          {/* SubTab: Loket Admisi */}
          {activeSubTab === 'Loket' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                Manajemen & Konfigurasi 4 Loket Admisi Pendaftaran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(loketStatus).map(([id, info]) => (
                  <div key={id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Loket {id} ({info.petugas})</h4>
                      <p className="text-xs text-slate-400">Nomor saat ini: <strong className="text-amber-300 font-mono">{info.activeNo}</strong></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const nextNum = parseInt(info.activeNo.split('-')[1] || '1') + 1;
                          const prefix = info.activeNo.split('-')[0];
                          const newNo = `${prefix}-${String(nextNum).padStart(3, '0')}`;
                          setLoketStatus(prev => ({
                            ...prev,
                            [Number(id)]: { ...prev[Number(id)], activeNo: newNo }
                          }));
                          callQueueAudio(newNo, id);
                        }}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                      >
                        Berikutnya ⏩
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab: Poli Antrian */}
          {activeSubTab === 'Poli' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Monitoring Antrian per Poliklinik Spesialis"
                columns={[
                  { key: 'nama', label: 'Nama Poliklinik' },
                  { key: 'kode', label: 'Kode Antrian' },
                  { key: 'kapasitas', label: 'Kapasitas Harian' },
                  {
                    key: 'current_queue',
                    label: 'Antrian Berjalan',
                    render: (_: any, r: any) => {
                      const poliQueues = enrichedKunjungan.filter(k => k.poli_id === r.id);
                      return <span className="font-mono font-bold text-teal-300">{poliQueues.length} Pasien</span>;
                    }
                  }
                ]}
                data={MASTER_POLI_LIST}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Dokter Antrian */}
          {activeSubTab === 'Dokter' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Monitoring Antrian per Dokter yang Bertugas"
                columns={[
                  { key: 'nama', label: 'Nama Dokter DPJP' },
                  { key: 'spesialisasi', label: 'Spesialisasi' },
                  { key: 'status_jaga', label: 'Status Jaga', render: (v: any) => v || 'Sedang Praktek' },
                  {
                    key: 'count',
                    label: 'Pasien Terdaftar',
                    render: (_: any, r: any) => {
                      const count = enrichedKunjungan.filter(k => k.dokter_id === r.id).length;
                      return <span className="font-bold font-mono text-amber-300">{count} Orang</span>;
                    }
                  }
                ]}
                data={dokter}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Status Antrian */}
          {activeSubTab === 'Status' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Status Antrian Pasien Lengkap (Update Status Real-time)"
                columns={[
                  { key: 'nomor_antrian', label: 'No. Antrian' },
                  { key: 'nama_pasien', label: 'Nama Pasien' },
                  { key: 'poli_nama', label: 'Poli' },
                  { key: 'status', label: 'Status', render: (v: any) => renderBadge(v || 'Menunggu', v === 'Selesai' ? 'emerald' : 'amber') },
                  {
                    key: 'change_status',
                    label: 'Ubah Status',
                    render: (_: any, r: any) => (
                      <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            updateKunjunganStatus(r.id, 'Panggil');
                            toast.success(`Status pasien ${r.nama_pasien} diubah ke Dipanggil`);
                          }}
                          className="px-2 py-1 bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white rounded text-[11px] font-bold"
                        >
                          Panggil
                        </button>
                        <button
                          onClick={() => {
                            updateKunjunganStatus(r.id, 'Diperiksa');
                            toast.success(`Status pasien ${r.nama_pasien} diubah ke Diperiksa`);
                          }}
                          className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded text-[11px] font-bold"
                        >
                          Periksa
                        </button>
                        <button
                          onClick={() => {
                            updateKunjunganStatus(r.id, 'Selesai');
                            toast.success(`Status pasien ${r.nama_pasien} diubah ke Selesai`);
                          }}
                          className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[11px] font-bold"
                        >
                          Selesai
                        </button>
                      </div>
                    )
                  }
                ]}
                data={enrichedKunjungan}
                pageSize={10}
              />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: RIWAYAT PENDAFTARAN                                            */}
      {/* ========================================================================= */}
      {activeSection === '4. Riwayat Pendaftaran' && (
        <div className="flex flex-col gap-4">
          
          {/* SubTab: Kunjungan */}
          {activeSubTab === 'Kunjungan' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Riwayat Lengkap Pendaftaran & Kunjungan Pasien RS"
                columns={[
                  { key: 'tanggal', label: 'Tanggal', sortable: true },
                  { key: 'nomor_antrian', label: 'No. Antrian', sortable: true },
                  { key: 'no_rm', label: 'No. RM', sortable: true },
                  { key: 'nama_pasien', label: 'Nama Pasien', sortable: true },
                  { key: 'tipe', label: 'Layanan', render: (v: any) => renderBadge(v || 'Rawat Jalan', 'teal') },
                  { key: 'poli_nama', label: 'Poliklinik / Ruangan' },
                  { key: 'dokter_nama', label: 'Dokter DPJP' },
                  { key: 'penjamin_nama', label: 'Penjamin', render: (v: any) => renderBadge(v || 'Umum', 'blue') },
                  { key: 'status', label: 'Status', render: (v: any) => renderBadge(v || 'Menunggu', v === 'Selesai' ? 'emerald' : 'amber') },
                  {
                    key: 'print',
                    label: 'Bukti Registrasi',
                    render: (_: any, r: any) => (
                      <div onClick={e => e.stopPropagation()}>
                        <PrintPDFButton
                          documentData={{
                            nomor: r.nomor_antrian,
                            no_rm: r.no_rm,
                            nama: r.nama_pasien,
                            tanggal: r.tanggal,
                            unit_pelayanan: r.poli_nama,
                            dokter: r.dokter_nama,
                            penjamin: r.penjamin_nama,
                            status: r.status
                          }}
                          docType="general"
                          filename={`Bukti_Registrasi_${r.nomor_antrian}`}
                          label="Cetak"
                          title="BUKTI REGISTRASI & KARTU KUNJUNGAN RS"
                          className="py-1 px-2.5 text-xs font-semibold"
                        />
                      </div>
                    )
                  }
                ]}
                data={enrichedKunjungan}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Status Pelayanan */}
          {activeSubTab === 'Status' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Rekapitulasi Riwayat Berdasarkan Status Pelayanan Pasien"
                columns={[
                  { key: 'nomor_antrian', label: 'No. Antrian' },
                  { key: 'nama_pasien', label: 'Nama Pasien' },
                  { key: 'poli_nama', label: 'Poli' },
                  { key: 'status', label: 'Status Pelayanan', filterable: true, render: (v: any) => renderBadge(v || 'Menunggu', v === 'Selesai' ? 'emerald' : 'amber') },
                  { key: 'tanggal', label: 'Tanggal' }
                ]}
                data={enrichedKunjungan}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Penjamin */}
          {activeSubTab === 'Penjamin' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl">
              <ProfessionalTable
                title="Rekapitulasi Riwayat Pendaftaran Berdasarkan Penjamin Biaya"
                columns={[
                  { key: 'nama_pasien', label: 'Nama Pasien' },
                  { key: 'no_rm', label: 'No. RM' },
                  { key: 'penjamin_nama', label: 'Kelompok Penjamin', filterable: true, render: (v: any) => renderBadge(v || 'Umum', 'blue') },
                  { key: 'poli_nama', label: 'Unit Layanan' },
                  { key: 'tanggal', label: 'Tanggal' }
                ]}
                data={enrichedKunjungan}
                pageSize={10}
              />
            </div>
          )}

          {/* SubTab: Riwayat Pembatalan */}
          {activeSubTab === 'Riwayat Pembatalan' && (
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 shadow-xl flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-700">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <X className="w-5 h-5 text-rose-400" />
                    Log & Riwayat Pembatalan Pendaftaran Pasien
                  </h3>
                  <p className="text-xs text-slate-400">Catatan pembatalan kunjungan dengan audit alasan dan opsi pemulihan antrian.</p>
                </div>
              </div>

              {(() => {
                const cancelLogs = JSON.parse(localStorage.getItem('hospital_riwayat_pembatalan') || '[]');
                if (cancelLogs.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-700 text-slate-400 text-sm">
                      Belum ada riwayat pembatalan kunjungan pendaftaran.
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-900 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Waktu Batal</th>
                          <th className="p-3">No. Antrian</th>
                          <th className="p-3">No. RM</th>
                          <th className="p-3">Nama Pasien</th>
                          <th className="p-3">Unit Pelayanan</th>
                          <th className="p-3">Alasan Pembatalan</th>
                          <th className="p-3">Opsi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {cancelLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-slate-700/30">
                            <td className="p-3 text-xs text-slate-400">{log.waktu_batal}</td>
                            <td className="p-3 font-mono font-bold text-amber-300">{log.nomor_antrian}</td>
                            <td className="p-3 font-mono text-slate-300">{log.no_rm}</td>
                            <td className="p-3 font-bold text-white">{log.nama_pasien}</td>
                            <td className="p-3 text-slate-300">{log.poli}</td>
                            <td className="p-3 text-rose-300 text-xs">{log.alasan}</td>
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  updateKunjunganStatus(log.kunjungan_id, 'Menunggu');
                                  const updatedLogs = cancelLogs.filter((l: any) => l.id !== log.id);
                                  localStorage.setItem('hospital_riwayat_pembatalan', JSON.stringify(updatedLogs));
                                  toast.success(`Antrian ${log.nomor_antrian} berhasil dipulihkan kembali!`);
                                }}
                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Pulihkan</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                            */}
      {/* ========================================================================= */}

      {/* MODAL 1: Quick Register Visit Modal */}
      {showQuickRegisterModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Registrasi Kunjungan Cepat</h3>
              </div>
              <button onClick={() => setShowQuickRegisterModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Pasien Terdaftar *</label>
                <select
                  value={quickRegForm.pasienId}
                  onChange={e => setQuickRegForm({ ...quickRegForm, pasienId: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="">-- Pilih Pasien ({pasien.length} Master) --</option>
                  {pasien.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} - {p.nama} ({p.penjamin || 'Umum'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Layanan Tujuan *</label>
                  <select
                    value={quickRegForm.tipePelayanan}
                    onChange={e => setQuickRegForm({ ...quickRegForm, tipePelayanan: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Rawat Jalan">Rawat Jalan (Poli)</option>
                    <option value="IGD">IGD (Gawat Darurat)</option>
                    <option value="Rawat Inap">Rawat Inap (Admisi)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Poliklinik Tujuan *</label>
                  <select
                    value={quickRegForm.poliId}
                    onChange={e => setQuickRegForm({ ...quickRegForm, poliId: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {MASTER_POLI_LIST.map(p => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dokter DPJP *</label>
                  <select
                    value={quickRegForm.dokterId}
                    onChange={e => setQuickRegForm({ ...quickRegForm, dokterId: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {dokter.map(d => (
                      <option key={d.id} value={d.id}>{d.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Penjamin *</label>
                  <select
                    value={quickRegForm.penjaminId}
                    onChange={e => setQuickRegForm({ ...quickRegForm, penjaminId: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {penjamin.map(pj => (
                      <option key={pj.id} value={pj.id}>{pj.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Keluhan Pasien</label>
                <textarea
                  rows={2}
                  value={quickRegForm.keluhanUtama}
                  onChange={e => setQuickRegForm({ ...quickRegForm, keluhanUtama: e.target.value })}
                  placeholder="Keluhan utama atau alasan periksa..."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-3 flex justify-end gap-2.5">
              <button
                onClick={() => setShowQuickRegisterModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveQuickRegistration}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Daftarkan & Generate Antrian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Patient Modal */}
      {showEditPatientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
            {/* HEADER */}
            <div className="p-5 flex justify-between items-center border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">Edit Master Data Pasien</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/30">
                      RME Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    No. RM: <span className="font-mono font-bold text-cyan-400">{editPatientForm.no_rm || editPatientForm.id || '-'}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditPatientModal(false)} 
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Nama Lengkap Pasien <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editPatientForm.nama || ''}
                    onChange={e => setEditPatientForm({ ...editPatientForm, nama: e.target.value })}
                    placeholder="Nama lengkap sesuai KTP"
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={editPatientForm.nik || ''}
                    onChange={e => setEditPatientForm({ ...editPatientForm, nik: e.target.value })}
                    placeholder="16 Digit NIK"
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white font-mono outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    No. HP / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editPatientForm.no_hp || editPatientForm.telepon || ''}
                    onChange={e => setEditPatientForm({ ...editPatientForm, no_hp: e.target.value, telepon: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Penjamin Biaya
                  </label>
                  <select
                    value={editPatientForm.penjamin || 'BPJS Kesehatan'}
                    onChange={e => setEditPatientForm({ ...editPatientForm, penjamin: e.target.value })}
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white outline-none transition-all"
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan (JKN)</option>
                    <option value="Umum / Mandiri">Umum / Mandiri</option>
                    <option value="Asuransi Inhealth">Asuransi Inhealth</option>
                    <option value="Asuransi Allianz Care">Asuransi Allianz Care</option>
                    <option value="PT Pertamina (Persero)">PT Pertamina (Persero)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Golongan Darah
                  </label>
                  <select
                    value={editPatientForm.golongan_darah || 'O'}
                    onChange={e => setEditPatientForm({ ...editPatientForm, golongan_darah: e.target.value })}
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white outline-none transition-all"
                  >
                    <option value="A">Golongan Darah A</option>
                    <option value="B">Golongan Darah B</option>
                    <option value="AB">Golongan Darah AB</option>
                    <option value="O">Golongan Darah O</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                    Alamat Domisili Lengkap
                  </label>
                  <textarea
                    rows={2}
                    value={editPatientForm.alamat || ''}
                    onChange={e => setEditPatientForm({ ...editPatientForm, alamat: e.target.value })}
                    placeholder="Alamat jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                    className="w-full p-3 bg-slate-950/70 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs sm:text-sm text-white outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-slate-700/80 p-4 bg-slate-900/95 flex justify-end gap-2.5">
              <button 
                onClick={() => setShowEditPatientModal(false)} 
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors border border-slate-700 hover:bg-slate-700"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEditPatient} 
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-950/50 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Detail Patient View Modal */}
      {showDetailPatientModal && selectedPasien && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center text-xl font-bold">
                  👤
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedPasien.nama} ({selectedPasien.no_rm})</h3>
                  <p className="text-xs text-slate-400">NIK: {selectedPasien.nik || '-'} | Penjamin: {selectedPasien.penjamin || 'Umum'}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailPatientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Jenis Kelamin</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedPasien.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Tanggal Lahir</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedPasien.tanggal_lahir || selectedPasien.tgl_lahir || '-'}</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Golongan Darah</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedPasien.golongan_darah || 'O'} ({selectedPasien.rhesus || '+'})</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">No. Telepon / HP</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedPasien.no_hp || selectedPasien.telepon || '-'}</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Agama</span>
                <div className="text-sm font-bold text-white mt-0.5">{selectedPasien.agama || 'Islam'}</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[11px] text-slate-400">Status Pasien</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{selectedPasien.status || 'Aktif'}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400">Alamat Lengkap</span>
              <div className="text-sm text-slate-200 mt-0.5">{selectedPasien.alamat || 'Kota Bandung, Jawa Barat'}</div>
            </div>

            <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
              <PrintPDFButton
                documentData={{
                  nama: selectedPasien.nama,
                  no_rm: selectedPasien.no_rm,
                  nik: selectedPasien.nik,
                  jenis_kelamin: selectedPasien.jenis_kelamin,
                  no_hp: selectedPasien.no_hp || selectedPasien.telepon,
                  unit_pelayanan: 'Instalasi Admisi & Rekam Medis',
                  penjamin: selectedPasien.penjamin || 'BPJS Kesehatan',
                  alamat: selectedPasien.alamat || 'Kota Bandung'
                }}
                docType="general"
                filename={`Kartu_Pasien_${selectedPasien.no_rm}`}
                label="Cetak Kartu Berobat"
                title="KARTU BEROBAT & IDENTITAS PASIEN"
                className="py-2 px-4 text-xs font-bold"
              />
              <button
                onClick={() => {
                  setShowDetailPatientModal(false);
                  setQuickRegForm(prev => ({ ...prev, pasienId: selectedPasien.id }));
                  setShowQuickRegisterModal(true);
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Daftarkan ke Kunjungan Baru ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Cancel Visit Modal */}
      {showCancelVisitModal && selectedVisit && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Batalkan Pendaftaran Antrian</h3>
              </div>
              <button onClick={() => setShowCancelVisitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl text-xs text-rose-200">
              Apakah Anda yakin ingin membatalkan antrian <strong>{selectedVisit.nomor_antrian}</strong> untuk pasien <strong>{selectedVisit.nama_pasien}</strong> di <strong>{selectedVisit.poli_nama}</strong>?
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Alasan Pembatalan</label>
              <select
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Permintaan Pasien / Tidak Hadir">Permintaan Pasien / Tidak Hadir</option>
                <option value="Salah Pilih Poliklinik / Dokter">Salah Pilih Poliklinik / Dokter</option>
                <option value="Rujukan BPJS Tidak Berlaku / Habis">Rujukan BPJS Tidak Berlaku / Habis</option>
                <option value="Dokter Berhalangan Hadir / Kuota Penuh">Dokter Berhalangan Hadir / Kuota Penuh</option>
                <option value="Data Pasien Ganda (Duplikasi)">Data Pasien Ganda (Duplikasi)</option>
              </select>
            </div>

            <div className="border-t border-slate-700 pt-3 flex justify-end gap-2.5">
              <button onClick={() => setShowCancelVisitModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                Batal
              </button>
              <button onClick={handleConfirmCancelVisit} className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow">
                Konfirmasi Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Print Thermal Ticket Modal */}
      {showTicketModal && selectedVisit && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-sm shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="font-black text-base text-slate-900">RUMAH SAKIT UMUM MYITARU</h3>
              <p className="text-[11px] text-slate-500">Jl. Terusan Sehat No. 88, Bandung • Telp (022) 7654321</p>
            </div>

            <div className="text-center my-2">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">NOMOR ANTRIAN POLIKLINIK</span>
              <div className="text-5xl font-black text-blue-600 font-mono my-2">{selectedVisit.nomor_antrian}</div>
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-xs">
                {selectedVisit.tipe || 'Rawat Jalan'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex flex-col gap-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Pasien:</span>
                <span className="font-bold text-slate-900">{selectedVisit.pasien?.nama || 'Pasien'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Rekam Medis:</span>
                <span className="font-bold text-slate-900">{selectedVisit.pasien?.no_rm || selectedVisit.pasien_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poli Tujuan:</span>
                <span className="font-bold text-slate-900">{selectedVisit.poli_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Cetak:</span>
                <span className="text-slate-700">{new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 italic">
              *Harap menunggu panggilan suara di ruang tunggu poliklinik. Terima kasih.
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowTicketModal(false)}
                className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowTicketModal(false);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Thermal</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Registration;
