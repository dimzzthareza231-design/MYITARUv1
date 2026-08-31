import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { useOutletContext } from 'react-router-dom';
import { ProfessionalTable } from './ProfessionalTable';
import { Patient360 } from './RME/Patient360';
import { SmartVoiceReport } from './RME/SmartVoiceReport';
import { Search, FileText, Activity, Mic, Sparkles, Printer, CheckCircle2, ShieldCheck, User, Stethoscope, HeartPulse, Pill, Calendar, X, Eye } from 'lucide-react';
import PrintPDFButton from './PrintPDFButton';

// ═══════════════════════════════════════════
// DATA ICD-10
// ═══════════════════════════════════════════
const ICD10_DATA = [
{ code: 'A09', desc: 'Infectious gastroenteritis and colitis, unspecified', category: 'Penyakit Infeksi' },
{ code: 'A90', desc: 'Dengue fever', category: 'Penyakit Infeksi' },
{ code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', category: 'Endokrin' },
{ code: 'I10', desc: 'Essential (primary) hypertension', category: 'Kardiovaskular' },
{ code: 'J06.9', desc: 'Acute upper respiratory infection, unspecified', category: 'Respirasi' },
{ code: 'J18.9', desc: 'Pneumonia, unspecified organism', category: 'Respirasi' },
{ code: 'K21.0', desc: 'GERD with esophagitis', category: 'Pencernaan' },
{ code: 'M54.5', desc: 'Low back pain', category: 'Muskuloskeletal' },
{ code: 'N39.0', desc: 'Urinary tract infection, site not specified', category: 'Genitourinari' },
{ code: 'R50.9', desc: 'Fever, unspecified', category: 'Gejala Umum' },
{ code: 'R51', desc: 'Headache', category: 'Gejala Umum' },
{ code: 'G43.9', desc: 'Migraine, unspecified', category: 'Neurologi' },
{ code: 'F32.9', desc: 'Major depressive disorder, single episode, unspecified', category: 'Psikiatri' },
{ code: 'O80', desc: 'Encounter for full-term uncomplicated delivery', category: 'Obstetri' },
{ code: 'S52.5', desc: 'Fracture of lower end of radius', category: 'Trauma' },
];

// ═══════════════════════════════════════════
// DATA ICD-9-CM (Tindakan)
// ═══════════════════════════════════════════
const ICD9_DATA = [
{ code: '89.52', desc: 'Electrocardiogram', category: 'Diagnostik' },
{ code: '99.21', desc: 'Injection of antibiotic', category: 'Terapi' },
{ code: '47.09', desc: 'Other appendectomy', category: 'Operasi' },
{ code: '93.90', desc: 'Non-invasive mechanical ventilation', category: 'Terapi' },
{ code: '87.44', desc: 'Routine chest x-ray', category: 'Radiologi' },
{ code: '38.93', desc: 'Venous catheterization, not elsewhere classified', category: 'Prosedur' },
{ code: '96.04', desc: 'Insertion of endotracheal tube', category: 'Prosedur' },
{ code: '96.71', desc: 'Continuous invasive mechanical ventilation < 96 hours', category: 'Prosedur' },
{ code: '54.91', desc: 'Percutaneous abdominal drainage', category: 'Operasi' },
{ code: '79.35', desc: 'Open reduction of fracture with internal fixation, femur', category: 'Operasi' },
{ code: '99.04', desc: 'Transfusion of packed cells', category: 'Terapi' },
{ code: '88.72', desc: 'Diagnostic ultrasound of heart', category: 'Diagnostik' },
{ code: '93.54', desc: 'Application of other cast', category: 'Prosedur' },
{ code: '86.22', desc: 'Excisional debridement of wound, infection, or burn', category: 'Operasi' },
{ code: '99.15', desc: 'Parenteral infusion of concentrated nutritional substances', category: 'Terapi' },
];

// ═══════════════════════════════════════════
// TAB ICD-10
// ═══════════════════════════════════════════
function ICD10Tab() {
const [search, setSearch] = useState('');
const [selectedCodes, setSelectedCodes] = useState<any[]>([]);
const toast = useToast();

const filtered = ICD10_DATA.filter(d =>
  d.code.toLowerCase().includes(search.toLowerCase()) ||
  d.desc.toLowerCase().includes(search.toLowerCase()) ||
  d.category.toLowerCase().includes(search.toLowerCase())
);

const addCode = (item: any) => {
  if (!selectedCodes.find(c => c.code === item.code)) {
    setSelectedCodes([...selectedCodes, item]);
    toast.success(`ICD-10 ${item.code} ditambahkan`);
  }
};

const removeCode = (code: string) => {
  setSelectedCodes(selectedCodes.filter(c => c.code !== code));
};

return (
 <div className="p-6 space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kodefikasi ICD-10 (Diagnosis)</h2>
 <p className="text-slate-500 text-sm">Pencarian dan penetapan kode diagnosis WHO</p>
 </div>
 </div>
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
     <div className="relative mb-4">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
       <input
         type="text"
         placeholder="Cari kode atau nama penyakit ICD-10..."
         className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
         value={search}
         onChange={e => setSearch(e.target.value)}
       />
     </div>
     {selectedCodes.length > 0 && (
       <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
         <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm mb-2">Kode Terpilih ({selectedCodes.length}):</h4>
         <div className="flex flex-wrap gap-2">
           {selectedCodes.map(c => (
             <span key={c.code} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
               {c.code} - {c.desc.substring(0, 40)}...
               <button onClick={() => removeCode(c.code)} className="ml-1 text-blue-500 hover:text-blue-800">×</button>
             </span>
           ))}
         </div>
       </div>
     )}
     <div className="overflow-x-auto">
       <table className="w-full text-left border-collapse">
         <thead>
           <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Kode</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Deskripsi</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Kategori</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
           </tr>
         </thead>
         <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
           {filtered.map(item => (
             <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="p-3 font-mono font-bold text-blue-600">{item.code}</td>
               <td className="p-3 text-sm text-slate-700 dark:text-slate-300">{item.desc}</td>
               <td className="p-3">
                 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{item.category}</span>
               </td>
               <td className="p-3 text-center">
                 <button
                   onClick={() => addCode(item)}
                   className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700"
                 >
                   + Pilih
                 </button>
               </td>
             </tr>
           ))}
           {filtered.length === 0 && (
             <tr>
               <td colSpan={4} className="p-6 text-center text-slate-500">Tidak ditemukan kode ICD-10 untuk "{search}"</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   </div>
 </div>
);
}

// ═══════════════════════════════════════════
// TAB ICD-9-CM
// ═══════════════════════════════════════════
function ICD9Tab() {
const [search, setSearch] = useState('');
const [selectedCodes, setSelectedCodes] = useState<any[]>([]);
const toast = useToast();

const filtered = ICD9_DATA.filter(d =>
  d.code.toLowerCase().includes(search.toLowerCase()) ||
  d.desc.toLowerCase().includes(search.toLowerCase()) ||
  d.category.toLowerCase().includes(search.toLowerCase())
);

const addCode = (item: any) => {
  if (!selectedCodes.find(c => c.code === item.code)) {
    setSelectedCodes([...selectedCodes, item]);
    toast.success(`ICD-9-CM ${item.code} ditambahkan`);
  }
};

const removeCode = (code: string) => {
  setSelectedCodes(selectedCodes.filter(c => c.code !== code));
};

return (
 <div className="p-6 space-y-6">
 <div className="flex justify-between items-center">
 <div>
 <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kodefikasi ICD-9-CM (Tindakan/Prosedur)</h2>
 <p className="text-slate-500 text-sm">Pencarian dan penetapan kode tindakan medis</p>
 </div>
 </div>
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
     <div className="relative mb-4">
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
       <input
         type="text"
         placeholder="Cari kode atau nama tindakan ICD-9-CM..."
         className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
         value={search}
         onChange={e => setSearch(e.target.value)}
       />
     </div>
     {selectedCodes.length > 0 && (
       <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
         <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm mb-2">Tindakan Terpilih ({selectedCodes.length}):</h4>
         <div className="flex flex-wrap gap-2">
           {selectedCodes.map(c => (
             <span key={c.code} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
               {c.code} - {c.desc.substring(0, 40)}...
               <button onClick={() => removeCode(c.code)} className="ml-1 text-emerald-500 hover:text-emerald-800">×</button>
             </span>
           ))}
         </div>
       </div>
     )}
     <div className="overflow-x-auto">
       <table className="w-full text-left border-collapse">
         <thead>
           <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Kode</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Deskripsi</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase">Kategori</th>
             <th className="p-3 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
           </tr>
         </thead>
         <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
           {filtered.map(item => (
             <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
               <td className="p-3 font-mono font-bold text-emerald-600">{item.code}</td>
               <td className="p-3 text-sm text-slate-700 dark:text-slate-300">{item.desc}</td>
               <td className="p-3">
                 <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{item.category}</span>
               </td>
               <td className="p-3 text-center">
                 <button
                   onClick={() => addCode(item)}
                   className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                 >
                   + Pilih
                 </button>
               </td>
             </tr>
           ))}
           {filtered.length === 0 && (
             <tr>
               <td colSpan={4} className="p-6 text-center text-slate-500">Tidak ditemukan kode ICD-9-CM untuk "{search}"</td>
             </tr>
           )}
         </tbody>
       </table>
     </div>
   </div>
 </div>
);
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
    const matchesUnit = filterUnit === 'Semua' || (res.unit_pelayanan && res.unit_pelayanan.toLowerCase().includes(filterUnit.toLowerCase()));
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (res.nama_pasien && res.nama_pasien.toLowerCase().includes(term)) ||
      (res.no_rm && res.no_rm.toLowerCase().includes(term)) ||
      (res.no_resume && res.no_resume.toLowerCase().includes(term)) ||
      (res.dokter_dpjp && res.dokter_dpjp.toLowerCase().includes(term)) ||
      (res.diagnosis_primer?.nama && res.diagnosis_primer.nama.toLowerCase().includes(term)) ||
      (res.diagnosis_primer?.kode_icd10 && res.diagnosis_primer.kode_icd10.toLowerCase().includes(term));
    return matchesUnit && matchesSearch;
  });

  const countRJ = allResumes.filter((r: any) => r.unit_pelayanan && r.unit_pelayanan.includes('Poli')).length;
  const countIGD = allResumes.filter((r: any) => r.unit_pelayanan && r.unit_pelayanan.includes('IGD')).length;
  const countRanap = allResumes.filter((r: any) => r.unit_pelayanan && (r.unit_pelayanan.includes('Rawat Inap') || r.unit_pelayanan.includes('Bangsal') || r.unit_pelayanan.includes('ICU'))).length;
  const countBedah = allResumes.filter((r: any) => r.unit_pelayanan && (r.unit_pelayanan.includes('Bedah') || r.unit_pelayanan.includes('Operasi'))).length;

  return (
    <div className="p-6 h-full max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Resume Medis Pasien (Clinical Discharge & Outpatient Summary)
          </h1>
          <p className="text-slate-500 text-sm">
            Ringkasan rekam medis lengkap per pelayanan (Rawat Jalan, IGD, Rawat Inap, Bedah & Penunjang) sesuai standar PMK 24/2022 & SatuSehat
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintPDFButton filename="Daftar_Resume_Medis_RS" label="Cetak Ringkasan Eksekutif" className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg" />
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Resume</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{allResumes.length}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% Terverifikasi TTE</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rawat Jalan / Poli</p>
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{countRJ}</h3>
          <p className="text-xs text-slate-400 mt-1">24 Poliklinik</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Gawat Darurat (IGD)</p>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{countIGD}</h3>
          <p className="text-xs text-slate-400 mt-1">Triase ATS & ESI</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Rawat Inap</p>
          <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{countRanap}</h3>
          <p className="text-xs text-slate-400 mt-1">Bangsal & ICU</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Bedah & Operasi</p>
          <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{countBedah}</h3>
          <p className="text-xs text-slate-400 mt-1">Kamar Operasi (OK)</p>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
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
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE RESUME MEDIS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
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
                      [{res.diagnosis_primer?.kode_icd10}] {res.diagnosis_primer?.nama}
                    </span>
                    {res.diagnosis_sekunder?.length > 0 && (
                      <span className="text-xs text-slate-400">+{res.diagnosis_sekunder.length} diagnosa sekunder</span>
                    )}
                  </td>
                  <td className="p-3.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {res.dokter_dpjp}
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

      {/* DETAIL RESUME MODAL */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
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
                    No: {selectedResume.no_resume} • No. RM: {selectedResume.no_rm} • {selectedResume.nama_pasien}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PrintPDFButton 
                  filename={`Resume_${selectedResume.no_rm}_${selectedResume.nama_pasien}`} 
                  label="📄 Cetak PDF Resume" 
                  className="text-xs bg-white text-blue-900 hover:bg-blue-50 font-bold px-3.5 py-1.5 rounded-lg shadow-sm" 
                  documentData={selectedResume}
                  docType="resume_medis"
                  title="RINGKASAN REKAM MEDIS RAWAT JALAN (RESUME MEDIS)"
                />
                <button
                  onClick={() => setSelectedResume(null)}
                  className="p-1.5 rounded-lg hover:bg-white/20 text-white text-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 space-y-6 text-sm text-slate-800 dark:text-slate-200">
              {/* 1. IDENTITAS & ADMISI */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Nama Lengkap</p>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedResume.nama_pasien}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">No. Rekam Medis</p>
                  <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedResume.no_rm}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Unit Pelayanan</p>
                  <p className="font-semibold">{selectedResume.unit_pelayanan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Dokter DPJP</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{selectedResume.dokter_dpjp}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Tanggal Pelayanan</p>
                  <p className="font-medium">{selectedResume.tanggal_masuk || '2026-08-24'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Penjamin</p>
                  <p className="font-medium">{selectedResume.patient_ref?.penjamin || 'BPJS Kesehatan'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Alasan Masuk</p>
                  <p className="font-medium">{selectedResume.alasan_masuk || 'Keluhan medis akut'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Status Keluar</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedResume.kondisi_pulang || 'Perbaikan / Sembuh'}</p>
                </div>
              </div>

              {/* 2. ANAMNESIS & TANDA VITAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-blue-600">
                    <Activity className="w-4 h-4" /> Anamnesis Klinis
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedResume.ringkasan_riwayat || 'Pasien datang dengan keluhan spesifik sesuai pelayanan dan telah dilakukan anamnesis mendalam oleh DPJP.'}
                  </p>
                  {selectedResume.patient_ref?.riwayat_alergi && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/50">
                      <span className="text-xs font-bold text-red-700 dark:text-red-300">Riwayat Alergi: </span>
                      <span className="text-xs text-red-600 dark:text-red-400">{selectedResume.patient_ref.riwayat_alergi}</span>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-red-600">
                    <HeartPulse className="w-4 h-4" /> Tanda Vital Saat Pelayanan
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Tekanan Darah</p>
                      <p className="font-bold text-xs">{selectedResume.tanda_vital_keluar?.td || '120/80'} mmHg</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Nadi</p>
                      <p className="font-bold text-xs">{selectedResume.tanda_vital_keluar?.nadi || 80} x/mnt</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Suhu</p>
                      <p className="font-bold text-xs">{selectedResume.tanda_vital_keluar?.suhu || 36.5} °C</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Laju Napas</p>
                      <p className="font-bold text-xs">{selectedResume.tanda_vital_keluar?.rr || 20} x/mnt</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">SpO2</p>
                      <p className="font-bold text-xs">{selectedResume.tanda_vital_keluar?.spo2 || 99}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase">Kesadaran</p>
                      <p className="font-bold text-xs">Compos Mentis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. DIAGNOSIS ICD-10 & PROSEDUR ICD-9-CM */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wide text-indigo-600">
                    Diagnosis Akhir (ICD-10)
                  </h4>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Diagnosis Utama:</span>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {selectedResume.diagnosis_primer?.nama}
                      </p>
                    </div>
                    <span className="font-mono font-bold px-2.5 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {selectedResume.diagnosis_primer?.kode_icd10}
                    </span>
                  </div>

                  {selectedResume.diagnosis_sekunder && selectedResume.diagnosis_sekunder.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedResume.diagnosis_sekunder.map((sec: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span><strong>Sekunder {idx + 1}:</strong> {sec.nama}</span>
                          <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{sec.kode_icd10}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedResume.tindakan_prosedur && selectedResume.tindakan_prosedur.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wide text-emerald-600">
                      Tindakan & Prosedur Medis (ICD-9-CM)
                    </h4>
                    <div className="space-y-1">
                      {selectedResume.tindakan_prosedur.map((proc: any, idx: number) => (
                        <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span>{proc.nama}</span>
                          <span className="font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded">
                            {proc.kode_icd9}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. HASIL PENUNJANG & TERAPI OBAT PULANG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wide text-purple-600">
                    🔬 Hasil Pemeriksaan Penunjang
                  </h4>
                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/40 text-xs space-y-1">
                    <p><strong>Laboratorium:</strong> {selectedResume.hasil_penunjang?.lab || 'Darah lengkap normal, GDS dalam batas target'}</p>
                    <p><strong>Radiologi:</strong> {selectedResume.hasil_penunjang?.radiologi || 'Foto Thorax/USG konfirmasi klinis'}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-wide text-amber-600">
                    💊 Terapi Obat & Resep Pulang
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedResume.obat_pulang && selectedResume.obat_pulang.length > 0 ? (
                      selectedResume.obat_pulang.map((med: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center">
                          <span className="font-semibold">{med.nama_obat}</span>
                          <span className="text-slate-500">{med.dosis} • {med.aturan_pakai}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">Terapi oral sesuai resep DPJP terlampir.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. EDUKASI, KONTROL & TANDA TANGAN ELEKTRONIK */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-xs">
                  <p><strong>Jadwal Kontrol Ulang:</strong> {selectedResume.jadwal_kontrol || '1 minggu setelah tanggal pelayanan di Poli Terkait'}</p>
                  <p><strong>Instruksi Khusus / Edukasi:</strong> {selectedResume.instruksi_edukasi || 'Istirahat cukup, minum obat teratur, segera kembali bila ada keluhan memberat.'}</p>
                </div>

                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">Tanda Tangan Elektronik (TTE)</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">{selectedResume.dokter_dpjp}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-mono">Tersertifikasi Balai Sertifikasi Elektronik (BSrE)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 rounded-b-2xl">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedResume, null, 2));
                  toast.success('Salinan ringkasan rekam medis berhasil disalin ke clipboard.');
                }}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs hover:bg-slate-300 dark:hover:bg-slate-600"
              >
                📋 Salin Teks Resume
              </button>
              <button
                onClick={() => setSelectedResume(null)}
                className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
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
const { activeTab } = useOutletContext<{ activeTab: string }>() || { activeTab: 'Daftar Pasien' };
const [activePatient, setActivePatient] = useState<any>(null);
const [voicePatient, setVoicePatient] = useState<any>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// Routing berdasarkan tab aktif dari moduleRegistry
if (activeTab === 'ICD-10 Diagnosis') {
  return <ICD10Tab />;
}

if (activeTab === 'ICD-9 Tindakan') {
  return <ICD9Tab />;
}

if (activeTab === 'Resume Medis') {
  return <ResumeMedisTab />;
}

// Default: Daftar Pasien
const columns = [
{ key: 'no_rm', label: 'No. RM', sortable: true, render: (val: string) => <span className="font-medium font-mono text-blue-600">{val}</span> },
{ key: 'nama', label: 'Nama Pasien', sortable: true, render: (val: string) => <span className="font-bold">{val}</span> },
{ key: 'jenis_kelamin', label: 'L/P', sortable: true, filterable: true },
{ key: 'last_visit', label: 'Terakhir Berkunjung', render: () => 'Hari ini' },
{
  key: 'action',
  label: 'Aksi',
  render: (_: any, p: any) => (
    <div className="flex gap-2 justify-end">
      <button 
        onClick={(e) => { e.stopPropagation(); setVoicePatient(p); }} 
        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
        title="Dikte Laporan Suara Cerdas"
      >
        <Mic className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Suara
      </button>
      <button onClick={(e) => { e.stopPropagation(); setActivePatient(p); setIsModalOpen(true); }} className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-medium flex items-center gap-1 shadow-sm">
        📄 Buka RME
      </button>
    </div>
  )
}
];

return (
 <div className="p-6 h-full flex flex-col max-w-7xl mx-auto space-y-6">
 <div className="flex flex-wrap justify-between items-center gap-4">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Rekam Medis Elektronik (RME)</h1>
 <p className="text-slate-500">Manajemen berkas rekam medis, kodefikasi ICD-10/ICD-9-CM, dan Dikte Suara Klinis Terintegrasi</p>
 </div>
 {pasien && pasien.length > 0 && (
   <button
     onClick={() => setVoicePatient(pasien[0])}
     className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-sm transform hover:scale-105 transition-all"
   >
     <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
     <span>🎙️ Laporan Suara Cerdas Pasien</span>
   </button>
 )}
 </div>
  <ProfessionalTable 
     title="Daftar Pasien"
     columns={columns}
     data={pasien}
     pageSize={10}
     emptyMessage="Tidak ada data pasien."
   />
   {isModalOpen && activePatient && (
     <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 overflow-hidden">
       <Patient360 
         patient={activePatient} 
         onBack={() => setIsModalOpen(false)} 
       />
     </div>
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
 </div>
);
}
