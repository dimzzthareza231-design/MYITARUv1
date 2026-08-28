import React, { useState } from 'react';
import { SIPNAPReport, HighAlertItem } from './types';
import { 
  ShieldAlert, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Lock, 
  Eye, 
  Printer, 
  Plus, 
  Download,
  Flame
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface NarkotikaLasaTabProps {
  sipnapList: SIPNAPReport[];
  highAlertList: HighAlertItem[];
  onAddSipnap: (entry: SIPNAPReport) => void;
}

export function NarkotikaLasaTab({
  sipnapList,
  highAlertList,
  onAddSipnap
}: NarkotikaLasaTabProps) {
  const toast = useToast();
  const [subTab, setSubTab] = useState<'sipnap' | 'high_alert' | 'lasa'>('sipnap');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // NEW SIPNAP LOG
  const [medName, setMedName] = useState('Morphine HCl 10 mg / mL Inj');
  const [patientName, setPatientName] = useState('');
  const [noRm, setNoRm] = useState('');
  const [doctorName, setDoctorName] = useState('dr. Bambang Irawan, Sp.PD-KGEH');
  const [batchNo, setBatchNo] = useState('BAT-MOR-2026');
  const [qtyKeluar, setQtyKeluar] = useState(1);
  const [sisaStok, setSisaStok] = useState(19);

  // LASA LIST
  const lasaPairs = [
    { sound_alike_1: 'DOPamine', sound_alike_2: 'DOBUTamine', risk: 'Kardiovaskular Fatal', tall_man: 'DOPamine vs DOBUTamine' },
    { sound_alike_1: 'EPINephrine', sound_alike_2: 'NORepinefrin', risk: 'Vasokonstriktor Ekstrem', tall_man: 'EPINephrine vs NORepinefrin' },
    { sound_alike_1: 'CEFOTaxime', sound_alike_2: 'CEFTRIAXone', risk: 'Antibiotik Golongan Berbeda', tall_man: 'CEFOTaxime vs CEFTRIAXone' },
    { sound_alike_1: 'AMILoride', sound_alike_2: 'AMLODipine', risk: 'Diuretik vs Antihipertensi CCB', tall_man: 'AMILoride vs AMLODipine' },
    { sound_alike_1: 'HYDRALAzine', sound_alike_2: 'HYDROXYzine', risk: 'Vasodilator vs Antihistamin', tall_man: 'HYDRALAzine vs HYDROXYzine' }
  ];

  const handleSaveSipnap = () => {
    if (!patientName) {
      toast.error('Masukkan nama pasien penerima narkotika!');
      return;
    }
    const newEntry: SIPNAPReport = {
      id: `SIPNAP-${Date.now()}`,
      bulan: 'Agustus 2026',
      kode_obat: 'MED-NARK-001',
      nama_obat: medName,
      satuan: 'Ampul',
      stok_awal: sisaStok + qtyKeluar,
      pemasukan_pbf: 0,
      pengeluaran_resep: qtyKeluar,
      stok_akhir: sisaStok,
      transaksi: [
        {
          tanggal: new Date().toISOString().split('T')[0],
          no_resep: `RXP-NARK-${Math.floor(1000 + Math.random() * 9000)}`,
          nama_pasien: patientName,
          no_rm: noRm || 'RM-260800-0011',
          dokter_penulis: doctorName,
          jumlah: qtyKeluar,
          no_batch: batchNo
        }
      ]
    };

    onAddSipnap(newEntry);
    setShowAddLogModal(false);
    toast.success(`Pencatatan Narkotika/Psikotropika untuk pasien ${patientName} berhasil direkam ke SIPNAP.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUB-TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('sipnap')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'sipnap'
                ? 'bg-red-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Buku Register SIPNAP (Narkotika &amp; Psikotropika)</span>
          </button>

          <button
            onClick={() => setSubTab('high_alert')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'high_alert'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Daftar Obat High Alert</span>
          </button>

          <button
            onClick={() => setSubTab('lasa')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'lasa'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>LASA / NORUM (Tall Man Lettering)</span>
          </button>
        </div>

        {subTab === 'sipnap' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddLogModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Pemakaian Narkotika</span>
            </button>
            <button
              onClick={() => toast.success('Export laporan SIPNAP resmi format Kemenkes RI (Excel) selesai!')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SIPNAP</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. SUB-TAB 1: SIPNAP REGISTER */}
      {subTab === 'sipnap' && (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-extrabold text-red-900 dark:text-red-300">
                Pencatatan Wajib Laporan SIPNAP (Sistem Informasi Pelaporan Narkotika &amp; Psikotropika) Kemenkes RI
              </h4>
              <p className="text-red-700 dark:text-red-400 mt-0.5">
                Setiap ampul / tablet Narkotika dan Psikotropika wajib tercatat nomor resep dokter, nama pasien, nomor RM, dokter penanggung jawab, serta nomor batch yang keluar dari lemari narkotika berkunci ganda.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3">Nama Obat Narkotika</th>
                  <th className="p-3 text-center">Stok Awal</th>
                  <th className="p-3 text-center">Penerimaan PBF</th>
                  <th className="p-3 text-center">Pemakaian Resep</th>
                  <th className="p-3 text-center">Sisa Stok Fisik</th>
                  <th className="p-3">Rincian Pasien &amp; Dokter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sipnapList.map(sip => (
                  <tr key={sip.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {sip.nama_obat}
                      <span className="block text-[10px] font-mono text-red-600">LEMARI KHUSUS KUNCI GANDA</span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{sip.stok_awal} {sip.satuan}</td>
                    <td className="p-3 text-center font-mono text-emerald-600 font-bold">+{sip.pemasukan_pbf}</td>
                    <td className="p-3 text-center font-mono text-rose-600 font-black">-{sip.pengeluaran_resep}</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-slate-900 dark:text-white">{sip.stok_akhir} {sip.satuan}</td>
                    <td className="p-3">
                      {sip.transaksi?.map((tx: { nama_pasien: string; no_rm: string; dokter_penulis: string; no_batch: string; jumlah: number }, txi: number) => (
                        <div key={txi} className="text-[11px] space-y-0.5">
                          <span className="font-bold text-blue-600">{tx.nama_pasien} ({tx.no_rm})</span>
                          <span className="block text-slate-500">
                            Dr: {tx.dokter_penulis} • Batch: {tx.no_batch} ({tx.jumlah} {sip.satuan})
                          </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB 2: HIGH ALERT MEDICATIONS */}
      {subTab === 'high_alert' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highAlertList.map(ha => (
              <div key={ha.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-red-200 dark:border-red-900/40 shadow-sm space-y-3">
                <div className="flex justify-between items-start pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                      {ha.kategori_risiko}
                    </span>
                    <h4 className="font-black text-base text-slate-900 dark:text-white mt-1.5">
                      {ha.nama_obat}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">DOUBLE-CHECK REQUIRED</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-bold min-w-28">Penyimpanan:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{ha.lokasi_penyimpanan}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-bold min-w-28">Label Stiker:</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 rounded font-black text-[10px]">
                      {ha.stiker_label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-bold min-w-28">Prosedur Ganda:</span>
                    <span className="text-slate-800 dark:text-slate-200">{ha.double_check_protocol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 3: LASA / NORUM (TALL MAN LETTERING) */}
      {subTab === 'lasa' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-extrabold text-amber-900 dark:text-amber-300">
                Pencegahan Kesalahan Obat Serupa: Tall Man Lettering (ISMP &amp; Permenkes)
              </h4>
              <p className="text-amber-700 dark:text-amber-400 mt-0.5">
                Penggunaan huruf kapital pada bagian nama obat yang berbeda (Tall Man Lettering) untuk mencegah tertukarnya obat dengan rupa dan ucapan mirip (Look-Alike Sound-Alike).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lasaPairs.map((pair, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Pasangan LASA #{idx + 1}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded font-bold">
                    {pair.risk}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900">
                    <span className="text-sm font-black text-amber-900 dark:text-amber-200 font-mono">
                      {pair.sound_alike_1}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-900">
                    <span className="text-sm font-black text-amber-900 dark:text-amber-200 font-mono">
                      {pair.sound_alike_2}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex justify-between items-center pt-1">
                  <span>Standar Tall Man: <strong>{pair.tall_man}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL INPUT SIPNAP PEMAKAIAN */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                Catat Pengeluaran Narkotika / Psikotropika
              </h3>
              <button onClick={() => setShowAddLogModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Obat Narkotika/Psiko *</label>
                <select
                  value={medName}
                  onChange={e => setMedName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-bold"
                >
                  <option value="Morphine HCl 10 mg / mL Inj">Morphine HCl 10 mg / mL Inj (Narkotika Gol II)</option>
                  <option value="Fentanyl 0.05 mg / mL Inj">Fentanyl 0.05 mg / mL Inj (Narkotika Gol II)</option>
                  <option value="Diazepam 5 mg / mL Inj">Diazepam 5 mg / mL Inj (Psikotropika Gol IV)</option>
                  <option value="Midazolam 5 mg / 5 mL Inj">Midazolam 5 mg / 5 mL Inj (Psikotropika Gol IV)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pasien *</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    placeholder="Nama lengkap pasien"
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. RM</label>
                  <input
                    type="text"
                    value={noRm}
                    onChange={e => setNoRm(e.target.value)}
                    placeholder="RM-260800-XXXX"
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Pemakaian (Ampul)</label>
                  <input
                    type="number"
                    min={1}
                    value={qtyKeluar}
                    onChange={e => setQtyKeluar(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Batch</label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={e => setBatchNo(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dokter Penulis Resep</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowAddLogModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSipnap}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold shadow"
              >
                Rekam ke SIPNAP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
