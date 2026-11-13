import React, { useState } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { ICD10_DATABASE, ICD10Item } from '../Data/icdData';
import { Search, Sparkles, Filter, CheckCircle2, AlertCircle, FileText, User, Tag, Plus, Trash2, ArrowRight } from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';

export function ICD10WorkspaceTab() {
  const { pasien, updatePasien } = useHospital();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(pasien && pasien.length > 0 ? pasien[0].id : '');
  
  // Active selected codes for current coding session
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState<ICD10Item | null>(null);
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState<ICD10Item[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Selected patient details
  const activePatient = (pasien || []).find(p => p.id === selectedPatientId) || (pasien && pasien.length > 0 ? pasien[0] : null);

  // Initialize coding with patient's existing data when patient changes
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    const p = (pasien || []).find(item => item.id === patientId);
    if (p) {
      const rawDiag: any = p.diagnosa_primer;
      const pDiag = typeof rawDiag === 'string' 
        ? rawDiag 
        : (rawDiag?.nama || rawDiag?.kode_icd10 || '');
      if (pDiag) {
        const found = ICD10_DATABASE.find(i => 
          i.code.toLowerCase() === pDiag.toLowerCase() || 
          i.desc_id.toLowerCase().includes(pDiag.toLowerCase())
        );
        if (found) setPrimaryDiagnosis(found);
      }
    }
  };

  const categories = ['Semua', 'Penyakit Infeksi', 'Kardiovaskular', 'Respirasi', 'Endokrin', 'Pencernaan', 'Muskuloskeletal', 'Genitourinaria', 'Neoplasma', 'Gejala Umum', 'Trauma & Bedah'];

  const filtered = ICD10_DATABASE.filter(d => {
    const matchCat = selectedCategory === 'Semua' || d.category === selectedCategory;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      d.code.toLowerCase().includes(term) ||
      d.desc.toLowerCase().includes(term) ||
      d.desc_id.toLowerCase().includes(term) ||
      d.category.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const handleSetPrimary = (item: ICD10Item) => {
    setPrimaryDiagnosis(item);
    // Remove from secondary if it was there
    setSecondaryDiagnoses(prev => prev.filter(s => s.code !== item.code));
    toast.success(`Diagnosis Primer ditetapkan: [${item.code}] ${item.desc_id}`);
  };

  const handleAddSecondary = (item: ICD10Item) => {
    if (primaryDiagnosis?.code === item.code) {
      toast.error('Kode ini sudah menjadi diagnosis primer!');
      return;
    }
    if (secondaryDiagnoses.find(s => s.code === item.code)) {
      toast.info('Kode sudah ada dalam daftar diagnosis sekunder.');
      return;
    }
    setSecondaryDiagnoses(prev => [...prev, item]);
    toast.success(`Diagnosis Sekunder ditambahkan: [${item.code}]`);
  };

  const handleRemoveSecondary = (code: string) => {
    setSecondaryDiagnoses(prev => prev.filter(s => s.code !== code));
  };

  // AI Clinical Coder Assistant Simulation
  const handleAiSuggestCoding = () => {
    if (!activePatient) return;
    setIsAiLoading(true);
    toast.info('AI Clinical Coder sedang menganalisis resume klinis pasien...');

    setTimeout(() => {
      setIsAiLoading(false);
      const rawDiag: any = activePatient.diagnosa_primer;
      const diagStr = typeof rawDiag === 'string' 
        ? rawDiag 
        : (rawDiag?.nama || rawDiag?.kode_icd10 || '');
      const keluhan = (activePatient.keluhan_utama || diagStr || '').toLowerCase();
      
      let suggestedPrimary: ICD10Item = ICD10_DATABASE[0];
      let suggestedSec: ICD10Item[] = [];

      if (keluhan.includes('dada') || keluhan.includes('jantung') || keluhan.includes('tensi') || keluhan.includes('hipertensi')) {
        suggestedPrimary = ICD10_DATABASE.find(i => i.code === 'I10') || ICD10_DATABASE[0];
        suggestedSec = [ICD10_DATABASE.find(i => i.code === 'I25.1') || ICD10_DATABASE[1]];
      } else if (keluhan.includes('gula') || keluhan.includes('dm') || keluhan.includes('diabetes')) {
        suggestedPrimary = ICD10_DATABASE.find(i => i.code === 'E11.9') || ICD10_DATABASE[0];
        suggestedSec = [ICD10_DATABASE.find(i => i.code === 'E78.5') || ICD10_DATABASE[1]];
      } else if (keluhan.includes('sesak') || keluhan.includes('batuk') || keluhan.includes('paru') || keluhan.includes('ispa')) {
        suggestedPrimary = ICD10_DATABASE.find(i => i.code === 'J18.9') || ICD10_DATABASE[0];
        suggestedSec = [ICD10_DATABASE.find(i => i.code === 'J06.9') || ICD10_DATABASE[1]];
      } else if (keluhan.includes('lambung') || keluhan.includes('perut') || keluhan.includes('mual') || keluhan.includes('gerd')) {
        suggestedPrimary = ICD10_DATABASE.find(i => i.code === 'K21.0') || ICD10_DATABASE[0];
        suggestedSec = [ICD10_DATABASE.find(i => i.code === 'K29.7') || ICD10_DATABASE[1]];
      } else {
        suggestedPrimary = ICD10_DATABASE.find(i => i.code === 'A09') || ICD10_DATABASE[0];
        suggestedSec = [ICD10_DATABASE.find(i => i.code === 'R50.9') || ICD10_DATABASE[1]];
      }

      setPrimaryDiagnosis(suggestedPrimary);
      setSecondaryDiagnoses(suggestedSec);
      toast.success(`Rekomendasi AI diterapkan: [${suggestedPrimary.code}] ${suggestedPrimary.desc_id}`);
    }, 900);
  };

  const handleSaveToPatientRecord = async () => {
    if (!activePatient) return;
    if (!primaryDiagnosis) {
      toast.error('Pilih minimal 1 Diagnosis Primer!');
      return;
    }

    try {
      await updatePasien(activePatient.id, {
        diagnosa_primer: `[${primaryDiagnosis.code}] ${primaryDiagnosis.desc_id}`
      });

      // Save complete coding packet to localStorage for claim & audit records
      const codingPacket = {
        pasien_id: activePatient.id,
        no_rm: activePatient.no_rm,
        nama: activePatient.nama,
        tgl_kodefikasi: new Date().toISOString(),
        primary: primaryDiagnosis,
        secondaries: secondaryDiagnoses,
        inacbg_code: primaryDiagnosis.inacbg_hint || 'A-4-10-I',
        coder_name: 'Perekam Medis Koder SIMK'
      };

      const existingCodings = JSON.parse(localStorage.getItem('hospital_clinical_codings') || '[]');
      const filteredCodings = existingCodings.filter((c: any) => c.pasien_id !== activePatient.id);
      localStorage.setItem('hospital_clinical_codings', JSON.stringify([codingPacket, ...filteredCodings]));

      toast.success(`Koding klinis ICD-10 berhasil disimpan untuk pasien ${activePatient.nama}`);
    } catch (e) {
      toast.error('Gagal menyimpan koding rekam medis.');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Kodefikasi ICD-10 (International Classification of Diseases - WHO)
          </h1>
          <p className="text-slate-500 text-sm">
            Katalog diagnosis resmi WHO, penetapan koding kasus pasien, dan mapping INA-CBGs BPJS Kesehatan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAiSuggestCoding}
            disabled={isAiLoading || !activePatient}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
            title="Gunakan AI untuk menyarankan kode ICD-10 berdasarkan resume klinis"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{isAiLoading ? 'Menganalisis...' : 'Saran Koding AI'}</span>
          </button>
          <PrintPDFButton
            filename="Katalog_ICD10_RS"
            label="Cetak Lembar Koding"
            className="text-xs bg-slate-800 text-white hover:bg-slate-700 px-3.5 py-2 rounded-xl font-bold shadow-sm"
          />
        </div>
      </div>

      {/* PATIENT CODING WORKBENCH */}
      <div className="bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-indigo-900/10 dark:bg-slate-900/40 backdrop-blur-xl border border-blue-200 dark:border-blue-900/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                Workspace Koding Kasus Pasien
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={selectedPatientId}
                  onChange={(e) => handleSelectPatient(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {(pasien || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} — {p.nama} ({p.penjamin || 'BPJS'})
                    </option>
                  ))}
                </select>
                {activePatient && (
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {activePatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {activePatient.alamat || 'Alamat Terdaftar'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveToPatientRecord}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Koding ke Rekam Medis</span>
          </button>
        </div>

        {/* ACTIVE CODING PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* PRIMARY DIAGNOSIS */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                Diagnosis Utama (Primary Diagnosis)
              </span>
              {primaryDiagnosis && (
                <span className="text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  INA-CBGs: {primaryDiagnosis.inacbg_hint || '-'}
                </span>
              )}
            </div>
            {primaryDiagnosis ? (
              <div className="flex items-start justify-between gap-3 bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-900/60">
                <div>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-300 text-base block">
                    [{primaryDiagnosis.code}] {primaryDiagnosis.desc_id}
                  </span>
                  <span className="text-xs text-slate-500 italic block mt-0.5">
                    {primaryDiagnosis.desc}
                  </span>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[11px] font-semibold">
                    {primaryDiagnosis.category} • {primaryDiagnosis.chapter}
                  </span>
                </div>
                <button
                  onClick={() => setPrimaryDiagnosis(null)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                  title="Hapus diagnosis utama"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 text-xs">
                Pilih salah satu kode diagnosis di bawah untuk dijadikan Diagnosis Utama
              </div>
            )}
          </div>

          {/* SECONDARY DIAGNOSES */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Diagnosis Sekunder / Komorbiditas ({secondaryDiagnoses.length})
              </span>
            </div>
            {secondaryDiagnoses.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {secondaryDiagnoses.map(sec => (
                  <div key={sec.code} className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs">
                    <div>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        [{sec.code}]
                      </span>{' '}
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        {sec.desc_id}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSecondary(sec.code)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 text-xs">
                Belum ada diagnosis sekunder (komorbid / komplikasi). Klik "+ Sekunder" pada tabel di bawah.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode (A09), nama penyakit (DHF, Typhoid, Diabetes)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-blue-600 dark:text-blue-400">{filtered.length}</strong> kode diagnosis
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ICD-10 TABLE */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Kode ICD-10</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Nama Penyakit (Bahasa Indonesia)</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Deskripsi Resmi WHO</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Kategori & Bab</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">INA-CBGs</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Tetapkan Koding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map(item => {
                const isPrimary = primaryDiagnosis?.code === item.code;
                const isSecondary = secondaryDiagnoses.some(s => s.code === item.code);
                return (
                  <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-900/50">
                        {item.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {item.desc_id}
                      {item.chronic && (
                        <span className="ml-2 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                          Kronis
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-xs text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs block font-medium w-fit">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.chapter}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.inacbg_hint || '-'}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSetPrimary(item)}
                          disabled={isPrimary}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isPrimary
                              ? 'bg-blue-600 text-white cursor-default'
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                          }`}
                        >
                          {isPrimary ? '✓ Utama' : '+ Utama'}
                        </button>
                        <button
                          onClick={() => handleAddSecondary(item)}
                          disabled={isPrimary || isSecondary}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            isSecondary
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {isSecondary ? '✓ Sekunder' : '+ Sekunder'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan kode ICD-10 untuk kata kunci "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
