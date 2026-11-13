import React, { useState } from 'react';
import { Syringe, Plus, CheckCircle2, Clock, AlertCircle, ShieldCheck, Calendar, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface ImmunizationRecord {
  id: string;
  vaccineName: string;
  targetAge: string;
  category: 'Wajib Dasar' | 'Lanjutan' | 'Dewasa / Khusus';
  dateGiven?: string;
  batchNumber?: string;
  administeredBy?: string;
  facility?: string;
  status: 'Sudah Diberikan' | 'Terjadwal' | 'Terlewat';
  notes?: string;
}

export function ImmunizationsTab({ patientData }: { patientData: any }) {
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  const [records, setRecords] = useState<ImmunizationRecord[]>([
    { id: '1', vaccineName: 'Hepatitis B (HB-0)', targetAge: '< 24 Jam', category: 'Wajib Dasar', dateGiven: '15 Mar 1991', batchNumber: 'HB-9921', administeredBy: 'Bdn. Siti', facility: 'Puskesmas', status: 'Sudah Diberikan' },
    { id: '2', vaccineName: 'BCG (Tuberkulosis)', targetAge: '1 Bulan', category: 'Wajib Dasar', dateGiven: '18 Apr 1991', batchNumber: 'BCG-4412', administeredBy: 'Bdn. Siti', facility: 'Puskesmas', status: 'Sudah Diberikan' },
    { id: '3', vaccineName: 'Polio Tetes 1 (bOPV)', targetAge: '1 Bulan', category: 'Wajib Dasar', dateGiven: '18 Apr 1991', batchNumber: 'OPV-102', administeredBy: 'Bdn. Siti', facility: 'Puskesmas', status: 'Sudah Diberikan' },
    { id: '4', vaccineName: 'DPT-HB-Hib 1 + Polio 2', targetAge: '2 Bulan', category: 'Wajib Dasar', dateGiven: '20 Mei 1991', batchNumber: 'DPT-551', administeredBy: 'dr. Anak', facility: 'Klinik Swasta', status: 'Sudah Diberikan' },
    { id: '5', vaccineName: 'DPT-HB-Hib 2 + Polio 3', targetAge: '3 Bulan', category: 'Wajib Dasar', dateGiven: '22 Jun 1991', batchNumber: 'DPT-552', administeredBy: 'dr. Anak', facility: 'Klinik Swasta', status: 'Sudah Diberikan' },
    { id: '6', vaccineName: 'DPT-HB-Hib 3 + Polio 4 + IPV', targetAge: '4 Bulan', category: 'Wajib Dasar', dateGiven: '25 Jul 1991', batchNumber: 'IPV-330', administeredBy: 'dr. Anak', facility: 'Klinik Swasta', status: 'Sudah Diberikan' },
    { id: '7', vaccineName: 'Campak Rubella (MR)', targetAge: '9 Bulan', category: 'Wajib Dasar', dateGiven: '15 Des 1991', batchNumber: 'MR-900', administeredBy: 'Puskesmas', facility: 'Puskesmas', status: 'Sudah Diberikan' },
    { id: '8', vaccineName: 'DPT-HB-Hib Lanjutan', targetAge: '18 Bulan', category: 'Lanjutan', dateGiven: '15 Sep 1992', batchNumber: 'DPT-602', administeredBy: 'Puskesmas', facility: 'Puskesmas', status: 'Sudah Diberikan' },
    { id: '9', vaccineName: 'COVID-19 Primer (Dosis 1 & 2)', targetAge: 'Dewasa', category: 'Dewasa / Khusus', dateGiven: '10 Jun 2021', batchNumber: 'COV-8812', administeredBy: 'Sentra Vaksinasi RS', facility: 'RS MYITARU', status: 'Sudah Diberikan' },
    { id: '10', vaccineName: 'COVID-19 Booster 1', targetAge: 'Dewasa', category: 'Dewasa / Khusus', dateGiven: '15 Jan 2022', batchNumber: 'BST-110', administeredBy: 'Sentra Vaksinasi RS', facility: 'RS MYITARU', status: 'Sudah Diberikan' },
    { id: '11', vaccineName: 'Influenza Kuadrivalen Tahunan', targetAge: 'Dewasa Rutin', category: 'Dewasa / Khusus', status: 'Terjadwal', notes: 'Dianjurkan setiap 1 tahun sekali' },
    { id: '12', vaccineName: 'Pneumokokus (PCV13 / PPSV23)', targetAge: 'Dewasa Komorbid', category: 'Dewasa / Khusus', status: 'Terjadwal', notes: 'Dianjurkan untuk pasien DM & Hipertensi' },
  ]);

  const [newVaccine, setNewVaccine] = useState({
    vaccineName: '',
    targetAge: 'Dewasa',
    category: 'Dewasa / Khusus' as const,
    dateGiven: new Date().toISOString().split('T')[0],
    batchNumber: '',
    administeredBy: 'dr. Budi Santoso',
    facility: 'MYITARU Klinik SIMK',
    notes: ''
  });

  const handleAddRecord = () => {
    if (!newVaccine.vaccineName) {
      toast.error('Nama vaksin wajib diisi!');
      return;
    }

    const created: ImmunizationRecord = {
      id: `IMM-${Date.now()}`,
      vaccineName: newVaccine.vaccineName,
      targetAge: newVaccine.targetAge,
      category: newVaccine.category,
      dateGiven: newVaccine.dateGiven,
      batchNumber: newVaccine.batchNumber || 'BATCH-GEN-' + Math.floor(100 + Math.random() * 900),
      administeredBy: newVaccine.administeredBy,
      facility: newVaccine.facility,
      status: 'Sudah Diberikan',
      notes: newVaccine.notes
    };

    setRecords([created, ...records]);
    setShowAddModal(false);
    setNewVaccine({
      vaccineName: '',
      targetAge: 'Dewasa',
      category: 'Dewasa / Khusus',
      dateGiven: new Date().toISOString().split('T')[0],
      batchNumber: '',
      administeredBy: 'dr. Budi Santoso',
      facility: 'MYITARU Klinik SIMK',
      notes: ''
    });
    toast.success('Catatan imunisasi berhasil ditambahkan');
  };

  const filteredRecords = records.filter(r => {
    if (filterCategory === 'Semua') return true;
    return r.category === filterCategory;
  });

  const completedCount = records.filter(r => r.status === 'Sudah Diberikan').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Syringe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              Buku Catatan Imunisasi & Vaksinasi Pasien
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Jadwal imunisasi nasional Kemenkes RI, riwayat vaksinasi masa kecil, booster dewasa & vaksinasi khusus.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Catat Vaksinasi Baru
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Telah Diberikan</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{completedCount} Vaksin</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Jadwal Rekomendasi</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {records.filter(r => r.status === 'Terjadwal').length} Vaksin
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">SatuSehat Sync</p>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Terhubung Kemenkes</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & TABLE */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
          {['Semua', 'Wajib Dasar', 'Lanjutan', 'Dewasa / Khusus'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Jenis Vaksin</th>
                <th className="p-4">Jadwal Usia</th>
                <th className="p-4">Tanggal Pemberian</th>
                <th className="p-4">No. Batch / Seri</th>
                <th className="p-4">Faskes / Vaksinator</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white flex flex-col">
                    <span>{item.vaccineName}</span>
                    <span className="text-[11px] font-normal text-slate-400">{item.category}</span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-300">{item.targetAge}</td>
                  <td className="p-4 text-xs text-slate-700 dark:text-slate-300">{item.dateGiven || '-'}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                      {item.batchNumber || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-600 dark:text-slate-400">
                    <div>{item.facility || '-'}</div>
                    {item.administeredBy && <div className="text-[10px] text-slate-400">{item.administeredBy}</div>}
                  </td>
                  <td className="p-4 text-center">
                    {item.status === 'Sudah Diberikan' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" /> Sudah Diberikan
                      </span>
                    ) : item.status === 'Terjadwal' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        <Clock className="w-3 h-3" /> Dianjurkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        <AlertCircle className="w-3 h-3" /> Terlewat
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD VACCINE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-teal-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Syringe className="w-5 h-5" /> Catat Imunisasi Pasien
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">Pasien: {patientData?.nama}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white p-1">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nama Vaksin *
                </label>
                <input
                  type="text"
                  value={newVaccine.vaccineName}
                  onChange={e => setNewVaccine({ ...newVaccine, vaccineName: e.target.value })}
                  placeholder="Contoh: Influenza Kuadrivalen, PCV13, dll."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Kategori
                  </label>
                  <select
                    value={newVaccine.category}
                    onChange={e => setNewVaccine({ ...newVaccine, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-medium"
                  >
                    <option value="Wajib Dasar">Wajib Dasar</option>
                    <option value="Lanjutan">Lanjutan</option>
                    <option value="Dewasa / Khusus">Dewasa / Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Tanggal Diberikan
                  </label>
                  <input
                    type="date"
                    value={newVaccine.dateGiven}
                    onChange={e => setNewVaccine({ ...newVaccine, dateGiven: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    No. Batch / Seri
                  </label>
                  <input
                    type="text"
                    value={newVaccine.batchNumber}
                    onChange={e => setNewVaccine({ ...newVaccine, batchNumber: e.target.value })}
                    placeholder="Contoh: INF-2026-X"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Vaksinator / DPJP
                  </label>
                  <input
                    type="text"
                    value={newVaccine.administeredBy}
                    onChange={e => setNewVaccine({ ...newVaccine, administeredBy: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleAddRecord}
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md transition-all"
              >
                Simpan Vaksinasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
