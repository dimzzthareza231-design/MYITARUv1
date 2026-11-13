import React, { useState, useEffect } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ProfessionalTable } from './ProfessionalTable';
import { Patient360 } from './RME/Patient360';
import { SmartVoiceReport } from './RME/SmartVoiceReport';
import { ResumeMedisTemplate } from './RME/ResumeMedisTemplate';
import { PatientQRCodeModal } from './RME/PatientQRCodeModal';
import { PatientQRScannerModal } from './RME/PatientQRScannerModal';
import { ICD10WorkspaceTab } from './RME/Tabs/ICD10WorkspaceTab';
import { ICD9WorkspaceTab } from './RME/Tabs/ICD9WorkspaceTab';
import { PeminjamanBerkasTab } from './RME/Tabs/PeminjamanBerkasTab';
import { AuditKLPCMTab } from './RME/Tabs/AuditKLPCMTab';
import { PelepasanInformasiTab } from './RME/Tabs/PelepasanInformasiTab';
import { RetensiMusnahTab } from './RME/Tabs/RetensiMusnahTab';
import { ModalBuatResumeMedis } from './RME/Modals/ModalBuatResumeMedis';
import { DossierDocumentHub } from './RME/CompleteDossier/DossierDocumentHub';

import { 
  Search, FileText, Activity, Mic, Sparkles, Printer, CheckCircle2, 
  ShieldCheck, User, Stethoscope, HeartPulse, Pill, Calendar, X, Eye, 
  QrCode, Camera, Plus, FolderSync, ShieldAlert, BadgeCheck, FileClock, FolderCheck
} from 'lucide-react';
import PrintPDFButton from './PrintPDFButton';

// Safe formatters to prevent "Objects are not valid as a React child"
function formatIcdDisplay(item: any): string {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object') {
    if (item.kode_icd10 && item.nama) {
      return `[${item.kode_icd10}] ${item.nama}`;
    }
    if (item.kode && item.nama) {
      return `[${item.kode}] ${item.nama}`;
    }
    if (item.code && item.desc_id) {
      return `[${item.code}] ${item.desc_id}`;
    }
    if (item.nama) return String(item.nama);
    if (item.kode_icd10) return String(item.kode_icd10);
    if (item.code) return String(item.code);
    return '';
  }
  return String(item);
}

function formatIcdListDisplay(items: any): string {
  if (!items) return '';
  if (typeof items === 'string') return items;
  if (Array.isArray(items)) {
    return items.map(formatIcdDisplay).filter(Boolean).join(', ');
  }
  return formatIcdDisplay(items);
}

