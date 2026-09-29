import React, { useState } from 'react';
import { Activity, CheckCircle2, Plus, Clock, FileText, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface CPPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function CPPTModal({ isOpen, onClose, patient }: CPPTModalProps) {
  const storageKey = `hospital_cppt_${patient?.no_rm || patient?.id || 'default'}`;

  const defaultEntries = [
    {
      id: 1,
      tanggal: new Date().toISOString().split('T')[0],
      jam: '07:30 WIB',
      profesi: 'Perawat',
      namaPetugas: 'Ns. Ratna Sari, S.Kep',
      sbarSoap: {
        s: 'Pasien mengeluh nyeri luka berkurang, nafsu makan mulai membaik, flatus (+), mobilisasi duduk mandiri.',
        o: 'KU sedang, CM, TD 120/75 mmHg, Nadi 80 x/m, RR 18 x/m, Suhu 36.6 C, SpO2 99%. Luka operasi bersih.',
        a: 'Nyeri pasca tindakan bedah teratasi sebagian, pemulihan fungsi saluran cerna baik.',
        p: 'Lanjutkan mobilisasi bertahap, ganti perban luka, lanjutkan infus & analgetik oral.'
      },
      instruksiPPA: 'Mobilisasi miring kanan-kiri dan duduk di tepi tempat tidur.',
      verifikasiDPJP: {
        diverifikasi: true,
        namaDPJP: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
        jamVerifikasi: '09:00 WIB'
      }
    },
    {
      id: 2,
      tanggal: new Date().toISOString().split('T')[0],
      jam: '09:15 WIB',
      profesi: 'Dokter DPJP',
      namaPetugas: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
      sbarSoap: {
        s: 'Keluhan nyeri minimal (VAS 2/10), demam (-), mual (-).',
        o: 'Abdomen supel, bising usus (+) normal 8x/m, nyeri tekan (-), luka insisi intak jahitan baik.',
        a: 'Post-operatif Hari Ke-2 dengan perbaikan klinis signifikan.',
        p: 'Diet makanan lunak bertahap, lepas infus jika minum baik, rencana pulang besok bila afebris.'
      },
      instruksiPPA: 'Stop infus RL sore ini, alih terapi oral Cefixime 2x200mg & Asam Mefenamat 3x500mg.',
      verifikasiDPJP: {
        diverifikasi: true,
        namaDPJP: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
        jamVerifikasi: '09:30 WIB'
      }
    }
  ];

  const [entries, setEntries] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return defaultEntries;
  });

  const [newEntry, setNewEntry] = useState({
    profesi: 'Dokter DPJP',
    namaPetugas: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
    s: '',
    o: '',
    a: '',
    p: '',
    instruksi: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleAddEntry = () => {
    if (!newEntry.s && !newEntry.o && !newEntry.a) {
      toast.error('Isi data SOAP sebelum menambahkan catatan!');
      return;
    }
    const item = {
      id: Date.now(),
      tanggal: new Date().toISOString().split('T')[0],
      jam: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      profesi: newEntry.profesi,
      namaPetugas: newEntry.namaPetugas,
      sbarSoap: {
        s: newEntry.s || 'Tidak ada keluhan subjektif baru.',
        o: newEntry.o || 'Tanda vital dalam batas normal.',
        a: newEntry.a || 'Kondisi klinis stabil dalam pemantauan.',
        p: newEntry.p || 'Lanjutkan terapi sesuai instruksi DPJP.'
      },
      instruksiPPA: newEntry.instruksi || 'Observasi tanda vital tiap shift.',
      verifikasiDPJP: {
        diverifikasi: true,
        namaDPJP: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
        jamVerifikasi: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }
    };
    const updated = [item, ...entries];
    setEntries(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setShowAddForm(false);
    setNewEntry({
      profesi: 'Dokter DPJP',
      namaPetugas: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
      s: '',
      o: '',
      a: '',
      p: '',
      instruksi: ''
    });
    toast.success('Catatan CPPT berhasil ditambahkan!');
  };

  const fullDocData = {
    ...patient,
    entries,
    type: 'cppt',
    docType: 'cppt'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-indigo-700 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-200" />
            <div>
              <h2 className="font-bold text-base">Catatan Perkembangan Pasien Terintegrasi (CPPT - RM.03)</h2>
              <p className="text-xs text-indigo-100">Pasien: {patient?.nama} ({patient?.no_rm})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700 dark:text-slate-300">Riwayat Catatan SOAP Interprofesional ({entries.length} Catatan)</span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> {showAddForm ? 'Tutup Form' : 'Tambah Catatan CPPT Baru'}
            </button>
          </div>

          {showAddForm && (
            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Profesi PPA</span>
                  <select
                    value={newEntry.profesi}
                    onChange={(e) => setNewEntry({ ...newEntry, profesi: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Dokter DPJP">Dokter DPJP</option>
                    <option value="Perawat">Perawat</option>
                    <option value="Apoteker">Apoteker</option>
                    <option value="Dietisien">Dietisien</option>
                    <option value="Fisioterapis">Fisioterapis</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">Nama Petugas</span>
                  <input
                    type="text"
                    value={newEntry.namaPetugas}
                    onChange={(e) => setNewEntry({ ...newEntry, namaPetugas: e.target.value })}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <textarea rows={2} placeholder="S (Subjektif / Keluhan)..." value={newEntry.s} onChange={(e) => setNewEntry({ ...newEntry, s: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-800" />
                <textarea rows={2} placeholder="O (Objektif / Tanda Vital)..." value={newEntry.o} onChange={(e) => setNewEntry({ ...newEntry, o: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-800" />
                <textarea rows={2} placeholder="A (Asesmen / Diagnosis)..." value={newEntry.a} onChange={(e) => setNewEntry({ ...newEntry, a: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-800" />
                <textarea rows={2} placeholder="P (Plan / Tata Laksana)..." value={newEntry.p} onChange={(e) => setNewEntry({ ...newEntry, p: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-800" />
              </div>
              <input
                type="text"
                placeholder="Instruksi PPA..."
                value={newEntry.instruksi}
                onChange={(e) => setNewEntry({ ...newEntry, instruksi: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-slate-800 text-xs"
              />
              <button onClick={handleAddEntry} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm">
                Simpan Catatan
              </button>
            </div>
          )}

          <div className="space-y-3">
            {entries.map((item) => (
              <div key={item.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex justify-between items-center border-b pb-1 text-xs">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">{item.profesi} • {item.namaPetugas}</span>
                  <span className="text-slate-500 font-mono">{item.tanggal}, {item.jam}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <p><strong>S:</strong> {item.sbarSoap.s}</p>
                  <p><strong>O:</strong> {item.sbarSoap.o}</p>
                  <p><strong>A:</strong> {item.sbarSoap.a}</p>
                  <p><strong>P:</strong> {item.sbarSoap.p}</p>
                </div>
                <div className="text-xs pt-1 border-t flex justify-between items-center text-slate-700 dark:text-slate-300">
                  <span><strong>Instruksi:</strong> {item.instruksiPPA}</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5" /> Terverifikasi DPJP ({item.verifikasiDPJP?.jamVerifikasi})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`CPPT_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar CPPT"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={fullDocData}
            docType="cppt"
            title="CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)"
          />
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl">Tutup</button>
        </div>
      </div>
    </div>
  );
}
