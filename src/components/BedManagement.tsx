import React, { useState, useEffect } from 'react';
import { 
  BedDouble, RefreshCw, Activity, ArrowRightLeft, Save, Clock, Stethoscope, 
  UserCheck, ShieldCheck, PhoneCall, Calendar, Plus, User, Search, Filter, 
  CheckCircle2, LogOut, FileText, UserPlus, HeartPulse
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Modal } from './Modal';
import { useToast } from '../contexts/ToastContext';
import { useHospital } from '../contexts/HospitalContext';
import { usePatientFlow } from '../contexts/PatientFlowContext';
import { generate50InpatientBeds } from '../data/patientPelayananData';
import { DATA_DOKTER_JAGA_LENGKAP } from '../data/dataDokterJagaLengkap';
import PrintPDFButton from './PrintPDFButton';
import { AdmisiRanapTab } from './Ranap/AdmisiRanapTab';
import { AsuhanKeperawatanTab } from './Ranap/AsuhanKeperawatanTab';
import { dischargePatientFromBed } from '../utils/interlineIntegration';

export function BedManagement() {
  const { activeTab } = useOutletContext<{ activeTab: string }>() || { activeTab: 'Ketersediaan Bed' };
  const { pasien, kunjungan: kunjunganMaster } = useHospital();
  const patientFlow = usePatientFlow();
  const toast = useToast();
  
  // Logical state initialization with LocalStorage persistence & automatic sync from Master Context
  const [beds, setBeds] = useState(() => {
    const saved = localStorage.getItem('simrs_bed_management');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      } catch (e) {
        console.warn('Error parsing simrs_bed_management:', e);
      }
    }
    return generate50InpatientBeds();
  });
  
  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('simrs_bed_management', JSON.stringify(beds));
  }, [beds]);

  // Real-time interline listener for admissions from IGD and Registration
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('simrs_bed_management');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 10) {
            setBeds(parsed);
          }
        }
      } catch (e) {
        console.warn('Bed sync error:', e);
      }
    };
    window.addEventListener('simrs-interline-sync', handleSync);
    return () => window.removeEventListener('simrs-interline-sync', handleSync);
  }, []);

  // Sync new Rawat Inap visits registered in Master Context if not already assigned a bed
  useEffect(() => {
    if (!kunjunganMaster || kunjunganMaster.length === 0) return;
    const ranapMasterVisits = kunjunganMaster.filter(k => 
      k.tipe === 'Rawat Inap' || (k as any).poli_nama?.toLowerCase().includes('inap') || (k as any).poli_nama?.toLowerCase().includes('bangsal')
    );

    let updated = false;
    const currentBeds = [...beds];

    ranapMasterVisits.forEach(km => {
      const isAlreadyOccupying = currentBeds.some(b => b.no_rm === km.pasien_id || b.patient === (km as any).nama_pasien);
      if (!isAlreadyOccupying) {
        const emptyBedIdx = currentBeds.findIndex(b => b.status === 'Kosong');
        if (emptyBedIdx !== -1) {
          const px = pasien.find(p => p.id === km.pasien_id || p.no_rm === km.pasien_id);
          currentBeds[emptyBedIdx] = {
            ...currentBeds[emptyBedIdx],
            status: 'Terisi',
            patient: px ? px.nama : ((km as any).nama_pasien || 'Pasien Ranap Baru'),
            nama_pasien: px ? px.nama : ((km as any).nama_pasien || 'Pasien Ranap Baru'),
            no_rm: px ? px.no_rm : `RM-RN-${Math.floor(Math.random() * 9000 + 1000)}`,
            diagnosa: (km as any).keluhan || 'Perawatan Medis Rawat Inap',
            dpjp: (km as any).dokter_nama || 'dr. Hendra Pratama, Sp.PD',
            penjamin: px?.penjamin || 'BPJS Kesehatan',
            tgl_masuk: (km as any).tanggal || new Date().toISOString().split('T')[0]
          };
          updated = true;
        }
      }
    });

    if (updated) {
      setBeds(currentBeds);
    }
  }, [kunjunganMaster, pasien]);

  // Modal & Search States
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isIsiBedModalOpen, setIsIsiBedModalOpen] = useState(false);
  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [targetBedId, setTargetBedId] = useState('');
  const [selectedPasienId, setSelectedPasienId] = useState('');
  const [filterClass, setFilterClass] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form registration state
  const [regForm, setRegForm] = useState({
    no_rm: '',
    patient: '',
    diagnosa: '',
    dpjp: 'dr. Hendra Pratama, Sp.PD',
    penjamin: 'BPJS Kesehatan',
    bed_id: ''
  });

  // Action: Populate bed manually or from master patient dropdown
  const handleAssignBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.patient) return toast.error('Nama pasien wajib diisi');
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const targetBed = regForm.bed_id || (selectedBed ? selectedBed.id : beds.find((b: any) => b.status === 'Kosong')?.id);
    if (!targetBed) {
      toast.error('Tidak ada bed kosong yang tersedia');
      setIsSubmitting(false);
      return;
    }

    const updatedBeds = beds.map((b: any) => {
      if (b.id === targetBed) {
        return {
          ...b,
          status: 'Terisi',
          patient: regForm.patient,
          nama_pasien: regForm.patient,
          no_rm: regForm.no_rm || `RM-RN-${Math.floor(Math.random() * 9000 + 1000)}`,
          diagnosa: regForm.diagnosa || 'Observasi Rawat Inap',
          dpjp: regForm.dpjp,
          penjamin: regForm.penjamin,
          tgl_masuk: new Date().toISOString().split('T')[0]
        };
      }
      return b;
    });

    setBeds(updatedBeds);
    toast.success(`Pasien ${regForm.patient} berhasil ditempatkan di Bed ${targetBed}`);
    setIsSubmitting(false);
    setIsIsiBedModalOpen(false);
    setRegForm({ no_rm: '', patient: '', diagnosa: '', dpjp: 'dr. Hendra Pratama, Sp.PD', penjamin: 'BPJS Kesehatan', bed_id: '' });
  };

  // Action: Move Bed
  const handleMoveBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed || !targetBedId) return;

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const targetBed = beds.find((b: any) => b.id === targetBedId);
    if (!targetBed || targetBed.status !== 'Kosong') {
      toast.error('Bed tujuan tidak valid atau sedang terisi!');
      setIsSubmitting(false);
      return;
    }

    const updatedBeds = beds.map((b: any) => {
      if (b.id === selectedBed.id) {
        return { ...b, status: 'Dibersihkan', patient: null, nama_pasien: null, no_rm: null, diagnosa: null, dpjp: null };
      }
      if (b.id === targetBedId) {
        return {
          ...b,
          status: 'Terisi',
          patient: selectedBed.patient || selectedBed.nama_pasien,
          nama_pasien: selectedBed.patient || selectedBed.nama_pasien,
          no_rm: selectedBed.no_rm,
          diagnosa: selectedBed.diagnosa,
          dpjp: selectedBed.dpjp,
          penjamin: selectedBed.penjamin
        };
      }
      return b;
    });

    setBeds(updatedBeds);
    toast.success(`Pasien ${selectedBed.patient} berhasil dipindahkan dari Bed ${selectedBed.id} ke Bed ${targetBedId}`);
    setIsSubmitting(false);
    setIsMoveModalOpen(false);
  };

  // Action: Discharge Patient / Pulang
  const handleDischargePatient = async () => {
    if (!selectedBed) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 300));

    const updatedBeds = beds.map((b: any) => {
      if (b.id === selectedBed.id) {
        return { ...b, status: 'Dibersihkan', patient: null, nama_pasien: null, no_rm: null, diagnosa: null, dpjp: null };
      }
      return b;
    });

    setBeds(updatedBeds);

    // Interline Integration for Discharge (Billing Ranap accommodation & Patient Flow)
    dischargePatientFromBed({
      bedId: selectedBed.id,
      no_rm: selectedBed.no_rm || selectedBed.patient,
      kondisiPulang: 'Perbaikan'
    });

    toast.success(`Pasien ${selectedBed.patient} telah disetujui pulang (Discharged). Biaya rawat inap dikirim ke Kasir & Bed masuk antrian pembersihan.`);
    setIsSubmitting(false);
    setIsDischargeModalOpen(false);
  };

  // Action: Mark Bed as Cleaned/Ready
  const markCleaned = (bedId: string) => {
    setBeds(beds.map((b: any) => b.id === bedId ? { ...b, status: 'Kosong' } : b));
    toast.success(`Bed ${bedId} siap digunakan kembali!`);
  };

  const stats = {
    total: beds.length,
    kosong: beds.filter((b: any) => b.status === 'Kosong').length,
    terisi: beds.filter((b: any) => b.status === 'Terisi').length,
    dibersihkan: beds.filter((b: any) => b.status === 'Dibersihkan').length,
  };

  // Filtered beds
  const filteredBeds = beds.filter((b: any) => {
    const matchClass = filterClass === 'Semua' || b.class === filterClass || b.kelas === filterClass;
    const matchStatus = filterStatus === 'Semua' || b.status === filterStatus;
    const matchSearch = searchQuery === '' || 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.patient && b.patient.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.no_rm && b.no_rm.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchClass && matchStatus && matchSearch;
  });

  const handleAssignBedFromAdmisi = (bedId: string, patientData: any) => {
    const updated = beds.map((b: any) => {
      if (b.id === bedId) {
        return {
          ...b,
          status: 'Terisi',
          patient: patientData.patient,
          nama_pasien: patientData.patient,
          no_rm: patientData.no_rm,
          diagnosa: patientData.diagnosa,
          dpjp: patientData.doctor || 'dr. Hendra Pratama, Sp.PD',
          penjamin: patientData.penjamin || 'BPJS Kesehatan',
          masuk: patientData.masuk || new Date().toISOString().split('T')[0]
        };
      }
      return b;
    });
    setBeds(updated);
  };

  // =========================================================================
  // SUBMENU 0: ADMISI RANAP
  // =========================================================================
  if (activeTab === 'Admisi') {
    return (
      <div className="p-6 h-full overflow-y-auto custom-scrollbar">
        <AdmisiRanapTab beds={beds} onAssignBed={handleAssignBedFromAdmisi} />
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 0.5: ASUHAN KEPERAWATAN (ASKEP & TTV)
  // =========================================================================
  if (activeTab === 'Asuhan Keperawatan') {
    return (
      <div className="p-6 h-full overflow-y-auto custom-scrollbar">
        <AsuhanKeperawatanTab beds={beds} />
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 1: DOKTER RANAP & VISITE
  // =========================================================================
  if (activeTab === 'Dokter Ranap' || activeTab === 'Visite') {
    const ranapDoctors = DATA_DOKTER_JAGA_LENGKAP.filter(d => 
      d.layanan_utama === 'Rawat Inap (Bangsal & DPJP)' || 
      d.unit_tugas.toLowerCase().includes('inap') || 
      d.peran.toLowerCase().includes('dpjp') || 
      d.peran.toLowerCase().includes('visite')
    );

    return (
      <div className="p-6 h-full space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-indigo-400" />
              Dokter Penanggung Jawab Pelayanan (DPJP) & Dokter Jaga Bangsal
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Jadwal Visite Pagi (06:30 - 08:30 WIB) & Sore (16:30 - 18:00 WIB) beserta Dokter Jaga Bangsal 24 Jam.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/30 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Sesi: Visite Pagi DPJP & Shift Siang Bangsal
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> {ranapDoctors.length} Dokter DPJP Terjadwal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ranapDoctors.map((doc) => (
            <div key={doc.id} className="bg-slate-800/90 border border-slate-700 hover:border-indigo-500/40 p-4 rounded-xl transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
                    {doc.spesialisasi}
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    {doc.status_kehadiran}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">{doc.nama}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{doc.peran}</p>

                <div className="mt-3 text-xs text-slate-300 space-y-1.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Jadwal Visite: <strong className="text-slate-200">{doc.hari_praktik} ({doc.jam_praktik})</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kontak Jaga: <strong className="text-slate-200">{doc.kontak_darurat}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Bangsal: {doc.ruangan}</span>
                <span className="font-mono text-cyan-400 font-bold">{doc.sip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 2: DISCHARGE PLANNING / RENCANA PEMULANGAN
  // =========================================================================
  if (activeTab === 'Discharge Planning') {
    const occupiedBeds = beds.filter((b: any) => b.status === 'Terisi');

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <LogOut className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              Discharge Planning & Rencana Pemulangan Pasien
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Verifikasi kriteria pemulangan pasien rawat inap, persetujuan DPJP, resume medis, dan pelepasan bed.
            </p>
          </div>
          <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800">
            {occupiedBeds.length} Pasien Dalam Perawatan Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {occupiedBeds.map((b: any) => (
            <div key={b.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs rounded-lg border border-indigo-200 dark:border-indigo-800">
                    Bed {b.id} ({b.room})
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {b.class || b.kelas}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">{b.patient || b.nama_pasien}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>RM: <strong className="text-slate-700 dark:text-slate-200">{b.no_rm}</strong></span>
                  <span>•</span>
                  <span>Tgl Masuk: {b.tgl_masuk || '2026-08-28'}</span>
                </div>

                <div className="mt-4 space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">DPJP Utama:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{b.dpjp || 'dr. Hendra Pratama, Sp.PD'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Diagnosa Akhir:</span>
                    <span className="text-slate-700 dark:text-slate-300">{b.diagnosa || 'Perawatan Medis Terintegrasi'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <button
                  onClick={() => { setSelectedBed(b); setIsDischargeModalOpen(true); }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Proses Discharge
                </button>
                <PrintPDFButton
                  documentData={{
                    nama: b.patient || b.nama_pasien,
                    no_rm: b.no_rm,
                    unit_pelayanan: 'Instalasi Rawat Inap (Bangsal)',
                    ruangan: `${b.room} - Bed ${b.id} (${b.class || b.kelas})`,
                    tipe_kunjungan: 'Rawat Inap',
                    penjamin: b.penjamin || 'BPJS Kesehatan',
                    keluhan: b.diagnosa,
                    diagnosis_utama: b.diagnosa || 'Ranap Pasca Stabilisasi',
                    edukasi_instruksi: 'Kontrol ulang ke Poliklinik sesuai tanggal rujukan balik. Lanjutkan obat pulang secara teratur.'
                  }}
                  docType="resume_medis"
                  filename={`Resume_Ranap_${b.no_rm}_${b.patient}`}
                  label="Resume PDF"
                  title="RESUME MEDIS DISCHARGE RAWAT INAP"
                  className="py-1.5 px-3 text-xs font-bold"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 3: MAIN BED MANAGEMENT DASHBOARD & REGISTRATION
  // =========================================================================
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BedDouble className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Manajemen Tempat Tidur & Bangsal Rawat Inap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Peta visual ketersediaan bed, registrasi admisi rawat inap, dan alokasi tempat tidur pasien real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsIsiBedModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" /> Admisi Pasien Ranap
          </button>
        </div>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Total Kapasitas Bed</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{stats.total} Bed</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Bed Ready (Kosong)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{stats.kosong} Bed</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Bed Terisi Pasien</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5 block">{stats.terisi} Bed</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Pembersihan / Sterilisasi</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">{stats.dibersihkan} Bed</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <Filter className="w-4 h-4 text-indigo-500" /> Kelas:
          </div>
          {['Semua', 'VVIP', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3'].map((cls) => (
            <button
              key={cls}
              onClick={() => setFilterClass(cls)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterClass === cls 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Semua">Semua Status Bed</option>
            <option value="Kosong">🟩 Kosong (Ready)</option>
            <option value="Terisi">🟥 Terisi Pasien</option>
            <option value="Dibersihkan">🟨 Dibersihkan</option>
          </select>

          <div className="relative w-48 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari Bed, Pasien..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((b: any) => (
          <div 
            key={b.id} 
            className={`rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
              b.status === 'Kosong' 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60' :
              b.status === 'Terisi' 
                ? 'bg-white dark:bg-slate-800 border-rose-300 dark:border-rose-900/60' :
                  'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                  Bed {b.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  b.status === 'Kosong' ? 'bg-emerald-500 text-white' :
                  b.status === 'Terisi' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {b.status}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{b.room}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{b.class || b.kelas}</div>

              {b.status === 'Terisi' ? (
                <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">{b.patient || b.nama_pasien}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">RM: {b.no_rm}</div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate">DPJP: {b.dpjp || 'dr. Hendra, Sp.PD'}</div>
                </div>
              ) : b.status === 'Dibersihkan' ? (
                <div className="mt-3 bg-amber-100/60 dark:bg-amber-950/40 p-2.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Sedang dalam proses sterilisasi oleh tim saniter RS.
                </div>
              ) : (
                <div className="mt-3 bg-emerald-100/60 dark:bg-emerald-950/40 p-2.5 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                  Bed Siap Huni & Steril.
                </div>
              )}
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end gap-1.5">
              {b.status === 'Terisi' && (
                <>
                  <button 
                    onClick={() => { setSelectedBed(b); setIsMoveModalOpen(true); }}
                    className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 font-bold text-xs flex items-center gap-1"
                    title="Pindah Bed Pasien"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Pindah
                  </button>
                  <button 
                    onClick={() => { setSelectedBed(b); setIsDischargeModalOpen(true); }}
                    className="p-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 rounded-lg hover:bg-rose-100 font-bold text-xs flex items-center gap-1"
                    title="Pemulangan Pasien"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Discharge
                  </button>
                </>
              )}

              {b.status === 'Kosong' && (
                <button 
                  onClick={() => { setRegForm({ ...regForm, bed_id: b.id }); setIsIsiBedModalOpen(true); }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Admisi Ke Bed Ini
                </button>
              )}

              {b.status === 'Dibersihkan' && (
                <button 
                  onClick={() => markCleaned(b.id)}
                  className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ADMISI PASIEN RANAP */}
      <Modal isOpen={isIsiBedModalOpen} onClose={() => setIsIsiBedModalOpen(false)} title="Admisi & Penempatan Pasien Rawat Inap">
        <form onSubmit={handleAssignBed} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Pilih Dari Master Pasien RS (Opsional)</label>
            <select 
              onChange={e => {
                const px = pasien.find(p => p.id === e.target.value);
                if (px) {
                  setRegForm({ ...regForm, patient: px.nama, no_rm: px.no_rm, penjamin: px.penjamin || 'BPJS Kesehatan' });
                }
              }}
              className="input-field mb-2"
            >
              <option value="">-- Pilih Pasien Terdaftar --</option>
              {pasien.map(p => (
                <option key={p.id} value={p.id}>{p.no_rm} - {p.nama} ({p.penjamin})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Nama Pasien *</label>
              <input 
                type="text" 
                required 
                value={regForm.patient} 
                onChange={e => setRegForm({ ...regForm, patient: e.target.value })} 
                placeholder="Nama Lengkap Pasien" 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">No. Rekam Medis (RM)</label>
              <input 
                type="text" 
                value={regForm.no_rm} 
                onChange={e => setRegForm({ ...regForm, no_rm: e.target.value })} 
                placeholder="RM-RN-XXXX" 
                className="input-field font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">DPJP Utama *</label>
              <select 
                value={regForm.dpjp} 
                onChange={e => setRegForm({ ...regForm, dpjp: e.target.value })} 
                className="input-field font-bold"
              >
                <option value="dr. Hendra Pratama, Sp.PD">dr. Hendra Pratama, Sp.PD</option>
                <option value="dr. Siti Aminah, Sp.A">dr. Siti Aminah, Sp.A</option>
                <option value="dr. Ahmad Dahlan, Sp.B">dr. Ahmad Dahlan, Sp.B</option>
                <option value="dr. Ratna Juwita, Sp.OG">dr. Ratna Juwita, Sp.OG</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Pilih Bed Kosong *</label>
              <select 
                value={regForm.bed_id} 
                onChange={e => setRegForm({ ...regForm, bed_id: e.target.value })} 
                className="input-field font-bold"
              >
                <option value="">-- Bed Kosong Otomatis --</option>
                {beds.filter((b: any) => b.status === 'Kosong').map((b: any) => (
                  <option key={b.id} value={b.id}>Bed {b.id} - {b.room} ({b.class || b.kelas})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Diagnosa Masuk Ranap</label>
            <textarea 
              rows={2} 
              value={regForm.diagnosa} 
              onChange={e => setRegForm({ ...regForm, diagnosa: e.target.value })} 
              placeholder="Diagnosa kerja dan indikasi rawat inap..." 
              className="input-field" 
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsIsiBedModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-indigo-600 hover:bg-indigo-700">
              {isSubmitting ? 'Simpan...' : 'Proses Admisi Pasien'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: TRANSFER BED */}
      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title={`Pindah Bed — ${selectedBed?.patient}`}>
        <form onSubmit={handleMoveBed} className="space-y-4 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>Bed Asal: <strong className="text-slate-900 dark:text-white">Bed {selectedBed?.id} ({selectedBed?.room})</strong></div>
            <div>Pasien: <strong className="text-indigo-600 dark:text-indigo-400">{selectedBed?.patient}</strong> (RM: {selectedBed?.no_rm})</div>
          </div>

          <div>
            <label className="block font-bold mb-1">Pilih Bed Tujuan (Hanya Bed Status Kosong) *</label>
            <select 
              required
              value={targetBedId}
              onChange={e => setTargetBedId(e.target.value)}
              className="input-field font-bold"
            >
              <option value="">-- Pilih Bed Kosong --</option>
              {beds.filter((b: any) => b.status === 'Kosong').map((b: any) => (
                <option key={b.id} value={b.id}>Bed {b.id} - {b.room} ({b.class || b.kelas})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsMoveModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-indigo-600 hover:bg-indigo-700">
              Konfirmasi Pindah Bed
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: DISCHARGE PASIEN */}
      <Modal isOpen={isDischargeModalOpen} onClose={() => setIsDischargeModalOpen(false)} title={`Konfirmasi Pemulangan — Pasien ${selectedBed?.patient}`}>
        <div className="space-y-4 text-xs">
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-3.5 rounded-xl text-rose-800 dark:text-rose-300">
            Apakah Anda yakin ingin menyelesaikan perawatan pasien <strong>{selectedBed?.patient}</strong> dari Bed {selectedBed?.id}?
            Bed ini akan otomatis diubah statusnya menjadi <strong>Dibersihkan</strong> untuk disterilisasi.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsDischargeModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="button" onClick={handleDischargePatient} disabled={isSubmitting} className="btn-primary bg-rose-600 hover:bg-rose-700">
              {isSubmitting ? 'Memproses...' : 'Ya, Setujui Discharge Pasien'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
