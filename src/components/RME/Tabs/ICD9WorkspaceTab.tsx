import React, { useState } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { ICD9_DATABASE, ICD9Item } from '../Data/icdData';
import { Search, Activity, User, CheckCircle2, Trash2, Plus, Calendar, Stethoscope, Building2 } from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';

export function ICD9WorkspaceTab() {
  const { pasien, dokter } = useHospital();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(pasien && pasien.length > 0 ? pasien[0].id : '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(dokter && dokter.length > 0 ? dokter[0].id : '');
  const [procedureDate, setProcedureDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Selected procedures for current session
  const [assignedProcedures, setAssignedProcedures] = useState<Array<ICD9Item & { operator?: string; date?: string }>>([]);

  const activePatient = (pasien || []).find(p => p.id === selectedPatientId) || (pasien && pasien.length > 0 ? pasien[0] : null);

  const categories = ['Semua', 'Diagnostik', 'Radiologi', 'Terapi & Injeksi', 'Bedah & Operasi', 'Gawat Darurat & ICU', 'Prosedur Klinis', 'Kebidanan & Bedah', 'Rehabilitasi', 'Prosedur Khusus'];

  const filtered = ICD9_DATABASE.filter(d => {
    const matchCat = selectedCategory === 'Semua' || d.category === selectedCategory;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      d.code.toLowerCase().includes(term) ||
      d.desc.toLowerCase().includes(term) ||
      d.desc_id.toLowerCase().includes(term) ||
      d.category.toLowerCase().includes(term) ||
      d.unit.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  const handleAddProcedure = (item: ICD9Item) => {
    if (assignedProcedures.some(p => p.code === item.code)) {
      toast.info('Tindakan ini sudah ditambahkan ke daftar tindakan pasien.');
      return;
    }
    const doc = (dokter || []).find(d => d.id === selectedDoctorId);
    const newProc = {
      ...item,
      operator: doc ? doc.nama : 'dr. DPJP Penanggung Jawab',
      date: procedureDate
    };
    setAssignedProcedures(prev => [...prev, newProc]);
    toast.success(`Tindakan [${item.code}] ${item.desc_id} ditambahkan`);
  };

  const handleRemoveProcedure = (code: string) => {
    setAssignedProcedures(prev => prev.filter(p => p.code !== code));
  };

  const handleSaveToPatient = () => {
    if (!activePatient) return;
    if (assignedProcedures.length === 0) {
      toast.error('Pilih minimal 1 tindakan ICD-9-CM!');
      return;
    }

    // Save to localStorage
    const record = {
      id: `PROC-${Date.now()}`,
      pasien_id: activePatient.id,
      no_rm: activePatient.no_rm,
      nama: activePatient.nama,
      tanggal: procedureDate,
      procedures: assignedProcedures,
      total_estimasi: assignedProcedures.reduce((acc, curr) => acc + (curr.tarif_estimasi || 0), 0)
    };

    let existing: any[] = [];
    try {
      const raw = localStorage.getItem('hospital_patient_procedures');
      existing = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(existing)) existing = [];
    } catch (e) {
      existing = [];
    }
    localStorage.setItem('hospital_patient_procedures', JSON.stringify([record, ...existing]));

    toast.success(`${assignedProcedures.length} tindakan ICD-9-CM berhasil disimpan ke rekam medis pasien.`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Kodefikasi ICD-9-CM (Tindakan, Prosedur Bedah & Diagnostik)
          </h1>
          <p className="text-slate-500 text-sm">
            Katalog prosedur klinis resmi, pencatatan tindakan pasien, dan estimasi tarif casemix
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PrintPDFButton
            filename="Katalog_ICD9_RS"
            label="Cetak Lembar Prosedur"
            className="text-xs bg-slate-800 text-white hover:bg-slate-700 px-3.5 py-2 rounded-xl font-bold shadow-sm"
          />
        </div>
      </div>

      {/* PATIENT PROCEDURE WORKBENCH */}
      <div className="bg-gradient-to-br from-emerald-900/10 via-slate-900/20 to-teal-900/10 dark:bg-slate-900/40 backdrop-blur-xl border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Pasien Penerima Tindakan
                </span>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {(pasien || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} — {p.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DOCTOR OPERATOR SELECTOR */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Dokter Operator / DPJP
              </span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
              >
                {(dokter || []).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.nama} ({d.spesialisasi || 'Spesialis'})
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tanggal Tindakan
              </span>
              <input
                type="date"
                value={procedureDate}
                onChange={(e) => setProcedureDate(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium"
              />
            </div>
          </div>

          <button
            onClick={handleSaveToPatient}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Tindakan Pasien</span>
          </button>
        </div>

        {/* ASSIGNED PROCEDURES LIST */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
              Daftar Tindakan Terpilih ({assignedProcedures.length}):
            </span>
            {assignedProcedures.length > 0 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Total Estimasi Biaya:{' '}
                Rp{' '}
                {assignedProcedures
                  .reduce((acc, curr) => acc + (curr.tarif_estimasi || 0), 0)
                  .toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {assignedProcedures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {assignedProcedures.map(proc => (
                <div key={proc.code} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                      [{proc.code}] {proc.desc_id}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {proc.operator} • {proc.date}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mt-1">
                      Rp {(proc.tarif_estimasi || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveProcedure(proc.code)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-400 text-xs">
              Belum ada tindakan dipilih untuk pasien ini. Klik "+ Tambah" pada tabel di bawah.
            </div>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kode (89.52), nama tindakan (EKG, Rontgen, SC, USG)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-emerald-600 dark:text-emerald-400">{filtered.length}</strong> prosedur klinis
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
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ICD-9 TABLE */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Kode ICD-9</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Nama Tindakan (Bahasa Indonesia)</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Deskripsi Prosedur</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Unit Pelaksana</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Estimasi Biaya</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map(item => {
                const isSelected = assignedProcedures.some(p => p.code === item.code);
                return (
                  <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-900/50">
                        {item.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {item.desc_id}
                    </td>
                    <td className="p-3.5 text-xs text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs block font-medium w-fit">
                        {item.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{item.category}</span>
                    </td>
                    <td className="p-3.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      Rp {(item.tarif_estimasi || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleAddProcedure(item)}
                        disabled={isSelected}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isSelected ? '✓ Terpilih' : '+ Tambah'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ditemukan kode ICD-9-CM untuk kata kunci "{search}".
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
