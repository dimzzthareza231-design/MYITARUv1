import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, HeartPulse, Search, Plus, Save, ArrowRight, Clock, ShieldAlert, PhoneCall, UserCheck, Stethoscope, CheckCircle2, User } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { Modal } from './Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SmartTable from './SmartTable';
import { generate50IGDPatients } from '../data/patientPelayananData';
import { DATA_DOKTER_JAGA_LENGKAP } from '../data/dataDokterJagaLengkap';
import PrintPDFButton from './PrintPDFButton';

export function Emergency() {
  const { activeTab } = useOutletContext<{ activeTab: string }>();
  const { pasien } = useHospital();
  const toast = useToast();
  
  const [triagePatients, setTriagePatients] = useState(() => {
    const saved = localStorage.getItem('hospital_emergency_triage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return generate50IGDPatients();
  });
  
  useEffect(() => {
    localStorage.setItem('hospital_emergency_triage', JSON.stringify(triagePatients));
  }, [triagePatients]);

  const [filterTriage, setFilterTriage] = useState<string | null>(null);

  const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [activePatient, setActivePatient] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    triage: 'Merah',
    condition: ''
  });
  
  const [vitalsData, setVitalsData] = useState({
    hr: '',
    bp: ''
  });

  if (activeTab === 'Dokter IGD') {
    const igdDoctors = DATA_DOKTER_JAGA_LENGKAP.filter(d => d.unit_tugas.toLowerCase().includes('igd'));
    const onCallSpecialists = DATA_DOKTER_JAGA_LENGKAP.filter(d => d.layanan_utama === 'Kamar Operasi (IBS / OK)' || d.layanan_utama === 'ICU / Terapi Intensif' || d.spesialisasi.includes('Sp.B') || d.spesialisasi.includes('Sp.OG') || d.spesialisasi.includes('Sp.An') || d.spesialisasi.includes('Sp.JP') || d.spesialisasi.includes('Sp.A')).slice(0, 6);

    return (
      <div className="p-6 h-full space-y-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              Dokter Jaga IGD 24 Jam & Tim Konsulen On-Call
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Roster rotasi 3 shift jaga, kepala resusitasi, dan dokter spesialis on-call cito rumah sakit.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1.5 rounded-full border border-rose-500/30 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Shift Aktif: Shift Pagi (07:00 - 14:00)
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 4 Dokter Siaga di IGD
            </span>
          </div>
        </div>

        {/* Shift Roster Table */}
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

  if (activeTab && activeTab !== 'Triase') {
    let columns = [
      { key: 'nomor', label: 'Nomor' },
      { key: 'nama_pasien', label: 'Nama Pasien' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'status', label: 'Status', badge: true }
    ];

    if (activeTab === 'Penanganan IGD') {
        columns = [
            { key: 'waktu', label: 'Waktu Kedatangan' },
            { key: 'nama_pasien', label: 'Nama Pasien' },
            { key: 'kondisi', label: 'Kondisi' },
            { key: 'tindakan', label: 'Tindakan' },
            { key: 'status', label: 'Status', badge: true }
        ];
    } else if (activeTab === 'Observasi') {
        columns = [
            { key: 'waktu', label: 'Waktu Mulai' },
            { key: 'nama_pasien', label: 'Nama Pasien' },
            { key: 'tensi', label: 'TD' },
            { key: 'nadi', label: 'Nadi' },
            { key: 'suhu', label: 'Suhu' },
            { key: 'status', label: 'Status', badge: true }
        ];
    }
    
    return (
      <div className="p-6 h-full">
        <SmartTable 
          storageKey={`hospital_igd_${activeTab}`}
          columns={columns}
          title={activeTab}
        />
      </div>
    );
  }

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const newPatient = {
      id: Date.now(),
      name: formData.name,
      age: parseInt(formData.age),
      triage: formData.triage,
      condition: formData.condition,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Menunggu',
      vitals: []
    };
    setTriagePatients([newPatient, ...triagePatients]);
    toast.success('Pasien berhasil ditriase');
    setIsSubmitting(false);
    setIsTriageModalOpen(false);
    setFormData({ name: '', age: '', triage: 'Merah', condition: '' });
  };
  
  const handleVitalsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const updatedPatients = triagePatients.map((p: any) => {
      if (p.id === activePatient?.id) {
        return {
          ...p,
          vitals: [...(p.vitals || []), {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hr: parseInt(vitalsData.hr),
            bp: parseInt(vitalsData.bp)
          }]
        };
      }
      return p;
    });
    setTriagePatients(updatedPatients);
    setActivePatient(updatedPatients.find((p: any) => p.id === activePatient?.id));
    toast.success('Vitals berhasil disimpan');
    setIsSubmitting(false);
    setVitalsData({ hr: '', bp: '' });
  };
  
  const updateStatus = (id: number, status: string) => {
    setTriagePatients(triagePatients.map((p: any) => p.id === id ? { ...p, status } : p));
    toast.success(`Status diubah menjadi ${status}`);
  };
  
  const convertToInpatient = (id: number) => {
    toast.success('Pasien dipindahkan ke Rawat Inap');
    setTriagePatients(triagePatients.filter((p: any) => p.id !== id));
  };

  const getCount = (triageType: string) => triagePatients.filter((p: any) => p.triage === triageType).length;
  
  const filteredPatients = filterTriage ? triagePatients.filter((p: any) => p.triage === filterTriage) : triagePatients;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Instalasi Gawat Darurat (IGD)</h1>
          <p className="text-slate-500 dark:text-slate-400">Manajemen pasien gawat darurat dan triase</p>
        </div>
        <button 
          onClick={() => setIsTriageModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Triase
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div onClick={() => setFilterTriage(filterTriage === 'Merah' ? null : 'Merah')} className={`bg-red-500 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer ${filterTriage === 'Merah' ? 'ring-4 ring-red-300' : ''}`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-1">Triase Merah</h3>
            <span className="text-red-100 text-sm">Gawat Darurat (Resusitasi)</span>
            <div className="text-4xl font-bold mt-4">{getCount('Merah')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
        <div onClick={() => setFilterTriage(filterTriage === 'Kuning' ? null : 'Kuning')} className={`bg-orange-500 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer ${filterTriage === 'Kuning' ? 'ring-4 ring-orange-300' : ''}`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-1">Triase Kuning</h3>
            <span className="text-orange-100 text-sm">Urgent (Gawat Tidak Darurat)</span>
            <div className="text-4xl font-bold mt-4">{getCount('Kuning')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
        <div onClick={() => setFilterTriage(filterTriage === 'Hijau' ? null : 'Hijau')} className={`bg-emerald-500 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer ${filterTriage === 'Hijau' ? 'ring-4 ring-emerald-300' : ''}`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-1">Triase Hijau</h3>
            <span className="text-emerald-100 text-sm">Non-Urgent (Tidak Gawat)</span>
            <div className="text-4xl font-bold mt-4">{getCount('Hijau')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
        <div onClick={() => setFilterTriage(filterTriage === 'Hitam' ? null : 'Hitam')} className={`bg-slate-800 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group cursor-pointer ${filterTriage === 'Hitam' ? 'ring-4 ring-slate-400' : ''}`}>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-bold text-lg mb-1">Triase Hitam</h3>
            <span className="text-slate-300 text-sm">Expectorant (DOA)</span>
            <div className="text-4xl font-bold mt-4">{getCount('Hitam')}</div>
          </div>
          <AlertTriangle className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white">Pasien Aktif IGD {filterTriage && `(Filter: ${filterTriage})`}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10">
              <tr>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Waktu</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Nama Pasien</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Kategori</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Kondisi Utama</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPatients.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{p.time}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {p.name}
                    <div className="text-xs text-slate-500 font-normal">{p.age} Thn</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                      p.triage === 'Merah' ? 'bg-red-500' :
                      p.triage === 'Kuning' ? 'bg-orange-500' :
                      p.triage === 'Hitam' ? 'bg-slate-800' : 'bg-emerald-500'
                    }`}>
                      {p.triage}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{p.condition}</td>
                  <td className="p-4">
                    <select 
                      value={p.status}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className="text-xs border-slate-200 dark:border-slate-700 rounded-md bg-transparent dark:bg-slate-800 text-slate-700 dark:text-slate-200 p-1"
                    >
                      <option value="Menunggu">Menunggu</option>
                      <option value="Observasi">Observasi</option>
                      <option value="Resusitasi">Resusitasi</option>
                      <option value="Tindakan">Tindakan</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <PrintPDFButton
                        documentData={{
                          nama: p.nama || p.name,
                          no_rm: p.no_rm || `RM-IGD-${p.id}`,
                          umur: p.umur || p.age || 35,
                          jenis_kelamin: p.jenis_kelamin || 'L',
                          unit_pelayanan: 'Instalasi Gawat Darurat (IGD)',
                          poli: 'IGD PONEK / Resusitasi',
                          keluhan: p.keluhan || p.condition || 'Kegawatdaruratan Medis',
                          anamnesis: `Pasien masuk IGD dengan keluhan: ${p.keluhan || p.condition || '-'}. Status Triase: ${p.triage}.`,
                          diagnosis_utama: `Kegawatdaruratan Klinis (Triase ${p.triage})`,
                          icd10_utama: p.triage === 'Merah' ? 'R57.9' : p.triage === 'Kuning' ? 'R50.9' : 'R10.9',
                          catatan_fisik: `Triase: ${p.triage}. Kesadaran: Compos Mentis. Status Jalan Nafas, Pernafasan, dan Sirkulasi terkontrol.`,
                          tanda_vital: {
                            tekananDarah: p.vitals?.[p.vitals.length - 1]?.bp ? `${p.vitals[p.vitals.length - 1].bp}/80` : (p.tanda_vital?.tekananDarah || '120/80'),
                            nadi: p.vitals?.[p.vitals.length - 1]?.hr ? `${p.vitals[p.vitals.length - 1].hr}` : (p.tanda_vital?.nadi || '84'),
                            suhu: p.tanda_vital?.suhu || '37.0',
                            spo2: p.tanda_vital?.spo2 || '98',
                            rr: p.tanda_vital?.rr || '20'
                          },
                          edukasi_instruksi: `1. Pasien dalam observasi ketat unit IGD.\n2. Tatalaksana kegawatdaruratan dan monitoring berkala tanda vital.`
                        }}
                        docType="resume_medis"
                        filename={`Triase_IGD_${p.nama || p.name}`}
                        label="PDF"
                        title="LEMBAR TRIASE & PENANGANAN INSTALASI GAWAT DARURAT (IGD)"
                        className="py-1 px-2 text-xs font-semibold"
                      />
                      <button 
                        onClick={() => { setActivePatient(p); setIsVitalsModalOpen(true); }}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-2 rounded text-xs flex items-center gap-1 font-semibold"
                      >
                        <HeartPulse className="w-3 h-3" /> Vitals
                      </button>
                      <button 
                        onClick={() => convertToInpatient(p.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-xs flex items-center gap-1 font-semibold"
                      >
                        <ArrowRight className="w-3 h-3" /> Inap
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
             <div className="p-8 text-center text-slate-500">Tidak ada pasien.</div>
          )}
        </div>
      </div>
      
      <Modal isOpen={isTriageModalOpen} onClose={() => setIsTriageModalOpen(false)} title="Form Triase Pasien IGD">
        <form onSubmit={handleTriageSubmit} className="space-y-4 text-slate-700 dark:text-slate-200">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Pasien</label>
            <input required type="text" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Usia</label>
              <input required type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori Triase</label>
              <select className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent" value={formData.triage} onChange={e => setFormData({...formData, triage: e.target.value})}>
                <option value="Merah">Merah (Resusitasi / Gawat Darurat)</option>
                <option value="Kuning">Kuning (Urgent / Gawat Tidak Darurat)</option>
                <option value="Hijau">Hijau (Non-Urgent / Tidak Gawat)</option>
                <option value="Hitam">Hitam (Expectorant / DOA)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Keluhan Utama / Kondisi</label>
            <textarea required className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent min-h-[80px]" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}></textarea>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsTriageModalOpen(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded text-sm font-semibold">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold flex items-center gap-2">
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Menyimpan...' : 'Simpan Triase'}
            </button>
          </div>
        </form>
      </Modal>
      
      <Modal isOpen={isVitalsModalOpen} onClose={() => setIsVitalsModalOpen(false)} title={`Monitoring Vitals: ${activePatient?.name}`} maxWidth="max-w-2xl">
        {activePatient && (
          <div className="space-y-6">
            <form onSubmit={handleVitalsSubmit} className="flex gap-4 items-end bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Heart Rate (bpm)</label>
                <input required type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent py-1.5" value={vitalsData.hr} onChange={e => setVitalsData({...vitalsData, hr: e.target.value})} placeholder="e.g. 80" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Blood Pressure (Systolic)</label>
                <input required type="number" className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-transparent py-1.5" value={vitalsData.bp} onChange={e => setVitalsData({...vitalsData, bp: e.target.value})} placeholder="e.g. 120" />
              </div>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold py-1.5 shrink-0">
                {isSubmitting ? 'Saving...' : 'Tambah Vitals'}
              </button>
            </form>
            <div className="h-64 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-center">Trend Tanda Vital</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activePatient.vitals} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                  <Line type="monotone" dataKey="bp" stroke="#3b82f6" strokeWidth={2} name="Systolic BP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
