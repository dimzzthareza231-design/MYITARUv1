import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X, Search } from 'lucide-react';

interface ICDItem {
  code: string;
  description: string;
}

const DEFAULT_ICD10_LIST: ICDItem[] = [
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'K21.0', description: 'Gastro-esophageal reflux disease with oesophagitis' },
  { code: 'A09.9', description: 'Gastroenteritis and colitis of unspecified origin' },
  { code: 'M54.5', description: 'Low back pain' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'R51', description: 'Headache' },
  { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
  { code: 'A90', description: 'Dengue fever [classical dengue]' },
  { code: 'G43.9', description: 'Migraine, unspecified' },
  { code: 'K29.7', description: 'Gastritis, unspecified' },
  { code: 'J45.9', description: 'Asthma, unspecified' },
  { code: 'S52.5', description: 'Fracture of lower end of radius' }
];

interface ModalProblemProps {
  onClose: () => void;
  onSave: (data: {
    id: number;
    nama: string;
    kode_icd10: string;
    tanggal_onset: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    status: 'Active' | 'Resolved' | 'Historical' | 'Suspected' | 'Ruled Out';
  }) => void;
}

export function ModalProblem({ onClose, onSave }: ModalProblemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [kodeIcd, setKodeIcd] = useState('');
  const [namaProblem, setNamaProblem] = useState('');
  const [tanggalOnset, setTanggalOnset] = useState(new Date().toISOString().split('T')[0]);
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [status, setStatus] = useState<'Active' | 'Resolved' | 'Historical' | 'Suspected' | 'Ruled Out'>('Active');

  const filteredIcd: ICDItem[] = searchQuery.trim() === '' ? [] : DEFAULT_ICD10_LIST.filter((item: ICDItem) => 
    item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelectIcd = (code: string, desc: string) => {
    setKodeIcd(code);
    setNamaProblem(desc);
    setSearchQuery('');
  };

  const handleSave = () => {
    if (!namaProblem) {
      toast.error('Nama masalah / diagnosis wajib diisi');
      return;
    }

    onSave({
      id: Date.now(),
      nama: namaProblem,
      kode_icd10: kodeIcd || 'R69',
      tanggal_onset: tanggalOnset,
      severity,
      status
    });

    toast.success('Masalah klinis berhasil ditambahkan');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Masalah Klinis (Problem List)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick ICD-10 Search */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cari Master ICD-10 (Opsional)</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2.5 pl-9 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ketik kode atau nama penyakit (e.g. Hipertensi, E11, I10)..."
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>

            {filteredIcd.length > 0 && (
              <div className="mt-1 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-md divide-y divide-slate-100 dark:divide-slate-800 max-h-40 overflow-y-auto">
                {filteredIcd.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectIcd(item.code, item.description)}
                    className="w-full text-left p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs flex justify-between items-center transition-colors"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.description}</span>
                    <span className="font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">{item.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kode ICD-10</label>
              <input
                type="text"
                value={kodeIcd}
                onChange={(e) => setKodeIcd(e.target.value)}
                className="w-full p-2.5 font-mono uppercase border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. I10"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Diagnosis / Problem <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={namaProblem}
                onChange={(e) => setNamaProblem(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nama problem medis"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Onset</label>
              <input
                type="date"
                value={tanggalOnset}
                onChange={(e) => setTanggalOnset(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Mild">Mild (Ringan)</option>
                <option value="Moderate">Moderate (Sedang)</option>
                <option value="Severe">Severe (Berat)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Active">Active</option>
                <option value="Resolved">Resolved</option>
                <option value="Historical">Historical</option>
                <option value="Suspected">Suspected</option>
                <option value="Ruled Out">Ruled Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-bold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-bold shadow-sm transition-colors"
          >
            Simpan Masalah
          </button>
        </div>
      </div>
    </div>
  );
}
