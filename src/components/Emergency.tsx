import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Activity, HeartPulse, Search, Plus, Save, ArrowRight, Clock, 
  ShieldAlert, PhoneCall, UserCheck, Stethoscope, CheckCircle2, User, FileText, 
  BedDouble, Filter, RefreshCw, Check, ArrowRightLeft, TrendingUp
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { usePatientFlow } from '../contexts/PatientFlowContext';
import { Modal } from './Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generate50IGDPatients } from '../data/patientPelayananData';
import { DATA_DOKTER_JAGA_LENGKAP } from '../data/dataDokterJagaLengkap';
import PrintPDFButton from './PrintPDFButton';

export function Emergency() {
  const { activeTab } = useOutletContext<{ activeTab: string }>() || { activeTab: 'Triase' };
  const { pasien, kunjungan: kunjunganMaster } = useHospital();
  const patientFlow = usePatientFlow();
  const toast = useToast();
  
  // Logical loading of IGD Triage Patients with LocalStorage persistence & Master sync
  const [triagePatients, setTriagePatients] = useState(() => {
    const saved = localStorage.getItem('hospital_emergency_triage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5) return parsed;
      } catch (e) {
        console.warn('Failed parsing emergency triage storage:', e);
      }
    }
    return generate50IGDPatients();
  });
  
  // Save to LocalStorage whenever triagePatients changes
  useEffect(() => {
    localStorage.setItem('hospital_emergency_triage', JSON.stringify(triagePatients));
  }, [triagePatients]);

  // Synchronize new IGD visits registered from Master Context if any
  useEffect(() => {
    if (!kunjunganMaster || kunjunganMaster.length === 0) return;
    const igdMasterVisits = kunjunganMaster.filter(k => 
      k.tipe === 'IGD' || (k as any).poli_nama?.toLowerCase().includes('igd')
    );
    
    let updated = false;
    const currentList = [...triagePatients];

    igdMasterVisits.forEach(km => {
      const exists = currentList.some(p => p.no_rm === km.pasien_id || p.name === (km as any).nama_pasien);
      if (!exists) {
        const px = pasien.find(p => p.id === km.pasien_id || p.no_rm === km.pasien_id);
        const newRecord = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          nomor: `IGD-2026-${Math.floor(Math.random() * 900 + 100)}`,
          no_rm: px ? px.no_rm : `RM-${Math.floor(Math.random() * 9000 + 1000)}`,
          name: px ? px.nama : ((km as any).nama_pasien || 'Pasien IGD Baru'),
          nama_pasien: px ? px.nama : ((km as any).nama_pasien || 'Pasien IGD Baru'),
          age: (px && px.tgl_lahir) ? (new Date().getFullYear() - new Date(px.tgl_lahir).getFullYear()) : 35,
          umur: (px && px.tgl_lahir) ? `${new Date().getFullYear() - new Date(px.tgl_lahir).getFullYear()} Thn` : '35 Thn',
          triage: 'Merah',
          condition: (km as any).keluhan || 'Penanganan Gawat Darurat IGD',
          kondisi: (km as any).keluhan || 'Penanganan Gawat Darurat IGD',
          diagnosa: 'Gawat Darurat Akut (R69)',
          tindakan: 'Triase awal, Injeksi IV line, Monitoring vital sign',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          waktu: `Hari ini, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`,
          tanggal: new Date().toISOString().split('T')[0],
          status: 'Resusitasi',
          tensi: '120/80',
          td: '120/80',
          nadi: '88',
          suhu: '36.8',
          rr: '20',
          spo2: '98%',
          dokter_jaga: 'dr. Budi Santoso, Sp.EM',
          penjamin: px?.penjamin || 'BPJS Kesehatan',
          vitals: [
            { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), hr: 88, bp: 120, temp: '36.8', rr: 20, spo2: 98 }
          ]
        };
        currentList.unshift(newRecord);
        updated = true;
      }
    });

    if (updated) {
      setTriagePatients(currentList);
    }
  }, [kunjunganMaster, pasien]);

  // State management for UI & Modals
  const [filterTriage, setFilterTriage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nik: '',
    no_rm: '',
    triage: 'Merah',
    condition: '',
    tensi: '120/80',
    nadi: '84',
    suhu: '36.8',
    rr: '20',
    spo2: '98',
    dokter: 'dr. Budi Santoso, Sp.EM',
    penjamin: 'BPJS Kesehatan'
  });
  
  const [vitalsData, setVitalsData] = useState({
    hr: '',
    bp: '',
    suhu: '36.8',
    rr: '20',
    spo2: '98'
  });

  const [treatmentData, setTreatmentData] = useState({
    tindakan: '',
    catatan_dokter: '',
    status: 'Tindakan'
  });

  // Action: Add new Triage Patient
  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error('Nama pasien wajib diisi');
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    
    const newId = Date.now();
    const newPatient = {
      id: newId,
      nomor: `IGD-2026-${Math.floor(Math.random() * 900 + 100)}`,
      no_rm: formData.no_rm || `RM-IGD-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: formData.name,
      nama_pasien: formData.name,
      age: parseInt(formData.age) || 30,
      umur: `${formData.age || 30} Thn`,
      triage: formData.triage,
      condition: formData.condition || 'Penanganan Kegawatdaruratan',
      kondisi: formData.condition || 'Penanganan Kegawatdaruratan',
      diagnosa: 'Evaluasi Gawat Darurat (R69)',
      tindakan: 'Stabilisasi & Pemantauan Vital Sign',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waktu: `Hari ini, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB`,
      tanggal: new Date().toISOString().split('T')[0],
      status: formData.triage === 'Merah' ? 'Resusitasi' : (formData.triage === 'Kuning' ? 'Observasi' : 'Tindakan'),
      tensi: formData.tensi || '120/80',
      td: formData.tensi || '120/80',
      nadi: formData.nadi || '84',
      suhu: formData.suhu || '36.8',
      rr: formData.rr || '20',
      spo2: formData.spo2 ? `${formData.spo2}%` : '98%',
      dokter_jaga: formData.dokter,
      penjamin: formData.penjamin,
      vitals: [
        { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          hr: parseInt(formData.nadi) || 84, 
          bp: parseInt(formData.tensi.split('/')[0]) || 120,
          temp: formData.suhu || '36.8',
          rr: parseInt(formData.rr) || 20,
          spo2: parseInt(formData.spo2) || 98
        }
      ]
    };

    setTriagePatients([newPatient, ...triagePatients]);
    toast.success(`Pasien ${newPatient.name} berhasil ditriase [Kategori: ${newPatient.triage}]`);
    setIsSubmitting(false);
    setIsTriageModalOpen(false);
    setFormData({
      name: '', age: '', nik: '', no_rm: '', triage: 'Merah', condition: '',
      tensi: '120/80', nadi: '84', suhu: '36.8', rr: '20', spo2: '98',
      dokter: 'dr. Budi Santoso, Sp.EM', penjamin: 'BPJS Kesehatan'
    });
  };
  
  // Action: Submit new Vitals checkpoint
  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vitalsData.bp || !vitalsData.hr) return toast.error('TD dan Nadi wajib diisi');

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));
    
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedPatients = triagePatients.map((p: any) => {
      if (p.id === activePatient?.id) {
        const newVitalEntry = {
          time: timeNow,
          hr: parseInt(vitalsData.hr) || 80,
          bp: parseInt(vitalsData.bp.split('/')[0]) || 120,
          temp: vitalsData.suhu || '36.5',
          rr: parseInt(vitalsData.rr) || 18,
          spo2: parseInt(vitalsData.spo2) || 98
        };
        return {
          ...p,
          tensi: vitalsData.bp,
          td: vitalsData.bp,
          nadi: vitalsData.hr,
          suhu: vitalsData.suhu,
          rr: vitalsData.rr,
          spo2: `${vitalsData.spo2}%`,
          vitals: [...(p.vitals || []), newVitalEntry]
        };
      }
      return p;
    });

    setTriagePatients(updatedPatients);
    setActivePatient(updatedPatients.find((p: any) => p.id === activePatient?.id));
    toast.success('Pemeriksaan Tanda Vital berhasil disimpan!');
    setIsSubmitting(false);
    setIsVitalsModalOpen(false);
    setVitalsData({ hr: '', bp: '', suhu: '36.8', rr: '20', spo2: '98' });
  };

  // Action: Save treatment/SOAP notes
  const handleTreatmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    const updatedPatients = triagePatients.map((p: any) => {
      if (p.id === activePatient?.id) {
        return {
          ...p,
          tindakan: treatmentData.tindakan || p.tindakan,
          status: treatmentData.status
        };
      }
      return p;
    });

    setTriagePatients(updatedPatients);
    toast.success('Catatan Penanganan & Tindakan IGD berhasil diperbarui!');
    setIsSubmitting(false);
    setIsTreatmentModalOpen(false);
  };
  
  // Action: Update Triage Status
  const updateStatus = (id: number, status: string) => {
    setTriagePatients(triagePatients.map((p: any) => p.id === id ? { ...p, status } : p));
    toast.success(`Status pasien diubah menjadi: ${status}`);
  };
  
  // Action: Convert / Transfer patient to Inpatient (Rawat Inap)
  const convertToInpatient = (patient: any) => {
    // 1. Save to Rawat Inap beds storage
    try {
      const savedBeds = localStorage.getItem('simrs_bed_management');
      let bedsList = savedBeds ? JSON.parse(savedBeds) : [];
      if (!Array.isArray(bedsList) || bedsList.length === 0) {
        bedsList = generate50IGDPatients();
      }

      // Find first available bed
      const emptyBedIndex = bedsList.findIndex((b: any) => b.status === 'Kosong');
      if (emptyBedIndex !== -1) {
        bedsList[emptyBedIndex] = {
          ...bedsList[emptyBedIndex],
          status: 'Terisi',
          patient: patient.name || patient.nama_pasien,
          nama_pasien: patient.name || patient.nama_pasien,
          no_rm: patient.no_rm,
          diagnosa: patient.diagnosa || patient.condition || 'Rawat Inap rujukan IGD',
          dpjp: patient.dokter_jaga || 'dr. Hendra Pratama, Sp.PD',
          penjamin: patient.penjamin || 'BPJS Kesehatan'
        };
        localStorage.setItem('simrs_bed_management', JSON.stringify(bedsList));
        toast.success(`✅ Pasien ${patient.name} berhasil dialokasikan ke Bed ${bedsList[emptyBedIndex].id} (${bedsList[emptyBedIndex].room})`);
      } else {
        toast.success(`Pasien ${patient.name} telah dikonfirmasi masuk ke antrian Rawat Inap.`);
      }
    } catch (e) {
      console.error('Error allocating bed:', e);
    }

    // 2. Update status in IGD triage list
    setTriagePatients(triagePatients.map((p: any) => 
      p.id === patient.id ? { ...p, status: 'Rawat Inap' } : p
    ));

    // 3. Update Patient Flow if available
    if (patientFlow && patientFlow.addKunjungan) {
      patientFlow.addKunjungan({
        no_rm: patient.no_rm,
        nama_pasien: patient.name || patient.nama_pasien,
        jenis_kunjungan: 'Rawat Inap',
        poli: 'Rawat Inap Bangsal',
        dokter: patient.dokter_jaga || 'dr. Hendra Pratama, Sp.PD',
        penjamin: patient.penjamin || 'BPJS Kesehatan'
      });
    }
  };

  const getCount = (triageType: string) => triagePatients.filter((p: any) => p.triage === triageType).length;

  // Filtered patients for search & triage category
  const searchedPatients = triagePatients.filter((p: any) => {
    const matchSearch = searchTerm === '' || 
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.no_rm && p.no_rm.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.condition && p.condition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.diagnosa && p.diagnosa.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchTriage = !filterTriage || p.triage === filterTriage;

    return matchSearch && matchTriage;
  });

  // =========================================================================
  // SUBMENU 1: DOKTER IGD & ROSTER
  // =========================================================================
  if (activeTab === 'Dokter IGD') {
    const igdDoctors = DATA_DOKTER_JAGA_LENGKAP.filter(d => d.unit_tugas.toLowerCase().includes('igd'));
    const onCallSpecialists = DATA_DOKTER_JAGA_LENGKAP.filter(d => 
      d.layanan_utama === 'Kamar Operasi (IBS / OK)' || 
      d.layanan_utama === 'ICU / Terapi Intensif' || 
      d.spesialisasi.includes('Sp.B') || 
      d.spesialisasi.includes('Sp.OG') || 
      d.spesialisasi.includes('Sp.An') || 
      d.spesialisasi.includes('Sp.JP') || 
      d.spesialisasi.includes('Sp.A')
    ).slice(0, 6);

    return (
      <div className="p-6 h-full space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              Dokter Jaga IGD 24 Jam & Tim Konsulen On-Call
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Roster rotasi 3 shift jaga, kepala resusitasi, dan dokter spesialis on-call cito klinik.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-full border border-rose-500/30 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Shift Aktif: Shift Pagi (07:00 - 14:00)
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {igdDoctors.length} Dokter Siaga di IGD
            </span>
          </div>
        </div>

        {/* Shift Roster */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-400" />
            Dokter Jaga IGD (Rotasi 3 Shift 24 Jam)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {igdDoctors.map((doc) => (
              <div key={doc.id} className="bg-slate-800/90 border border-slate-700 hover:border-rose-500/50 p-4 rounded-xl transition-all shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                      {doc.shift}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      doc.status_kehadiran === 'Sedang Jaga / Praktik' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {doc.status_kehadiran}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{doc.nama}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{doc.spesialisasi}</p>
                  
                  <div className="mt-3 text-xs text-slate-300 space-y-1.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-rose-400" />
                      <span>Jam: <strong className="text-slate-200">{doc.jam_praktik}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Peran: <strong className="text-slate-200">{doc.peran}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hotline: <strong className="text-slate-200">{doc.kontak_darurat}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">{doc.ruangan}</span>
                  <span className="font-mono text-cyan-400 font-bold">{doc.sip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* On-Call Specialist Roster */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-cyan-400" />
            Dokter Spesialis Konsulen On-Call Cito (Siap Panggilan Darurat)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onCallSpecialists.map((doc) => (
              <div key={doc.id} className="bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/40 p-4 rounded-xl transition-all shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                    {doc.spesialisasi}
                  </span>
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                    {doc.status_kehadiran}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">{doc.nama}</h4>
                <p className="text-xs text-slate-400">{doc.peran}</p>

                <div className="mt-2.5 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jadwal: <span className="text-slate-200">{doc.hari_praktik} ({doc.jam_praktik})</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pager Darurat: <strong className="text-rose-300">{doc.kontak_darurat}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 2: PENANGANAN IGD
  // =========================================================================
  if (activeTab === 'Penanganan IGD') {
    const activeTreatmentPatients = triagePatients.filter((p: any) => 
      p.status === 'Resusitasi' || p.status === 'Tindakan' || p.status === 'Observasi' || p.status === 'Menunggu'
    );

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              Penanganan & Tindakan Medis IGD
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Daftar pasien yang sedang mendapatkan penanganan resusitasi, tindakan cito, dan observasi intensif.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800">
              ⚡ {activeTreatmentPatients.length} Pasien Dalam Penanganan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTreatmentPatients.map((p: any) => (
            <div key={p.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold text-white ${
                    p.triage === 'Merah' ? 'bg-red-600 shadow-sm shadow-red-500/40' :
                    p.triage === 'Kuning' ? 'bg-amber-500 shadow-sm shadow-amber-500/40' : 'bg-emerald-600'
                  }`}>
                    Triase {p.triage}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                    {p.time || p.waktu}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">{p.name || p.nama_pasien}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>RM: <strong className="text-slate-700 dark:text-slate-200">{p.no_rm}</strong></span>
                  <span>•</span>
                  <span>Umur: {p.age || p.umur}</span>
                </div>

                <div className="mt-4 space-y-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Diagnosis / Kondisi:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{p.diagnosa || p.condition}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-semibold">Tindakan Diberikan:</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{p.tindakan || 'Pemasangan IV Line, O2 Support, Pemantauan Vital Sign'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700/60 font-mono text-[11px]">
                    <span className="text-slate-500">TD: <strong className="text-slate-800 dark:text-slate-200">{p.tensi || p.td || '120/80'}</strong></span>
                    <span className="text-slate-500">HR: <strong className="text-slate-800 dark:text-slate-200">{p.nadi || '84'} bpm</strong></span>
                    <span className="text-slate-500">SpO2: <strong className="text-slate-800 dark:text-slate-200">{p.spo2 || '98%'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <button 
                  onClick={() => { setActivePatient(p); setIsTreatmentModalOpen(true); }}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold rounded-lg transition-all"
                >
                  Edit Tindakan
                </button>
                <PrintPDFButton
                  documentData={{
                    nama: p.name || p.nama_pasien,
                    no_rm: p.no_rm,
                    unit_pelayanan: 'Instalasi Gawat Darurat (IGD)',
                    ruangan: `IGD - Triase ${p.triage}`,
                    tipe_kunjungan: 'Gawat Darurat',
                    penjamin: p.penjamin || 'BPJS Kesehatan',
                    keluhan: p.condition || p.kondisi,
                    diagnosis_utama: p.diagnosa || 'Gawat Darurat Akut',
                    edukasi_instruksi: p.tindakan || 'Penanganan Cito IGD dan pemantauan vital sign'
                  }}
                  docType="resume_medis"
                  filename={`Resume_IGD_${p.no_rm}_${p.name}`}
                  label="Cetak Resume"
                  title="RESUME MEDIS GAWAT DARURAT (IGD)"
                  className="py-1.5 px-3 text-xs font-bold bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 3: OBSERVASI VITAL SIGNS
  // =========================================================================
  if (activeTab === 'Observasi') {
    const observationPatients = triagePatients.filter((p: any) => p.vitals && p.vitals.length > 0);
    const selectedObsPatient = activePatient || observationPatients[0] || triagePatients[0];

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              Monitoring & Observasi Vital Signs IGD
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Pemantauan grafik serial Tanda Vital (TD, HR, RR, Suhu, SpO2) pasien di ruang observasi IGD.
            </p>
          </div>
          {selectedObsPatient && (
            <button
              onClick={() => { setActivePatient(selectedObsPatient); setIsVitalsModalOpen(true); }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Tambah Catatan Tanda Vital
            </button>
          )}
        </div>

        {/* Patient Selection & Chart Section */}
        {selectedObsPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Patient List Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col h-[500px]">
              <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-500" /> Pilih Pasien Observasi
              </h3>
              <div className="overflow-y-auto space-y-2 pr-1 custom-scrollbar flex-1">
                {triagePatients.map((p: any) => (
                  <div 
                    key={p.id}
                    onClick={() => setActivePatient(p)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedObsPatient?.id === p.id 
                        ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 dark:border-cyan-500 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{p.name || p.nama_pasien}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                        p.triage === 'Merah' ? 'bg-red-500' : (p.triage === 'Kuning' ? 'bg-amber-500' : 'bg-emerald-500')
                      }`}>
                        {p.triage}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
                      <span>RM: {p.no_rm}</span>
                      <span>TD: {p.tensi || p.td || '120/80'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Trend Chart & Vital History Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      Grafik Trend Heart Rate & Tekanan Darah — {selectedObsPatient.name || selectedObsPatient.nama_pasien}
                    </h3>
                    <span className="text-xs text-slate-500">RM: {selectedObsPatient.no_rm} • Dokter: {selectedObsPatient.dokter_jaga || 'dr. Budi Santoso, Sp.EM'}</span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedObsPatient.vitals && selectedObsPatient.vitals.length > 0 ? selectedObsPatient.vitals : [{ time: 'Awal', hr: 80, bp: 120 }]}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="bp" name="Systolic BP (mmHg)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Serial Vital Logs Table */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Riwayat Catatan Tanda Vital Serial</h4>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Waktu</th>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">TD (mmHg)</th>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Heart Rate</th>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">Suhu (°C)</th>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">RR (/m)</th>
                      <th className="p-3 font-semibold text-slate-700 dark:text-slate-300">SpO2</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {selectedObsPatient.vitals?.map((v: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{v.time}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{v.bp}</td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{v.hr} bpm</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{v.temp || '36.8'} °C</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">{v.rr || '20'} x/m</td>
                        <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{v.spo2 ? `${v.spo2}%` : '98%'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // SUBMENU 4: MAIN DASHBOARD & TRIASE
  // =========================================================================
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-500" />
            Instalasi Gawat Darurat (IGD) & Triase Gadar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen pelayanan kegawatdaruratan, scoring triase ATS, dan alokasi perawatan cito.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTriageModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Registrasi Triase Baru
          </button>
        </div>
      </div>
      
      {/* Triage Scoring Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterTriage(filterTriage === 'Merah' ? null : 'Merah')} 
          className={`bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] ${
            filterTriage === 'Merah' ? 'ring-4 ring-red-300 dark:ring-red-500' : ''
          }`}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-extrabold text-base mb-0.5">Triase Merah</h3>
            <span className="text-red-100 text-xs font-medium">Resusitasi Cito (Immediate)</span>
            <div className="text-3xl font-black mt-3">{getCount('Merah')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        <div 
          onClick={() => setFilterTriage(filterTriage === 'Kuning' ? null : 'Kuning')} 
          className={`bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] ${
            filterTriage === 'Kuning' ? 'ring-4 ring-amber-300 dark:ring-amber-500' : ''
          }`}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-extrabold text-base mb-0.5">Triase Kuning</h3>
            <span className="text-amber-100 text-xs font-medium">Urgent (Gawat Tidak Darurat)</span>
            <div className="text-3xl font-black mt-3">{getCount('Kuning')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        <div 
          onClick={() => setFilterTriage(filterTriage === 'Hijau' ? null : 'Hijau')} 
          className={`bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] ${
            filterTriage === 'Hijau' ? 'ring-4 ring-emerald-300 dark:ring-emerald-500' : ''
          }`}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-extrabold text-base mb-0.5">Triase Hijau</h3>
            <span className="text-emerald-100 text-xs font-medium">Non-Urgent (Tidak Gawat)</span>
            <div className="text-3xl font-black mt-3">{getCount('Hijau')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        <div 
          onClick={() => setFilterTriage(filterTriage === 'Hitam' ? null : 'Hitam')} 
          className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.02] ${
            filterTriage === 'Hitam' ? 'ring-4 ring-slate-400' : ''
          }`}
        >
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-extrabold text-base mb-0.5">Triase Hitam</h3>
            <span className="text-slate-300 text-xs font-medium">Expectorant (DOA / Death)</span>
            <div className="text-3xl font-black mt-3">{getCount('Hitam')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
      </div>
      
      {/* Search & Main Patient Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Pasien Aktif IGD {filterTriage && `(Filter Triase: ${filterTriage})`}
            </h3>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded-full font-bold">
              {searchedPatients.length} Pasien
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari Nama, RM, Kondisi..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            {filterTriage && (
              <button 
                onClick={() => setFilterTriage(null)}
                className="px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 rounded-xl hover:bg-rose-100"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="p-3.5 font-bold">Waktu</th>
                <th className="p-3.5 font-bold">No. RM & Pasien</th>
                <th className="p-3.5 font-bold">Kategori Triase</th>
                <th className="p-3.5 font-bold">Keluhan / Diagnosa</th>
                <th className="p-3.5 font-bold">Tanda Vital</th>
                <th className="p-3.5 font-bold">Status Layanan</th>
                <th className="p-3.5 font-bold text-right">Aksi & Integrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {searchedPatients.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500 font-semibold">{p.time || p.waktu}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{p.name || p.nama_pasien}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{p.no_rm}</span>
                      <span>•</span>
                      <span>{p.age || p.umur}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold text-white ${
                      p.triage === 'Merah' ? 'bg-red-600' :
                      p.triage === 'Kuning' ? 'bg-amber-500' :
                      p.triage === 'Hitam' ? 'bg-slate-800' : 'bg-emerald-600'
                    }`}>
                      {p.triage}
                    </span>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.diagnosa || p.condition}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.condition || p.kondisi}</div>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <div>TD: <strong className="text-slate-900 dark:text-slate-100">{p.tensi || p.td || '120/80'}</strong></div>
                    <div>HR: {p.nadi || '84'} bpm | Suhu: {p.suhu || '36.8'}°C</div>
                  </td>
                  <td className="p-3.5">
                    <select 
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="text-xs font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-1 outline-none"
                    >
                      <option value="Resusitasi">Resusitasi</option>
                      <option value="Tindakan">Tindakan</option>
                      <option value="Observasi">Observasi</option>
                      <option value="Stabil/Pulang">Stabil/Pulang</option>
                      <option value="Rawat Inap">Rawat Inap</option>
                      <option value="Meninggal">Meninggal (DOA)</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      <button
                        onClick={() => { setActivePatient(p); setIsVitalsModalOpen(true); }}
                        className="p-1.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 rounded-lg hover:bg-cyan-100 font-bold text-xs flex items-center gap-1"
                        title="Tambah Tanda Vital"
                      >
                        <HeartPulse className="w-3.5 h-3.5" /> Vital
                      </button>

                      {p.status !== 'Rawat Inap' && (
                        <button
                          onClick={() => convertToInpatient(p)}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1"
                          title="Transfer ke Rawat Inap"
                        >
                          <BedDouble className="w-3.5 h-3.5" /> Transfer Ranap
                        </button>
                      )}

                      <PrintPDFButton
                        documentData={{
                          nama: p.name || p.nama_pasien,
                          no_rm: p.no_rm,
                          unit_pelayanan: 'Instalasi Gawat Darurat (IGD)',
                          ruangan: `IGD - Triase ${p.triage}`,
                          tipe_kunjungan: 'Gawat Darurat',
                          penjamin: p.penjamin || 'BPJS Kesehatan',
                          keluhan: p.condition || p.kondisi,
                          diagnosis_utama: p.diagnosa || 'Gawat Darurat Akut',
                          edukasi_instruksi: p.tindakan || 'Penanganan Cito IGD dan pemantauan vital sign'
                        }}
                        docType="resume_medis"
                        filename={`Resume_IGD_${p.no_rm}_${p.name}`}
                        label="PDF"
                        title="RESUME MEDIS GAWAT DARURAT (IGD)"
                        className="py-1.5 px-2.5 text-xs font-bold"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: REGISTRASI TRIASE BARU */}
      <Modal isOpen={isTriageModalOpen} onClose={() => setIsTriageModalOpen(false)} title="Registrasi Triase IGD Baru">
        <form onSubmit={handleTriageSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Nama Pasien *</label>
              <input 
                type="text" 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="cth. Budi Santoso" 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Umur (Tahun) *</label>
              <input 
                type="number" 
                required 
                value={formData.age} 
                onChange={e => setFormData({ ...formData, age: e.target.value })} 
                placeholder="42" 
                className="input-field" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Kategori Triase ATS *</label>
              <select 
                value={formData.triage} 
                onChange={e => setFormData({ ...formData, triage: e.target.value })} 
                className="input-field font-bold"
              >
                <option value="Merah">🔴 Triase Merah (Resusitasi Immediate)</option>
                <option value="Kuning">🟡 Triase Kuning (Urgent)</option>
                <option value="Hijau">🟢 Triase Hijau (Non-Urgent)</option>
                <option value="Hitam">⚫ Triase Hitam (DOA)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Dokter Jaga IGD *</label>
              <select 
                value={formData.dokter} 
                onChange={e => setFormData({ ...formData, dokter: e.target.value })} 
                className="input-field"
              >
                <option value="dr. Budi Santoso, Sp.EM">dr. Budi Santoso, Sp.EM</option>
                <option value="dr. Ahmad Dahlan, Sp.B">dr. Ahmad Dahlan, Sp.B</option>
                <option value="dr. Rina Lestari, Sp.An">dr. Rina Lestari, Sp.An</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Tekanan Darah (TD)</label>
              <input 
                type="text" 
                value={formData.tensi} 
                onChange={e => setFormData({ ...formData, tensi: e.target.value })} 
                placeholder="120/80" 
                className="input-field font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Heart Rate (Nadi bpm)</label>
              <input 
                type="text" 
                value={formData.nadi} 
                onChange={e => setFormData({ ...formData, nadi: e.target.value })} 
                placeholder="84" 
                className="input-field font-mono" 
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Keluhan Utama & Alasan Masuk IGD *</label>
            <textarea 
              rows={3} 
              required 
              value={formData.condition} 
              onChange={e => setFormData({ ...formData, condition: e.target.value })} 
              placeholder="Jelaskan keluhan gawat darurat..." 
              className="input-field" 
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsTriageModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-rose-600 hover:bg-rose-700">
              {isSubmitting ? 'Simpan...' : 'Simpan Triase'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: VITAL SIGNS LOG */}
      <Modal isOpen={isVitalsModalOpen} onClose={() => setIsVitalsModalOpen(false)} title={`Input Vital Signs — ${activePatient?.name || activePatient?.nama_pasien}`}>
        <form onSubmit={handleVitalsSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold mb-1">Tekanan Darah (mmHg) *</label>
              <input 
                type="text" 
                required 
                value={vitalsData.bp} 
                onChange={e => setVitalsData({ ...vitalsData, bp: e.target.value })} 
                placeholder="120/80" 
                className="input-field font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Heart Rate / Nadi (bpm) *</label>
              <input 
                type="number" 
                required 
                value={vitalsData.hr} 
                onChange={e => setVitalsData({ ...vitalsData, hr: e.target.value })} 
                placeholder="84" 
                className="input-field font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Suhu Tubuh (°C)</label>
              <input 
                type="text" 
                value={vitalsData.suhu} 
                onChange={e => setVitalsData({ ...vitalsData, suhu: e.target.value })} 
                placeholder="36.8" 
                className="input-field font-mono" 
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Respiration Rate (rr/min)</label>
              <input 
                type="number" 
                value={vitalsData.rr} 
                onChange={e => setVitalsData({ ...vitalsData, rr: e.target.value })} 
                placeholder="20" 
                className="input-field font-mono" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsVitalsModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-cyan-600 hover:bg-cyan-700">
              {isSubmitting ? 'Simpan...' : 'Simpan Vital Signs'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: EDIT TINDAKAN */}
      <Modal isOpen={isTreatmentModalOpen} onClose={() => setIsTreatmentModalOpen(false)} title={`Update Penanganan — ${activePatient?.name || activePatient?.nama_pasien}`}>
        <form onSubmit={handleTreatmentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold mb-1">Tindakan & Prosedur Diberikan *</label>
            <textarea 
              rows={3} 
              required 
              value={treatmentData.tindakan} 
              onChange={e => setTreatmentData({ ...treatmentData, tindakan: e.target.value })} 
              placeholder="Injeksi IV line, Loading RL, Pemasangan ETT..." 
              className="input-field" 
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Status Penanganan</label>
            <select 
              value={treatmentData.status} 
              onChange={e => setTreatmentData({ ...treatmentData, status: e.target.value })} 
              className="input-field font-bold"
            >
              <option value="Resusitasi">Resusitasi</option>
              <option value="Tindakan">Tindakan</option>
              <option value="Observasi">Observasi</option>
              <option value="Stabil/Pulang">Stabil / Boleh Pulang</option>
              <option value="Rawat Inap">Siap Rawat Inap</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsTreatmentModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-blue-600 hover:bg-blue-700">
              Simpan Penanganan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
