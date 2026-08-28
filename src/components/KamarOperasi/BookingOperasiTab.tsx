import React, { useState } from 'react';
import { PasienOperasiItem } from './types';
import { SURGICAL_PROCEDURES_MASTER } from './data';
import { dokterByPenempatan } from '../../data/seedData';
import { useToast } from '../../contexts/ToastContext';
import { 
  Scissors, Calendar, Clock, CheckCircle, ArrowRight, 
  ArrowLeft, Save, User, ShieldAlert, Sparkles, Plus, Search, Trash2 
} from 'lucide-react';

interface BookingOperasiTabProps {
  pasienList: PasienOperasiItem[];
  setPasienList: React.Dispatch<React.SetStateAction<PasienOperasiItem[]>>;
  onViewPasienTab: () => void;
}

export function BookingOperasiTab({
  pasienList,
  setPasienList,
  onViewPasienTab
}: BookingOperasiTabProps) {
  const toast = useToast();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    nama_pasien: '',
    no_rm: '',
    nik: '',
    umur: 35,
    jenis_kelamin: 'L' as 'L' | 'P',
    penjamin: 'BPJS Kesehatan',
    sifat_operasi: 'Elektif' as 'Elektif' | 'Cito / Emergency',
    
    tindakan: '',
    kode_icd9: '',
    diagnosa_pra_bedah: '',
    indikasi_operasi: '',
    
    operator: '',
    anastesi: '',
    tipe_anastesi: 'General Anesthesia (GA)',
    asisten_operator: 'Ns. Tri Wahyuni, S.Kep',
    
    ruang_ok: 'Kamar OK 1 - Mayor Laparoskopi',
    tanggal: '2026-08-27T08:30',
    durasi: '90 Menit',
    
    golongan_darah: 'O+',
    persiapan_darah: '1 Labu PRC Siap / On-Call',
    puasa: 'Puasa 8 Jam Terpenuhi',
    riwayat_alergi: 'Tidak Ada Riwayat Alergi',
    informed_consent: 'Sudah Lengkap & TTD' as 'Sudah Lengkap & TTD' | 'Belum TTD'
  });

  const [searchSchedule, setSearchSchedule] = useState('');

  // Auto-fill from standard procedure master
  const handleSelectProcedure = (procName: string) => {
    const found = SURGICAL_PROCEDURES_MASTER.find(p => p.tindakan === procName);
    if (found) {
      setFormData(prev => ({
        ...prev,
        tindakan: found.tindakan,
        kode_icd9: found.icd9,
        diagnosa_pra_bedah: found.diagnosa,
        operator: found.operator,
        anastesi: found.anastesi,
        tipe_anastesi: found.tipe_anastesi,
        ruang_ok: found.ok,
        durasi: found.durasi
      }));
      toast.success(`Data standar ${found.tindakan} dimuat`);
    }
  };

  // Step Validation & Navigation
  const handleNext = () => {
    if (step === 1) {
      if (!formData.nama_pasien || !formData.tindakan) {
        toast.error('Mohon isi nama pasien dan tindakan operasi');
        return;
      }
    }
    if (step === 2) {
      if (!formData.operator || !formData.anastesi || !formData.ruang_ok) {
        toast.error('Mohon lengkapi dokter operator, dokter anestesi, dan ruang OK');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  // Save Booking
  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pasien || !formData.tindakan || !formData.tanggal) {
      toast.error('Mohon lengkapi field yang diperlukan');
      return;
    }

    const nextId = pasienList.length + 1;
    const newRecord: PasienOperasiItem = {
      id: nextId,
      nomor: `OP-2026-${String(nextId).padStart(3, '0')}`,
      no_rm: formData.no_rm || `RM-${String(nextId + 20).padStart(4, '0')}`,
      pasien: formData.nama_pasien,
      nama_pasien: formData.nama_pasien,
      nik: formData.nik || '3201087612340001',
      umur: Number(formData.umur),
      jenis_kelamin: formData.jenis_kelamin,
      penjamin: formData.penjamin,
      sifat_operasi: formData.sifat_operasi,
      
      diagnosa_pra_bedah: formData.diagnosa_pra_bedah || 'Indikasi Operatif Bedah',
      diagnosa_pasca_bedah: `Post ${formData.tindakan}`,
      tindakan: formData.tindakan,
      jenis: formData.tindakan,
      kode_icd9: formData.kode_icd9 || '54.11',
      indikasi_operasi: formData.indikasi_operasi || 'Indikasi elektif terjadwal',
      
      dokter: formData.operator,
      operator: formData.operator,
      spesialisasi_operator: 'Spesialis Bedah Terkait',
      anastesi: formData.anastesi,
      tipe_anastesi: formData.tipe_anastesi,
      asisten_operator: formData.asisten_operator,
      perawat_instrumen: 'Ns. Rina Wulandari, S.Kep',
      perawat_sirkuler: 'Ns. Ahmad Fauzi, S.Kep',
      
      ruang_ok: formData.ruang_ok,
      durasi: formData.durasi,
      tanggal: new Date(formData.tanggal).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      
      status: formData.sifat_operasi === 'Cito / Emergency' ? 'Sedang Operasi' : 'Terjadwal',
      golongan_darah: formData.golongan_darah,
      persiapan_darah: formData.persiapan_darah,
      puasa: formData.puasa,
      informed_consent: formData.informed_consent,
      riwayat_alergi: formData.riwayat_alergi,
      
      tanda_vital: {
        td: '120/80 mmHg',
        nadi: '80 x/menit',
        suhu: '36.5 °C',
        rr: '18 x/menit',
        spo2: '99%',
        skala_nyeri: 1
      },
      
      checklist_who: {
        sign_in: { selesai: false, identitas_terkonfirmasi: true, lokasi_diberi_tanda: true, mesin_anestesi_lengkap: true, pulse_oximeter_terpasang: true, riwayat_alergi_diketahui: true, risiko_aspirasi_jalan_napas: false, risiko_perdarahan_terantisipasi: true },
        time_out: { selesai: false, seluruh_tim_memperkenalkan_diri: true, konfirmasi_pasien_prosedur_lokasi: true, antibiotik_profilaksis_60menit: true, antisipasi_kritis_operator: true, antisipasi_kritis_anestesi: true, sterilitas_alat_terkonfirmasi: true, imaging_ditampilkan: true },
        sign_out: { selesai: false, nama_tindakan_dicatat: true, jumlah_kasa_jarum_alat_lengkap: true, label_spesimen_pa_terverifikasi: true, masalah_peralatan_nihil: true, instruksi_pemulihan_pacu_lengkap: true }
      },

      laporan_operasi: {
        temuan_intra_operasi: `Tindakan ${formData.tindakan} berhasil dilakukan secara asepsis lege artis.`,
        tahapan_prosedur: 'Insisi bedah, hemostasis, penanganan organ target, dan penutupan luka lapis demi lapis.',
        perdarahan_cc: 100,
        jaringan_pa: 'Ya (Dikirim ke Lab PA)',
        komplikasi: 'Nihil',
        aldrete_score: { aktivitas: 2, respirasi: 2, sirkulasi: 2, kesadaran: 2, warna_kulit: 2, total: 10 },
        instruksi_pasca_bedah: 'Awasi tanda vital di PACU, lanjutkan antibiotik profilaksis dan analgetik.'
      }
    };

    setPasienList([newRecord, ...pasienList]);
    toast.success('Jadwal booking operasi baru berhasil didaftarkan!');
    
    // Reset form
    setFormData({
      nama_pasien: '',
      no_rm: '',
      nik: '',
      umur: 35,
      jenis_kelamin: 'L',
      penjamin: 'BPJS Kesehatan',
      sifat_operasi: 'Elektif',
      tindakan: '',
      kode_icd9: '',
      diagnosa_pra_bedah: '',
      indikasi_operasi: '',
      operator: '',
      anastesi: '',
      tipe_anastesi: 'General Anesthesia (GA)',
      asisten_operator: 'Ns. Tri Wahyuni, S.Kep',
      ruang_ok: 'Kamar OK 1 - Mayor Laparoskopi',
      tanggal: '2026-08-27T08:30',
      durasi: '90 Menit',
      golongan_darah: 'O+',
      persiapan_darah: '1 Labu PRC Siap / On-Call',
      puasa: 'Puasa 8 Jam Terpenuhi',
      riwayat_alergi: 'Tidak Ada Riwayat Alergi',
      informed_consent: 'Sudah Lengkap & TTD'
    });
    setStep(1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-5 h-5 text-rose-500" /> Wizard Booking & Penjadwalan Kamar Operasi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftarkan pasien operasi elektif maupun tindakan darurat (Cito Emergency) ke jadwal kamar bedah terintegrasi
          </p>
        </div>
        <button
          onClick={onViewPasienTab}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
        >
          <span>Lihat Antrean Pasien Operasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Wizard Bar */}
      <div className="relative px-6">
        <div className="absolute top-1/2 left-10 right-10 h-1 bg-slate-700 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-10 h-1 bg-rose-500 -z-10 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 85}%` }}
        ></div>

        <div className="flex justify-between items-center">
          {[
            { num: 1, label: 'Pasien & Tindakan' },
            { num: 2, label: 'Tim & Kamar OK' },
            { num: 3, label: 'Kesiapan Pre-Op' },
            { num: 4, label: 'Konfirmasi' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-4 transition-all ${
                  step >= s.num
                    ? 'bg-rose-500 text-white border-slate-900 shadow-md shadow-rose-900/50 scale-110'
                    : 'bg-slate-700 text-slate-400 border-slate-900'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-[11px] font-semibold ${step >= s.num ? 'text-rose-400' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Form Box */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        
        {/* STEP 1: PASIEN & TINDAKAN */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-rose-400" /> Langkah 1: Data Identitas Pasien & Tindakan Bedah
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sifat_operasi: 'Elektif' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    formData.sifat_operasi === 'Elektif' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Elektif
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sifat_operasi: 'Cito / Emergency' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    formData.sifat_operasi === 'Cito / Emergency' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Cito / Emergency
                </button>
              </div>
            </div>

            {/* Quick Procedure Template */}
            <div className="p-3 bg-slate-900/60 border border-slate-700 rounded-xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pilih Template Tindakan Cepat (Otomatis Mengisi Kode ICD-9 & Dokter):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SURGICAL_PROCEDURES_MASTER.slice(0, 6).map(p => (
                  <button
                    key={p.tindakan}
                    type="button"
                    onClick={() => handleSelectProcedure(p.tindakan)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700 transition-colors"
                  >
                    {p.tindakan.split('(')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  value={formData.nama_pasien}
                  onChange={(e) => setFormData({ ...formData, nama_pasien: e.target.value })}
                  placeholder="Contoh: Siti Rahayu"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Rekam Medis (No. RM)</label>
                <input
                  type="text"
                  value={formData.no_rm}
                  onChange={(e) => setFormData({ ...formData, no_rm: e.target.value })}
                  placeholder="Contoh: RM-0012"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Umur (Tahun) & Jenis Kelamin</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.umur}
                    onChange={(e) => setFormData({ ...formData, umur: Number(e.target.value) })}
                    className="w-24 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <select
                    value={formData.jenis_kelamin}
                    onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value as 'L' | 'P' })}
                    className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Penjamin Pembiayaan</label>
                <select
                  value={formData.penjamin}
                  onChange={(e) => setFormData({ ...formData, penjamin: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="BPJS Kesehatan">BPJS Kesehatan (JKN-PBI / Non-PBI)</option>
                  <option value="Umum / Mandiri">Umum / Pembayaran Mandiri</option>
                  <option value="Asuransi Mandiri Inhealth">Asuransi Mandiri Inhealth</option>
                  <option value="Asuransi Prudential">Asuransi Swasta / Korporasi</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Tindakan Operasi *</label>
                <input
                  type="text"
                  value={formData.tindakan}
                  onChange={(e) => setFormData({ ...formData, tindakan: e.target.value })}
                  placeholder="Contoh: Laparoskopi Kolesistektomi"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kode Prosedur (ICD-9-CM)</label>
                <input
                  type="text"
                  value={formData.kode_icd9}
                  onChange={(e) => setFormData({ ...formData, kode_icd9: e.target.value })}
                  placeholder="Contoh: 51.23"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-cyan-400 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Diagnosa Pra-Bedah (ICD-10)</label>
                <input
                  type="text"
                  value={formData.diagnosa_pra_bedah}
                  onChange={(e) => setFormData({ ...formData, diagnosa_pra_bedah: e.target.value })}
                  placeholder="Contoh: Kolesistitis Kronik dengan Kolelitiasis (K80.20)"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TIM & KAMAR OK */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-400" /> Langkah 2: Pemilihan Tim Bedah, Anestesi & Ruang Operasi
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dokter Operator Bedah (DPJP) *</label>
                <select
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">- Pilih Dokter Operator Bedah -</option>
                  {dokterByPenempatan('Operasi').filter(d => !d.spesialis.includes('Sp.An')).map(d => (
                    <option key={d.id} value={d.nama}>{d.nama} ({d.spesialis})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dokter Anestesiologi & Reanimasi *</label>
                <select
                  value={formData.anastesi}
                  onChange={(e) => setFormData({ ...formData, anastesi: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">- Pilih Dokter Spesialis Anestesi -</option>
                  {dokterByPenempatan('Operasi').filter(d => d.spesialis.includes('Sp.An')).map(d => (
                    <option key={d.id} value={d.nama}>{d.nama} ({d.spesialis})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Anestesi yang Direncanakan</label>
                <select
                  value={formData.tipe_anastesi}
                  onChange={(e) => setFormData({ ...formData, tipe_anastesi: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="General Anesthesia (GA)">General Anesthesia (GA / Bius Total)</option>
                  <option value="Regional Spinal Anesthesia">Regional Spinal Anesthesia (Bius Pinggang)</option>
                  <option value="Regional Epidural Anesthesia">Regional Epidural Anesthesia</option>
                  <option value="Blok Saraf Perifer">Blok Saraf Perifer (Plexus Block)</option>
                  <option value="Topikal + Blok Peribulbar">Topikal + Blok Peribulbar (Mata)</option>
                  <option value="Sedasi Moderat / MAC">Sedasi Moderat (Monitored Anesthesia Care)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pilihan Kamar Operasi (OK Room) *</label>
                <select
                  value={formData.ruang_ok}
                  onChange={(e) => setFormData({ ...formData, ruang_ok: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-rose-300 font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Kamar OK 1 - Mayor Laparoskopi">Kamar OK 1 - Mayor Laparoskopi (Digestif/Laparoskopi)</option>
                  <option value="Kamar OK 2 - Orthopedi & Trauma">Kamar OK 2 - Orthopedi & Trauma (C-Arm, Bedah Tulang)</option>
                  <option value="Kamar OK 3 - Urologi & Endourologi">Kamar OK 3 - Urologi, THT & Bedah Mulut</option>
                  <option value="Kamar OK 4 - Emergency & Obstetri">Kamar OK 4 - Emergency & Obstetri (Seksio Sesarea)</option>
                  <option value="Kamar OK 5 - Bedah Mata Mikro">Kamar OK 5 - Bedah Mata Mikro (Phaco Katarak)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal & Jam Rencana Operasi</label>
                <input
                  type="datetime-local"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estimasi Durasi Tindakan</label>
                <select
                  value={formData.durasi}
                  onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="30 Menit">30 Menit (Minor / One Day)</option>
                  <option value="45 Menit">45 Menit</option>
                  <option value="60 Menit">60 Menit (1 Jam)</option>
                  <option value="75 Menit">75 Menit</option>
                  <option value="90 Menit">90 Menit (1.5 Jam)</option>
                  <option value="120 Menit">120 Menit (2 Jam)</option>
                  <option value="150 Menit">150 Menit (2.5 Jam)</option>
                  <option value="180 Menit">180 Menit (3 Jam Mayor)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: KESIAPAN PRE-OP */}
        {step === 3 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Langkah 3: Kesiapan Medis, Darah & Informed Consent
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Golongan Darah</label>
                <select
                  value={formData.golongan_darah}
                  onChange={(e) => setFormData({ ...formData, golongan_darah: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="A+">A Rhesus Positif (A+)</option>
                  <option value="B+">B Rhesus Positif (B+)</option>
                  <option value="O+">O Rhesus Positif (O+)</option>
                  <option value="AB+">AB Rhesus Positif (AB+)</option>
                  <option value="A-">A Rhesus Negatif (A-)</option>
                  <option value="O-">O Rhesus Negatif (O-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kesiapan Darah (BDRS / Bank Darah)</label>
                <select
                  value={formData.persiapan_darah}
                  onChange={(e) => setFormData({ ...formData, persiapan_darah: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="1 Labu PRC Siap / On-Call">1 Labu PRC Siap / On-Call</option>
                  <option value="2 Labu PRC Siap Crossmatch">2 Labu PRC Siap Crossmatch</option>
                  <option value="3 Labu PRC + 2 FFP Siap Cito">3 Labu PRC + 2 FFP (Mayor Emergency)</option>
                  <option value="Tidak Memerlukan Persiapan Darah">Tidak Memerlukan Persiapan Darah</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Status Puasa Pasien</label>
                <select
                  value={formData.puasa}
                  onChange={(e) => setFormData({ ...formData, puasa: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Puasa 8 Jam Terpenuhi">Puasa 8 Jam Terpenuhi (Makanan Padat)</option>
                  <option value="Puasa 6 Jam Terpenuhi">Puasa 6 Jam Terpenuhi (Susu / Makanan Ringan)</option>
                  <option value="Puasa 2 Jam (Clear Fluids)">Puasa 2 Jam (Air Putih / Clear Fluid)</option>
                  <option value="Pasien Belum Puasa / Cito Emergency">Pasien Belum Puasa (Emergency - Waspada Aspirasi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Surat Izin Operasi (Informed Consent)</label>
                <select
                  value={formData.informed_consent}
                  onChange={(e) => setFormData({ ...formData, informed_consent: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Sudah Lengkap & TTD">Sudah Lengkap & Ditandatangani Pasien/Wali</option>
                  <option value="Belum TTD">Belum TTD (Menunggu Edukasi Anestesi/Operator)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Riwayat Alergi Obat / Makanan</label>
                <input
                  type="text"
                  value={formData.riwayat_alergi}
                  onChange={(e) => setFormData({ ...formData, riwayat_alergi: e.target.value })}
                  placeholder="Contoh: Alergi Amoxicillin, Latex"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: KONFIRMASI */}
        {step === 4 && (
          <div className="space-y-5 animate-in slide-in-from-right-4">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Langkah 4: Konfirmasi Booking Jadwal Operasi
              </h3>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-700">
                <div>
                  <span className="text-slate-400 block">Nama Pasien / RM:</span>
                  <span className="font-bold text-white text-sm">{formData.nama_pasien} ({formData.no_rm || 'RM Baru'})</span>
                  <span className="text-slate-400 block mt-0.5">{formData.umur} Th / {formData.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} — {formData.penjamin}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sifat Operasi:</span>
                  <span className={`inline-block mt-0.5 px-2.5 py-1 rounded font-bold ${
                    formData.sifat_operasi === 'Cito / Emergency' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {formData.sifat_operasi}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-700">
                <div>
                  <span className="text-slate-400 block">Rencana Tindakan:</span>
                  <span className="font-bold text-rose-300 text-sm">{formData.tindakan}</span>
                  <span className="text-cyan-400 font-mono block">ICD-9: {formData.kode_icd9 || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Diagnosa Pra-Bedah:</span>
                  <span className="font-semibold text-slate-200">{formData.diagnosa_pra_bedah || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-700">
                <div>
                  <span className="text-slate-400 block">Dokter Operator:</span>
                  <span className="font-bold text-white">{formData.operator || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Dokter Anestesi:</span>
                  <span className="font-bold text-white">{formData.anastesi || '-'} ({formData.tipe_anastesi})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block">Ruang OK & Estimasi Durasi:</span>
                  <span className="font-bold text-slate-200">{formData.ruang_ok} (Est. {formData.durasi})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Jadwal Operasi:</span>
                  <span className="font-bold text-emerald-400">{new Date(formData.tanggal).toLocaleString('id-ID')} WIB</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveBooking}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4" /> Simpan & Jadwalkan Operasi
            </button>
          )}
        </div>

      </div>

      {/* Upcoming Surgery Calendar List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-400" /> Kalender & Antrean Jadwal Operasi Mendatang
          </h3>
          <span className="text-xs text-slate-400">Total {pasienList.length} Jadwal Terdaftar</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-lg backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Jadwal & Ruang OK</th>
                  <th className="p-3">No. RM & Pasien</th>
                  <th className="p-3">Tindakan Operasi</th>
                  <th className="p-3">DPJP Operator & Anestesi</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {pasienList.slice(0, 15).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{p.tanggal}</div>
                      <div className="text-rose-300 text-[11px] font-medium">{p.ruang_ok}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{p.nama_pasien}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{p.no_rm} ({p.penjamin})</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{p.tindakan}</div>
                      <div className="text-cyan-400 text-[11px] font-mono">ICD-9: {p.kode_icd9}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-300 font-medium">👨‍⚕️ {p.operator}</div>
                      <div className="text-slate-400 text-[11px]">💉 {p.anastesi}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 bg-slate-900 text-rose-300 rounded-full font-bold text-[10px] border border-rose-500/30">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setPasienList(prev => prev.filter(item => item.id !== p.id));
                          toast.success(`Jadwal ${p.nama_pasien} dibatalkan`);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Batalkan Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