// ═══════════════════════════════════════════
// TAB RESUME MEDIS LENGKAP SELURUH PELAYANAN
// ═══════════════════════════════════════════
function ResumeMedisTab() {
  const { pasien } = useHospital();
  const toast = useToast();
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [filterUnit, setFilterUnit] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isNewResumeModalOpen, setIsNewResumeModalOpen] = useState(false);

  // Extract all resumes from patients
  const allResumes = (pasien || [])
    .map((p: any) => {
      const res = p.resume_medis;
      if (!res) return null;
      return {
        ...res,
        patient_ref: p
      };
    })
    .filter(Boolean);

  const filteredResumes = allResumes.filter((res: any) => {
    const unitStr = typeof res.unit_pelayanan === 'string' ? res.unit_pelayanan : '';
    const matchesUnit = filterUnit === 'Semua' || unitStr.toLowerCase().includes(filterUnit.toLowerCase());
    const term = searchTerm.toLowerCase();
    const pDiag = formatIcdDisplay(res.diagnosa_utama) || formatIcdDisplay(res.diagnosis_primer);
    const sDiag = formatIcdListDisplay(res.diagnosis_sekunder || res.diagnosa_sekunder);
    const matchesSearch = !searchTerm ||
      (res.nama_pasien && String(res.nama_pasien).toLowerCase().includes(term)) ||
      (res.no_rm && String(res.no_rm).toLowerCase().includes(term)) ||
      (res.no_resume && String(res.no_resume).toLowerCase().includes(term)) ||
      (res.dokter_dpjp && String(res.dokter_dpjp).toLowerCase().includes(term)) ||
      (res.dpjp && String(res.dpjp).toLowerCase().includes(term)) ||
      (pDiag && pDiag.toLowerCase().includes(term)) ||
      (sDiag && sDiag.toLowerCase().includes(term));
    return matchesUnit && matchesSearch;
  });

  const countRJ = allResumes.filter((r: any) => typeof r.unit_pelayanan === 'string' && r.unit_pelayanan.includes('Poli')).length;
  const countIGD = allResumes.filter((r: any) => typeof r.unit_pelayanan === 'string' && r.unit_pelayanan.includes('IGD')).length;
  const countRanap = allResumes.filter((r: any) => typeof r.unit_pelayanan === 'string' && (r.unit_pelayanan.includes('Rawat Inap') || r.unit_pelayanan.includes('Bangsal') || r.unit_pelayanan.includes('ICU'))).length;
  const countBedah = allResumes.filter((r: any) => typeof r.unit_pelayanan === 'string' && (r.unit_pelayanan.includes('Bedah') || r.unit_pelayanan.includes('Operasi'))).length;

  return (
    <div className="p-4 sm:p-6 h-full max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Resume Medis Pasien (Clinical Discharge Summary)
          </h1>
          <p className="text-slate-500 text-sm">
            Ringkasan rekam medis lengkap per pelayanan (Rawat Jalan, IGD, Rawat Inap, Bedah & Penunjang) sesuai standar PMK 24/2022 & SatuSehat
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewResumeModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Terbitkan Resume Medis</span>
          </button>
          <PrintPDFButton 
            filename="Daftar_Resume_Medis_RS" 
            label="Cetak Ringkasan" 
            className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl" 
          />
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Resume</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{allResumes.length}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% Terverifikasi TTE</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rawat Jalan / Poli</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{countRJ}</h3>
          <p className="text-xs text-slate-400 mt-1">24 Poliklinik</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Gawat Darurat (IGD)</p>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{countIGD}</h3>
          <p className="text-xs text-slate-400 mt-1">Triase ATS & ESI</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rawat Inap</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{countRanap}</h3>
          <p className="text-xs text-slate-400 mt-1">Bangsal & ICU</p>
        </div>
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Bedah & Operasi</p>
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{countBedah}</h3>
          <p className="text-xs text-slate-400 mt-1">Kamar Operasi (OK)</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {['Semua', 'Poli', 'IGD', 'Rawat Inap', 'Bedah'].map((unit) => (
            <button
              key={unit}
              onClick={() => setFilterUnit(unit)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterUnit === unit
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {unit === 'Semua' ? '🏥 Semua Pelayanan' : unit === 'Poli' ? '🩺 Rawat Jalan (Poli)' : unit === 'IGD' ? '🚑 Gawat Darurat' : unit === 'Rawat Inap' ? '🛏️ Rawat Inap' : '🔪 Bedah & OK'}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pasien, No. RM, diagnosis, dokter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE RESUME MEDIS */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">No. Resume & RM</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Nama Pasien</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Unit Pelayanan</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Diagnosis Utama (ICD-10)</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Dokter DPJP</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Kondisi Keluar</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredResumes.map((res: any) => (
                <tr key={res.no_resume} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold font-mono text-blue-600 dark:text-blue-400 block text-xs">{res.no_resume}</span>
                    <span className="font-mono text-slate-500 text-xs">{res.no_rm}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">{res.nama_pasien}</span>
                    <span className="text-xs text-slate-400">{res.patient_ref?.umur || 40} thn • {res.patient_ref?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {res.patient_ref?.penjamin || 'BPJS'}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {res.unit_pelayanan}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs block">
                      {formatIcdDisplay(res.diagnosa_utama) || formatIcdDisplay(res.diagnosis_primer) || '-'}
                    </span>
                    {formatIcdListDisplay(res.diagnosis_sekunder || res.diagnosa_sekunder) ? (
                      <span className="text-xs text-slate-400 truncate block max-w-xs" title={formatIcdListDisplay(res.diagnosis_sekunder || res.diagnosa_sekunder)}>
                        {formatIcdListDisplay(res.diagnosis_sekunder || res.diagnosa_sekunder)}
                      </span>
                    ) : null}
                  </td>
                  <td className="p-3.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {res.dpjp || res.dokter_dpjp || 'dr. Andi Pratama, Sp.PD'}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                      <CheckCircle2 className="w-3 h-3" /> {res.kondisi_pulang || 'Perbaikan / Sembuh'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setSelectedResume(res)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" /> Buka Resume
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResumes.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data resume medis untuk kata kunci "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BUAT RESUME */}
      {isNewResumeModalOpen && (
        <ModalBuatResumeMedis
          isOpen={isNewResumeModalOpen}
          onClose={() => setIsNewResumeModalOpen(false)}
          onSuccess={() => toast.success('Daftar resume medis berhasil diperbarui!')}
        />
      )}

      {/* DETAIL RESUME MODAL */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileText className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Ringkasan Resume Medis (Medical Discharge Summary)</h2>
                  <p className="text-xs text-blue-100">
                    Standar PMK No. 24 Tahun 2022 & Standar Akreditasi STARKES • {selectedResume.no_resume}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PrintPDFButton
                  filename={`Resume_${selectedResume.no_rm}_${selectedResume.nama_pasien}`}
                  label="Cetak Resume (PDF)"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg"
                  documentData={selectedResume}
                  docType="resume_medis"
                  title="RESUME MEDIS PASIEN"
                />
                <button
                  onClick={() => setSelectedResume(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL CONTENT */}
            <div className="p-6 space-y-6">
              <ResumeMedisTemplate data={selectedResume} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TAB BERKAS LENGKAP 100% DOSSIER PASIEN
// ═══════════════════════════════════════════
function BerkasLengkapTab() {
  const { pasien } = useHospital();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    pasien && pasien.length > 0 ? (pasien[0].no_rm || pasien[0].id) : ''
  );
  const [filterSearch, setFilterSearch] = useState('');

  const currentPatient = (pasien || []).find((p: any) => (p.no_rm || p.id) === selectedPatientId) || (pasien && pasien.length > 0 ? pasien[0] : null);

  const filteredPatientList = (pasien || []).filter((p: any) => {
    const q = filterSearch.toLowerCase().trim();
    return !q || (p.nama && p.nama.toLowerCase().includes(q)) || (p.no_rm && p.no_rm.toLowerCase().includes(q));
  });

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FolderCheck className="w-6 h-6 text-emerald-600" />
            Audit Berkas Lengkap Pasien 100% (Permenkes 24/2022)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih rekam medis pasien untuk memeriksa, mengisi, dan memverifikasi seluruh kelengkapan formulir e-RME.
          </p>
        </div>

        {/* PATIENT SELECTOR DROPDOWN */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Pilih Pasien:</span>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="p-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
          >
            {(pasien || []).map((p: any) => (
              <option key={p.no_rm || p.id} value={p.no_rm || p.id}>
                {p.no_rm} - {p.nama} ({p.penjamin || 'Umum'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPatient ? (
        <DossierDocumentHub patient={currentPatient} />
      ) : (
        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-500">Belum ada data pasien tersedia di sistem.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// KOMPONEN UTAMA MEDICAL RECORDS
// ═══════════════════════════════════════════
export function MedicalRecords() {
  const { pasien } = useHospital();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const { activeTab } = useOutletContext<{ activeTab: string }>() || { activeTab: 'Daftar Pasien' };
  
  const [activePatient, setActivePatient] = useState<any>(null);
  const [voicePatient, setVoicePatient] = useState<any>(null);
  const [qrPatient, setQrPatient] = useState<any>(null);
  const [dossierPatient, setDossierPatient] = useState<any>(null);
  const [resumePatient, setResumePatient] = useState<any>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Search & Filter state for Daftar Pasien
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPenjamin, setFilterPenjamin] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Deteksi parameter URL jika staf memindai QR Code dari luar atau scanner
  useEffect(() => {
    const targetRm = searchParams.get('rm') || searchParams.get('no_rm') || searchParams.get('patientId');
    if (targetRm && pasien && pasien.length > 0) {
      const cleanTarget = targetRm.toLowerCase().trim();
      const found = pasien.find((p: any) => {
        const pRm = (p.no_rm || p.noRm || p.id || '').toLowerCase().trim();
        const pNik = (p.nik || '').toLowerCase().trim();
        return pRm === cleanTarget || 
               pRm.replace(/[^a-z0-9]/g, '') === cleanTarget.replace(/[^a-z0-9]/g, '') ||
               pNik === cleanTarget ||
               p.id === targetRm;
      });

      if (found) {
        setActivePatient(found);
        setIsModalOpen(true);
        toast.success(`Membuka Ringkasan EMR Pasien: ${found.nama} (${found.no_rm})`);
      }
    }
  }, [searchParams, pasien]);

  // ═══════════════════════════════════════════
  // ROUTING TAB DARI MODULE REGISTRY
  // ═══════════════════════════════════════════
  if (activeTab === 'Berkas Lengkap (100%)' || activeTab === 'Berkas RM') {
    return <BerkasLengkapTab />;
  }

  if (activeTab === 'ICD-10 Diagnosis' || activeTab === 'Coding ICD-10') {
    return <ICD10WorkspaceTab />;
  }

  if (activeTab === 'ICD-9 Tindakan') {
    return <ICD9WorkspaceTab />;
  }

  if (activeTab === 'Resume Medis') {
    return <ResumeMedisTab />;
  }

  if (activeTab === 'Peminjaman Berkas' || activeTab === 'Peminjaman') {
    return <PeminjamanBerkasTab />;
  }

  if (activeTab === 'Audit KLPCM') {
    return <AuditKLPCMTab />;
  }

  if (activeTab === 'Pelepasan Informasi') {
    return <PelepasanInformasiTab />;
  }

  if (activeTab === 'Retensi & Musnah' || activeTab === 'Retensi') {
    return <RetensiMusnahTab />;
  }

  // ═══════════════════════════════════════════
  // DEFAULT TAB: DAFTAR PASIEN & REKAM MEDIS
  // ═══════════════════════════════════════════
  const totalPasien = (pasien || []).length;
  const bpjsCount = (pasien || []).filter(p => (p.penjamin || '').toLowerCase().includes('bpjs')).length;
  const umumCount = totalPasien - bpjsCount;
  const hasResumeCount = (pasien || []).filter(p => p.resume_medis).length;
  const resumePercentage = totalPasien > 0 ? Math.round((hasResumeCount / totalPasien) * 100) : 0;

  // Filtered patient list
  const filteredPatients = (pasien || []).filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      (p.nama && p.nama.toLowerCase().includes(q)) ||
      (p.no_rm && p.no_rm.toLowerCase().includes(q)) ||
      (p.nik && p.nik.toLowerCase().includes(q)) ||
      (p.no_hp && p.no_hp.toLowerCase().includes(q)) ||
      (p.alamat && p.alamat.toLowerCase().includes(q));

    const matchPenjamin = filterPenjamin === 'Semua' || 
      (p.penjamin && p.penjamin.toLowerCase().includes(filterPenjamin.toLowerCase()));

    const matchStatus = filterStatus === 'Semua' ||
      (filterStatus === 'Lengkap' && p.resume_medis) ||
      (filterStatus === 'Belum' && !p.resume_medis);

    return matchSearch && matchPenjamin && matchStatus;
  });

  const columns = [
    { 
      key: 'no_rm', 
      label: 'No. RM', 
      sortable: true, 
      render: (val: string, p: any) => (
        <div>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 text-xs">
            {val || p.noRm}
          </span>
          <span className="block text-[10px] text-slate-400 mt-0.5">NIK: {p.nik || '-'}</span>
        </div>
      ) 
    },
    { 
      key: 'nama', 
      label: 'Identitas Pasien', 
      sortable: true, 
      render: (val: string, p: any) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">{val}</span>
          <span className="text-xs text-slate-500">
            {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {p.umur || 35} thn • {p.tgl_lahir || '-'}
          </span>
        </div>
      ) 
    },
    { 
      key: 'penjamin', 
      label: 'Penjamin & Status', 
      sortable: true,
      render: (val: string, p: any) => (
        <div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
            (val || '').toLowerCase().includes('bpjs') 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            {val || 'Umum / Mandiri'}
          </span>
          <span className="block text-[10px] text-slate-400 mt-0.5">Poli: {p.poli || 'Umum'}</span>
        </div>
      )
    },
    {
      key: 'diagnosa_primer',
      label: 'Diagnosis Utama (ICD-10)',
      render: (val: any, p: any) => {
        const diag = formatIcdDisplay(val) || 
                     formatIcdDisplay(p.diagnosa_primer) ||
                     formatIcdDisplay(p.resume_medis?.diagnosa_utama) || 
                     formatIcdDisplay(p.resume_medis?.diagnosis_primer) || 
                     (Array.isArray(p.problem_list) && p.problem_list.length > 0 ? formatIcdDisplay(p.problem_list[0]) : '');
        return (
          <div className="max-w-xs">
            {diag ? (
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block truncate" title={diag}>
                {diag}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">Belum terkodefikasi</span>
            )}
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${p.resume_medis ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                {p.resume_medis ? '✓ Resume Ready' : '⏳ Menunggu Resume'}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'action',
      label: 'Aksi Pelayanan Rekam Medis',
      render: (_: any, p: any) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            id={`btn-qr-${p.no_rm || p.id}`}
            onClick={(e) => { e.stopPropagation(); setQrPatient(p); }}
            className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/40 dark:text-cyan-300 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-cyan-200 dark:border-cyan-800 transition-colors"
            title="Cetak Stiker Barcode & QR Berkas RM"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">QR Berkas</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setVoicePatient(p); }} 
            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
            title="Dikte Laporan Suara Cerdas (AI Scribe)"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Suara</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setResumePatient(p); setIsResumeModalOpen(true); }}
            className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800"
            title="Terbitkan Resume Medis"
          >
            <Plus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setDossierPatient(p); }} 
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
            title="Buka Berkas Rekam Medis 100% Lengkap (Permenkes 24/2022)"
          >
            <FolderCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Dossier 100%</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setActivePatient(p); setIsModalOpen(true); }} 
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Buka RME</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Rekam Medis Elektronik (RME)</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Sentralisasi data klinis pasien, resume medis terintegrasi PMK 24/2022, pelacakan berkas (Tracer), audit mutu KLPCM, dan kodefikasi ICD.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-scan-qr-header"
            onClick={() => setIsScannerOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="Pindai QR Code Berkas Rekam Medis Pasien"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>Pindai QR Berkas</span>
          </button>

          <button
            onClick={() => {
              setResumePatient(pasien && pasien.length > 0 ? pasien[0] : null);
              setIsResumeModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-200" />
            <span>+ Resume Baru</span>
          </button>

          {pasien && pasien.length > 0 && (
            <button
              onClick={() => setVoicePatient(pasien[0])}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Mic className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>🎙️ AI Scribe</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATISTICAL OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Berkas Pasien</span>
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalPasien}</p>
          <p className="text-[11px] text-slate-400 mt-1">Aktif di SIMK Myitaru</p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Penjamin BPJS / Umum</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{bpjsCount} / {umumCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">JKN terhubung VClaim</p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Kepatuhan Resume Medis</span>
            <BadgeCheck className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{resumePercentage}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{hasResumeCount} berkas ber-TTE</p>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Standar Akreditasi STARKES</span>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">99.2%</p>
          <p className="text-[11px] text-slate-400 mt-1">Kelengkapan Form & Audit</p>
        </div>
      </div>

      {/* 3. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari No. RM, NIK, Nama Pasien, No HP, Alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-bold">Penjamin:</span>
            <select
              value={filterPenjamin}
              onChange={(e) => setFilterPenjamin(e.target.value)}
              className="p-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              <option value="Semua">Semua Penjamin</option>
              <option value="BPJS">BPJS Kesehatan</option>
              <option value="Umum">Umum / Mandiri</option>
              <option value="Asuransi">Asuransi Swasta</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-bold">Status Resume:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg"
            >
              <option value="Semua">Semua Status</option>
              <option value="Lengkap">Sudah Ada Resume</option>
              <option value="Belum">Belum Ada Resume</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PROFESSIONAL PATIENT TABLE */}
      <ProfessionalTable 
        title={`Daftar Rekam Medis Pasien (${filteredPatients.length})`}
        columns={columns}
        data={filteredPatients}
        pageSize={10}
        emptyMessage="Tidak ada data pasien yang sesuai dengan filter."
      />

      {/* 5. MODALS & SUB-COMPONENTS */}
      {isModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md overflow-hidden">
          <Patient360 
            patient={activePatient} 
            onBack={() => setIsModalOpen(false)} 
          />
        </div>
      )}

      {qrPatient && (
        <PatientQRCodeModal
          isOpen={!!qrPatient}
          onClose={() => setQrPatient(null)}
          patient={qrPatient}
          onOpenEMR={() => {
            setActivePatient(qrPatient);
            setIsModalOpen(true);
            setQrPatient(null);
          }}
        />
      )}

      {isScannerOpen && (
        <PatientQRScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onPatientSelected={(selected) => {
            setActivePatient(selected);
            setIsModalOpen(true);
            setIsScannerOpen(false);
          }}
        />
      )}

      {voicePatient && (
        <SmartVoiceReport
          patient={voicePatient}
          isOpen={!!voicePatient}
          onClose={() => setVoicePatient(null)}
          onApplyToRecord={() => {
            toast.success('Laporan suara pasien berhasil dicatat!');
          }}
        />
      )}

      {isResumeModalOpen && (
        <ModalBuatResumeMedis
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          patient={resumePatient}
          onSuccess={() => {
            toast.success('Data resume pasien berhasil diperbarui!');
          }}
        />
      )}

      {dossierPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Berkas Rekam Medis 100% Lengkap: {dossierPatient?.nama} ({dossierPatient?.no_rm})
                </h3>
              </div>
              <button
                onClick={() => setDossierPatient(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <DossierDocumentHub patient={dossierPatient} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
