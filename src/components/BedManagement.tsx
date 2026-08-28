import React, { useState, useEffect } from 'react';
import { BedDouble, RefreshCw, Activity, ArrowRightLeft, Save, Clock, Stethoscope, UserCheck, ShieldCheck, PhoneCall, Calendar } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { Modal } from './Modal';
import { useToast } from '../contexts/ToastContext';
import { ProfessionalTable } from './ProfessionalTable';
import SmartTable from './SmartTable';
import { useHospital } from '../contexts/HospitalContext';
import { generate50InpatientBeds } from '../data/patientPelayananData';
import { DATA_DOKTER_JAGA_LENGKAP } from '../data/dataDokterJagaLengkap';
import PrintPDFButton from './PrintPDFButton';

export function BedManagement() {
  const { activeTab } = useOutletContext<{ activeTab: string }>();
  const { pasien } = useHospital();
  
  const [beds, setBeds] = useState(() => {
    const saved = localStorage.getItem('simrs_bed_management');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return generate50InpatientBeds();
  });
  
  const toast = useToast();
  
  useEffect(() => {

  }, [beds]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isIsiBedModalOpen, setIsIsiBedModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [targetBedId, setTargetBedId] = useState('');
  const [selectedPasienId, setSelectedPasienId] = useState('');

  const stats = {
    total: beds.length,
    kosong: beds.filter((b: any) => b.status === 'Kosong').length,
    terisi: beds.filter((b: any) => b.status === 'Terisi').length,
    dibersihkan: beds.filter((b: any) => b.status === 'Dibersihkan').length,
  };

  if (activeTab === 'Dokter Ranap' || activeTab === 'Visite') {
    const ranapDoctors = DATA_DOKTER_JAGA_LENGKAP.filter(d => d.layanan_utama === 'Rawat Inap (Bangsal & DPJP)' || d.unit_tugas.toLowerCase().includes('inap') || d.peran.toLowerCase().includes('dpjp') || d.peran.toLowerCase().includes('visite'));

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
            <div key={doc.id} className="bg-slate-800/90 border border-slate-700 hover:border-indigo-500/50 p-5 rounded-xl transition-all shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded">
                    {doc.spesialisasi}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                    doc.status_kehadiran === 'Sedang Jaga / Praktik' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {doc.status_kehadiran}
                  </span>
                </div>
                <h3 className="font-bold text-white text-base mt-1">{doc.nama}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{doc.peran}</p>

                <div className="mt-3.5 text-xs text-slate-300 space-y-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Jam Visite: <strong className="text-slate-200">{doc.jam_praktik}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Hari: <strong className="text-slate-200">{doc.hari_praktik}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <BedDouble className="w-4 h-4 text-emerald-400" />
                    <span>Bangsal: <strong className="text-slate-200">{doc.ruangan}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <PhoneCall className="w-4 h-4 text-amber-400" />
                    <span>Kontak Pager: <strong className="text-slate-200">{doc.kontak_darurat}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono">SIP: {doc.sip}</span>
                <span className="text-indigo-400 font-semibold">{doc.shift}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab && activeTab !== 'Ketersediaan Bed') {
    return (
      <div className="p-6 h-full">
        <SmartTable 
          storageKey={`hospital_ranap_${activeTab}`}
          columns={[
            { key: 'tanggal', label: 'Tanggal' },
            { key: 'nama_pasien', label: 'Nama Pasien' },
            { key: 'ruangan', label: 'Ruangan/Bed' },
            { key: 'keterangan', label: 'Keterangan' },
            { key: 'status', label: 'Status', badge: true }
          ]}
          title={activeTab}
        />
      </div>
    );
  }

  const handleKosongkan = (id: string) => {
    if (true) {
      setBeds(beds.map((b: any) => b.id === id ? { ...b, status: 'Dibersihkan', patient: '-' } : b));
      toast.success('Bed dikosongkan dan sedang dibersihkan');
    }
  };

  const handleIsiBed = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const px = pasien.find(p => String(p.id) === String(selectedPasienId));
      setBeds(beds.map((b: any) => b.id === selectedBed.id ? { ...b, status: 'Terisi', patient: px ? px.nama : '-' } : b));
      setIsSubmitting(false);
      setIsIsiBedModalOpen(false);
      setSelectedPasienId('');
      toast.success('Bed berhasil diisi');
    }, 500);
  };

  const handleSelesaiBersih = (id: string) => {
    setBeds(beds.map((b: any) => b.id === id ? { ...b, status: 'Kosong' } : b));
    toast.success('Bed siap digunakan');
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBedId) return toast.error('Pilih bed tujuan');
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    
    setBeds(beds.map((b: any) => {
      if (b.id === selectedBed.id) return { ...b, status: 'Dibersihkan', patient: '-' };
      if (b.id === targetBedId) return { ...b, status: 'Terisi', patient: selectedBed.patient };
      return b;
    }));
    
    toast.success('Pasien berhasil dipindahkan');
    setIsSubmitting(false);
    setIsMoveModalOpen(false);
  };

  const availableBeds = beds.filter((b: any) => b.status === 'Kosong' && b.id !== selectedBed?.id);

  const columns = [
    { key: 'id', label: 'ID Bed', sortable: true },
    { key: 'room', label: 'Ruangan', sortable: true, filterable: true },
    { key: 'class', label: 'Kelas', sortable: true, filterable: true },
    { 
      key: 'status', label: 'Status', sortable: true, filterable: true,
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          val === 'Kosong' ? 'bg-emerald-100 text-emerald-700' :
          val === 'Terisi' ? 'bg-rose-100 text-rose-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'patient', label: 'Pasien' },
    {
      key: 'actions', label: 'Aksi & Dokumen',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {row.patient && (
            <PrintPDFButton
              documentData={{
                nama: row.patient,
                no_rm: row.no_rm || `RM-RANAP-${row.id}`,
                unit_pelayanan: `Instalasi Rawat Inap - ${row.room} (${row.class})`,
                ruangan: `${row.room} - Bed ${row.id}`,
                tipe_kunjungan: 'Rawat Inap',
                penjamin: row.penjamin || 'BPJS Kesehatan',
                keluhan: 'Perawatan Rawat Inap',
                diagnosis_utama: row.diagnosis || 'Penyakit Dalam / Rawat Inap',
                edukasi_instruksi: 'Instruksi rawat inap, monitoring tanda vital per shift, dan jadwal visite dokter DPJP.'
              }}
              docType="resume_medis"
              filename={`Admisi_Ranap_${row.id}_${row.patient}`}
              label="PDF"
              title="SURAT ADMISI & LEMBAR RESUME RAWAT INAP"
              className="py-1 px-2 text-xs font-semibold"
            />
          )}
          {row.status === 'Kosong' && (
            <button onClick={(e) => { e.stopPropagation(); setSelectedBed(row); setIsIsiBedModalOpen(true); }} className="bg-emerald-600 text-white px-2 py-1 rounded text-xs hover:bg-emerald-700">Isi Bed</button>
          )}
          {row.status === 'Terisi' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setSelectedBed(row); setIsMoveModalOpen(true); }} className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">Pindah Bed</button>
              <button onClick={(e) => { e.stopPropagation(); handleKosongkan(row.id); }} className="bg-rose-600 text-white px-2 py-1 rounded text-xs hover:bg-rose-700">Kosongkan</button>
            </>
          )}
          {row.status === 'Dibersihkan' && (
            <button onClick={(e) => { e.stopPropagation(); handleSelesaiBersih(row.id); }} className="bg-amber-600 text-white px-2 py-1 rounded text-xs hover:bg-amber-700">Selesai Bersih</button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Manajemen Tempat Tidur</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitoring dan alokasi bed rawat inap secara real-time</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Sinkronisasi
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="text-slate-500 mb-1">Total Bed</div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="text-emerald-600 dark:text-emerald-400 mb-1">Kosong (Tersedia)</div>
          <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.kosong}</div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 border border-rose-200 dark:border-rose-800 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="text-rose-600 dark:text-rose-400 mb-1">Terisi</div>
          <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">{stats.terisi}</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800 flex flex-col justify-center items-center text-center shadow-sm">
          <div className="text-amber-600 dark:text-amber-400 mb-1">Dibersihkan</div>
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.dibersihkan}</div>
        </div>
      </div>

      <ProfessionalTable 
        title="Daftar Bed"
        columns={columns}
        data={beds}
      />

      <Modal isOpen={isIsiBedModalOpen} onClose={() => setIsIsiBedModalOpen(false)} title="Isi Bed (Registrasi Inap)">
        <form onSubmit={handleIsiBed} className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-emerald-700 dark:text-emerald-400">Bed Tujuan</div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200">{selectedBed?.id} - {selectedBed?.room} ({selectedBed?.class})</div>
            </div>
            <BedDouble className="w-8 h-8 text-emerald-500 opacity-50" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Pasien</label>
            <select required className="input-field" value={selectedPasienId} onChange={e => setSelectedPasienId(e.target.value)}>
              <option value="">-- Pilih Pasien --</option>
              {pasien.map((p: any) => (
                <option key={p.id} value={p.id}>{p.no_rm} - {p.nama}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsIsiBedModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Memproses...' : 'Isi Bed'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title="Pindah Bed Pasien">
        <form onSubmit={handleMoveSubmit} className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Bed Saat Ini</div>
              <div className="font-bold text-lg text-slate-800 dark:text-slate-200">{selectedBed?.id}</div>
              <div className="text-xs font-medium text-slate-600">{selectedBed?.room} ({selectedBed?.class})</div>
            </div>
            <div className="text-slate-300">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Pasien</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{selectedBed?.patient}</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Bed Tujuan (Hanya Kosong)</label>
            <select required className="input-field" value={targetBedId} onChange={e => setTargetBedId(e.target.value)}>
              <option value="">-- Pilih Bed Kosong --</option>
              {availableBeds.map((b: any) => (
                <option key={b.id} value={b.id}>{b.id} - {b.room} ({b.class})</option>
              ))}
            </select>
          </div>
          
          {availableBeds.length === 0 && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              Tidak ada bed kosong yang tersedia saat ini.
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={() => setIsMoveModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={isSubmitting || availableBeds.length === 0} className="btn-primary bg-blue-600 hover:bg-blue-700 border-blue-600">
              {isSubmitting ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? 'Memindahkan...' : 'Pindah Bed'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

}
