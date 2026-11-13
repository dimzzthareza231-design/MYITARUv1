import React, { useState, useEffect } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { 
  ShieldCheck, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Send, 
  FileCheck, 
  BarChart2, 
  TrendingUp,
  Filter,
  User,
  Stethoscope
} from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';

export interface KLPCMAuditItem {
  id: string;
  no_rm: string;
  nama_pasien: string;
  unit: string;
  dpjp: string;
  tgl_pelayanan: string;
  identitas_lengkap: boolean;
  anamnesa_lengkap: boolean;
  icd10_lengkap: boolean;
  icd9_lengkap: boolean;
  informed_consent: 'LENGKAP' | 'TIDAK_LENGKAP' | 'NA';
  resume_medis: boolean;
  tte_dpjp: boolean;
  status: 'LENGKAP' | 'TIDAK_LENGKAP';
  catatan_auditor?: string;
  tgl_audit: string;
  notifikasi_terkirim?: boolean;
}

const INITIAL_AUDITS: KLPCMAuditItem[] = [
  {
    id: 'AUD-001',
    no_rm: 'RM-001',
    nama_pasien: 'Budi Santoso',
    unit: 'Poli Penyakit Dalam',
    dpjp: 'dr. Andi Pratama, Sp.PD',
    tgl_pelayanan: '2026-09-18',
    identitas_lengkap: true,
    anamnesa_lengkap: true,
    icd10_lengkap: true,
    icd9_lengkap: true,
    informed_consent: 'NA',
    resume_medis: true,
    tte_dpjp: true,
    status: 'LENGKAP',
    tgl_audit: '2026-09-19'
  },
  {
    id: 'AUD-002',
    no_rm: 'RM-002',
    nama_pasien: 'Siti Aminah',
    unit: 'Rawat Inap Bangsal Kebidanan',
    dpjp: 'dr. Ratna, Sp.OG',
    tgl_pelayanan: '2026-09-17',
    identitas_lengkap: true,
    anamnesa_lengkap: true,
    icd10_lengkap: true,
    icd9_lengkap: true,
    informed_consent: 'TIDAK_LENGKAP',
    resume_medis: false,
    tte_dpjp: false,
    status: 'TIDAK_LENGKAP',
    catatan_auditor: 'Resume medis rawat inap belum diisi dan belum di-TTE DPJP',
    tgl_audit: '2026-09-18'
  },
  {
    id: 'AUD-003',
    no_rm: 'RM-003',
    nama_pasien: 'Ahmad Fauzi',
    unit: 'Poli Bedah',
    dpjp: 'dr. Hendra, Sp.B',
    tgl_pelayanan: '2026-09-18',
    identitas_lengkap: true,
    anamnesa_lengkap: true,
    icd10_lengkap: true,
    icd9_lengkap: false,
    informed_consent: 'LENGKAP',
    resume_medis: true,
    tte_dpjp: true,
    status: 'TIDAK_LENGKAP',
    catatan_auditor: 'Kode ICD-9 tindakan pembedahan belum diinput koder',
    tgl_audit: '2026-09-19'
  },
  {
    id: 'AUD-004',
    no_rm: 'RM-004',
    nama_pasien: 'Dewi Lestari',
    unit: 'IGD (Gawat Darurat)',
    dpjp: 'dr. Rian (Dokter Jaga IGD)',
    tgl_pelayanan: '2026-09-19',
    identitas_lengkap: true,
    anamnesa_lengkap: true,
    icd10_lengkap: true,
    icd9_lengkap: true,
    informed_consent: 'NA',
    resume_medis: true,
    tte_dpjp: false,
    status: 'TIDAK_LENGKAP',
    catatan_auditor: 'Tanda tangan elektronik (TTE) DPJP pending',
    tgl_audit: '2026-09-19'
  }
];

