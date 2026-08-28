import React, { useState, useEffect } from 'react';
import {
  Activity, User, Calendar, Stethoscope, Pill, Save,
  Plus, Search, Clock, CheckCircle, AlertTriangle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const ICD10_DATA = [
  { code: 'J06.9', desc: 'Acute upper respiratory infection, unspecified' },
  { code: 'A09', desc: 'Infectious gastroenteritis and colitis, unspecified' },
  { code: 'I10', desc: 'Essential (primary) hypertension' },
  { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
  { code: 'R50.9', desc: 'Fever, unspecified' },
  { code: 'K21.0', desc: 'GERD with esophagitis' },
  { code: 'M54.5', desc: 'Low back pain' },
  { code: 'N39.0', desc: 'Urinary tract infection, site not specified' },
];

const KFA_DATA = [
  { code: 'KFA00001', name: 'Paracetamol 500mg Tablet', category: 'Analgesik' },
  { code: 'KFA00002', name: 'Amoxicillin 500mg Kapsul', category: 'Antibiotik' },
  { code: 'KFA00003', name: 'Omeprazole 20mg Kapsul', category: 'Antiulserasi' },
  { code: 'KFA00004', name: 'Cetirizine 10mg Tablet', category: 'Antihistamin' },
  { code: 'KFA00005', name: 'Ibuprofen 400mg Tablet', category: 'NSAID' },
  { code: 'KFA00006', name: 'Metformin 500mg Tablet', category: 'Antidiabetik' },
];

export function PCareKunjungan() {
  const [kunjunganList, setKunjunganList] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_pcare_kunjungan');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    noKartu: '',
    namaPasien: '',
    poli: 'Poli Umum',
    dokter: '',
    keluhan: '',
    diagnosa: '',
    obat: [] as any[],
  });

  const [searchICD, setSearchICD] = useState('');
  const [searchObat, setSearchObat] = useState('');
  const [filteredICD, setFilteredICD] = useState<any[]>([]);
  const [filteredObat, setFilteredObat] = useState<any[]>([]);

  useEffect(() => {

  }, [kunjunganList]);
  useEffect(() => {
    if (searchICD.length >= 2) {
      setFilteredICD(ICD10_DATA.filter(d =>
        d.code.toLowerCase().includes(searchICD.toLowerCase()) ||
        d.desc.toLowerCase().includes(searchICD.toLowerCase())
      ));
    } else {
      setFilteredICD([]);
    }
  }, [searchICD]);

  useEffect(() => {
    if (searchObat.length >= 2) {
      setFilteredObat(KFA_DATA.filter(d =>
        d.code.toLowerCase().includes(searchObat.toLowerCase()) ||
        d.name.toLowerCase().includes(searchObat.toLowerCase())
      ));
    } else {
      setFilteredObat([]);
    }
  }, [searchObat]);

  const handleSave = () => {
    if (!formData.noKartu || !formData.namaPasien || !formData.keluhan) {
      toast.error('Mohon lengkapi data yang wajib diisi');
      return;
    }

    const newKunjungan = {
      id: `PCARE-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      ...formData,
      status: 'Selesai',
    };

    setKunjunganList([newKunjungan, ...kunjunganList]);
    setIsFormOpen(false);
    setFormData({
      noKartu: '',
      namaPasien: '',
      poli: 'Poli Umum',
      dokter: '',
      keluhan: '',
      diagnosa: '',
      obat: [],
    });
    toast.success('Kunjungan P-Care berhasil disimpan');
  };

  const addObat = (obat: any) => {
    if (formData.obat.find(o => o.code === obat.code)) {
      toast.error('Obat sudah ditambahkan');
      return;
    }
    setFormData({ ...formData, obat: [...formData.obat, { ...obat, qty: '3x1', jumlah: 1 }] });
    setSearchObat('');
    setFilteredObat([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pelayanan P-Care (FKTP)</h1>
          <p className="text-slate-500 dark:text-slate-400">Registrasi dan input pelayanan kunjungan BPJS</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Kunjungan Baru
        </button>
      </div>

      {/* Tabel Kunjungan */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">ID Kunjungan</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tanggal</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pasien</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Poli</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Diagnosa</th>
              <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {kunjunganList.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-4 font-mono text-sm text-blue-600 dark:text-blue-400 font-bold">{k.id}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{k.tanggal} {k.jam}</td>
                <td className="p-4">
                  <div className="font-bold text-slate-800 dark:text-white text-sm">{k.namaPasien}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{k.noKartu}</div>
                </td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{k.poli}</td>
                <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{k.diagnosa || '-'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold">
                    {k.status}
                  </span>
                </td>
              </tr>
            ))}
            {kunjunganList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Belum ada data kunjungan P-Care.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Kunjungan Baru */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold">Form Kunjungan P-Care (FKTP)</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-2xl hover:bg-blue-700 w-8 h-8 rounded flex items-center justify-center">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Data Pasien */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No Kartu BPJS *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.noKartu}
                    onChange={e => setFormData({ ...formData, noKartu: e.target.value })}
                    placeholder="0001234567891"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Pasien *</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.namaPasien}
                    onChange={e => setFormData({ ...formData, namaPasien: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Poli</label>
                  <select
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.poli}
                    onChange={e => setFormData({ ...formData, poli: e.target.value })}
                  >
                    <option>Poli Umum</option>
                    <option>Poli Gigi</option>
                    <option>Poli KIA</option>
                    <option>Poli KB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dokter</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.dokter}
                    onChange={e => setFormData({ ...formData, dokter: e.target.value })}
                  />
                </div>
              </div>

              {/* Keluhan & Diagnosa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keluhan Utama *</label>
                <textarea
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                  value={formData.keluhan}
                  onChange={e => setFormData({ ...formData, keluhan: e.target.value })}
                  placeholder="Masukkan keluhan pasien..."
                />
              </div>

              {/* Diagnosa ICD-10 */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diagnosa (ICD-10)</label>
                <input
                  type="text"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Cari kode ICD-10..."
                  value={formData.diagnosa || searchICD}
                  onChange={e => {
                    if (formData.diagnosa) setFormData({ ...formData, diagnosa: '' });
                    setSearchICD(e.target.value);
                  }}
                />
                {filteredICD.length > 0 && !formData.diagnosa && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredICD.map(icd => (
                      <button
                        key={icd.code}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-600 text-sm border-b border-slate-100 dark:border-slate-600 last:border-0"
                        onClick={() => {
                          setFormData({ ...formData, diagnosa: `${icd.code} - ${icd.desc}` });
                          setSearchICD('');
                          setFilteredICD([]);
                        }}
                      >
                        <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{icd.code}</span>
                        <span className="text-slate-700 dark:text-slate-200">{icd.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Obat KFA */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Obat (KFA)</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Cari obat berdasarkan kode KFA atau nama..."
                    value={searchObat}
                    onChange={e => setSearchObat(e.target.value)}
                  />
                  {filteredObat.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredObat.map(obat => (
                        <button
                          key={obat.code}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-600 text-sm border-b border-slate-100 dark:border-slate-600 last:border-0 flex justify-between"
                          onClick={() => addObat(obat)}
                        >
                          <span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">{obat.code}</span>
                            <span className="text-slate-700 dark:text-slate-200">{obat.name}</span>
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{obat.category}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formData.obat.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.obat.map((obat, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-bold text-slate-800 dark:text-white">{obat.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">{obat.qty} • {obat.jumlah}</span>
                        </div>
                        <button
                          onClick={() => setFormData({ ...formData, obat: formData.obat.filter((_, i) => i !== idx) })}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/80 rounded-b-xl">
              <button
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Kunjungan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );


}