export function AuditKLPCMTab() {
  const { pasien, dokter } = useHospital();
  const toast = useToast();

  const [audits, setAudits] = useState<KLPCMAuditItem[]>(() => {
    const saved = localStorage.getItem('hospital_rme_klpcm_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDITS;
  });

  useEffect(() => {
    localStorage.setItem('hospital_rme_klpcm_audits', JSON.stringify(audits));
  }, [audits]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'SEMUA' | 'LENGKAP' | 'TIDAK_LENGKAP'>('SEMUA');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Form State for new audit
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [unit, setUnit] = useState('Poli Penyakit Dalam');
  const [identitas, setIdentitas] = useState(true);
  const [anamnesa, setAnamnesa] = useState(true);
  const [icd10, setIcd10] = useState(true);
  const [icd9, setIcd9] = useState(true);
  const [informedConsent, setInformedConsent] = useState<'LENGKAP' | 'TIDAK_LENGKAP' | 'NA'>('LENGKAP');
  const [resumeMedis, setResumeMedis] = useState(true);
  const [tteDpjp, setTteDpjp] = useState(true);
  const [catatan, setCatatan] = useState('');

  // Stats calculation
  const total = audits.length;
  const completeCount = audits.filter(a => a.status === 'LENGKAP').length;
  const incompleteCount = audits.filter(a => a.status === 'TIDAK_LENGKAP').length;
  const missingTteCount = audits.filter(a => !a.tte_dpjp).length;
  const complianceRate = total > 0 ? Math.round((completeCount / total) * 100) : 100;

  const filtered = audits.filter(a => {
    const matchStatus = filterStatus === 'SEMUA' || a.status === filterStatus;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      a.no_rm.toLowerCase().includes(term) ||
      a.nama_pasien.toLowerCase().includes(term) ||
      a.dpjp.toLowerCase().includes(term) ||
      a.unit.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const handleSendReminderToDpjp = (audit: KLPCMAuditItem) => {
    setAudits(prev => prev.map(a => {
      if (a.id === audit.id) {
        return { ...a, notifikasi_terkirim: true };
      }
      return a;
    }));

    toast.success(`Pengingat KLPCM berhasil dikirim ke DPJP (${audit.dpjp}) melalui WhatsApp & Inbox SIMK.`);
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = (pasien || []).find(item => item.id === selectedPatientId);
    if (!p) {
      toast.error('Pilih pasien yang diaudit!');
      return;
    }
    const doc = (dokter || []).find(item => item.id === selectedDoctorId);

    const isComplete = identitas && anamnesa && icd10 && icd9 && 
      (informedConsent === 'LENGKAP' || informedConsent === 'NA') && 
      resumeMedis && tteDpjp;

    const newAudit: KLPCMAuditItem = {
      id: `AUD-${Date.now()}`,
      no_rm: p.no_rm,
      nama_pasien: p.nama,
      unit,
      dpjp: doc ? doc.nama : 'dr. DPJP Terkait',
      tgl_pelayanan: new Date().toISOString().split('T')[0],
      identitas_lengkap: identitas,
      anamnesa_lengkap: anamnesa,
      icd10_lengkap: icd10,
      icd9_lengkap: icd9,
      informed_consent: informedConsent,
      resume_medis: resumeMedis,
      tte_dpjp: tteDpjp,
      status: isComplete ? 'LENGKAP' : 'TIDAK_LENGKAP',
      catatan_auditor: catatan.trim() || undefined,
      tgl_audit: new Date().toISOString().split('T')[0]
    };

    setAudits([newAudit, ...audits]);
    setIsAuditModalOpen(false);
    toast.success(`Hasil Audit KLPCM untuk RM Pasien ${p.nama} (${p.no_rm}) berhasil disimpan.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Audit KLPCM (Ketidaklengkapan Pengisian Catatan Medis)
          </h1>
          <p className="text-slate-500 text-sm">
            Indikator Mutu Nasional (IMN) Kemenkes & Akreditasi KARS / STARKES Bab MRMIK
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Audit Berkas Pasien Baru</span>
          </button>
          <PrintPDFButton
            filename="Laporan_Mutu_KLPCM"
            label="Cetak Laporan Mutu"
            className="text-xs bg-slate-800 text-white hover:bg-slate-700 px-3.5 py-2.5 rounded-xl font-bold shadow-sm"
          />
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COMPLIANCE RATE */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase">Angka Kepatuhan (IMN)</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${
              complianceRate >= 95 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              Target ≥ 95%
            </span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {complianceRate}%
          </div>
          <span className="text-[11px] text-slate-500">
            {complianceRate >= 95 ? '✓ Memenuhi standar akreditasi' : '⚠️ Di bawah target nasional'}
          </span>
        </div>

        {/* LENGKAP */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Berkas Lengkap (100%)</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {completeCount}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Dari {total} berkas terverifikasi</span>
        </div>

        {/* TIDAK LENGKAP */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Berkas Belum Lengkap (KLPCM)</span>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {incompleteCount}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">Perlu tindakan DPJP / Koder</span>
        </div>

        {/* TANPA TTE DPJP */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending TTE DPJP</span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {missingTteCount}
          </div>
          <span className="text-[11px] text-amber-500 font-medium">Belum ditandatangani dokter</span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. RM, Pasien, DPJP, Unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['SEMUA', 'LENGKAP', 'TIDAK_LENGKAP'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st === 'SEMUA' ? 'Semua Berkas' : st === 'LENGKAP' ? 'Lengkap (100%)' : 'Belum Lengkap (KLPCM)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AUDIT TABLE */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">No. RM & Pasien</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">DPJP & Unit</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Identitas & SOAP</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Koding ICD</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Resume Medis</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">TTE DPJP</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Status Audit</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Aksi / Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs block">
                      {item.no_rm}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.nama_pasien}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Tgl Pelayanan: {item.tgl_pelayanan}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                      {item.dpjp}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      {item.unit}
                    </span>
                    {item.catatan_auditor && (
                      <span className="text-[11px] text-rose-500 dark:text-rose-400 block italic mt-1 bg-rose-50 dark:bg-rose-950/40 p-1.5 rounded border border-rose-200 dark:border-rose-900/50">
                        Catatan: {item.catatan_auditor}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex flex-col items-center gap-1 text-[11px]">
                      <span className={item.identitas_lengkap ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {item.identitas_lengkap ? '✓ Identitas' : '✗ Identitas'}
                      </span>
                      <span className={item.anamnesa_lengkap ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {item.anamnesa_lengkap ? '✓ SOAP' : '✗ SOAP'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex flex-col items-center gap-1 text-[11px]">
                      <span className={item.icd10_lengkap ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {item.icd10_lengkap ? '✓ ICD-10' : '✗ ICD-10'}
                      </span>
                      <span className={item.icd9_lengkap ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                        {item.icd9_lengkap ? '✓ ICD-9' : '✗ ICD-9'}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    {item.resume_medis ? (
                      <span className="text-emerald-600 font-bold text-xs">✓ Lengkap</span>
                    ) : (
                      <span className="text-rose-500 font-bold text-xs">✗ Belum Ada</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.tte_dpjp ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Valid TTE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                        <XCircle className="w-3 h-3" /> Pending TTE
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.status === 'LENGKAP' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        LENGKAP
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        KLPCM
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.status === 'TIDAK_LENGKAP' && (
                      <button
                        onClick={() => handleSendReminderToDpjp(item)}
                        disabled={item.notifikasi_terkirim}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all mx-auto ${
                          item.notifikasi_terkirim
                            ? 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        title="Kirim pengingat KLPCM ke DPJP"
                      >
                        <Send className="w-3 h-3" />
                        <span>{item.notifikasi_terkirim ? 'Terkirim' : 'Ingatkan DPJP'}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan data audit KLPCM.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL AUDIT BERKAS BARU */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Audit Kelengkapan Berkas Medis (Form KLPCM)
              </h3>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-4 text-xs">
              {/* PASIEN */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Pasien *
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="">-- Pilih Pasien Rekam Medis --</option>
                  {(pasien || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} — {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* DPJP & UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dokter DPJP Terkait *
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {(dokter || []).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit Pelayanan
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                    <option value="Poli Anak">Poli Anak</option>
                    <option value="Poli Bedah">Poli Bedah</option>
                    <option value="Poli Kebidanan & Kandungan">Poli Kebidanan & Kandungan</option>
                    <option value="IGD (Gawat Darurat)">IGD (Gawat Darurat)</option>
                    <option value="Rawat Inap Bangsal Melati">Rawat Inap Bangsal Melati</option>
                    <option value="Rawat Inap Bangsal Mawar">Rawat Inap Bangsal Mawar</option>
                  </select>
                </div>
              </div>

              {/* CHECKLIST ELEMEN */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Checklist Elemen Mutu Rekam Medis:
                </span>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={identitas}
                    onChange={(e) => setIdentitas(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Kelengkapan Identitas Pasien (Nama, NIK, Tgl Lahir, Alamat, No. Telp)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anamnesa}
                    onChange={(e) => setAnamnesa(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Anamnesa & Pemeriksaan Fisik (SOAP) terisi lengkap</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={icd10}
                    onChange={(e) => setIcd10(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Diagnosis Utama & Sekunder terisi dengan kode ICD-10 yang valid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={icd9}
                    onChange={(e) => setIcd9(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tindakan / Prosedur Medis terisi dengan kode ICD-9-CM</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resumeMedis}
                    onChange={(e) => setResumeMedis(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ringkasan Pulang (Resume Medis) terisi lengkap dalam 24 jam</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tteDpjp}
                    onChange={(e) => setTteDpjp(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tanda Tangan Elektronik (TTE) Dokter DPJP lengkap & terverifikasi</span>
                </label>
              </div>

              {/* CATATAN */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Auditor KLPCM
                </label>
                <textarea
                  rows={2}
                  placeholder="Keterangan kekurangan dokumen atau instruksi perbaikan..."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Simpan Audit KLPCM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
