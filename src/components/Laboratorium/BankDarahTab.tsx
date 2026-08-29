import React, { useState } from 'react';
import { BloodBankStock, CrossmatchOrder } from './types';
import { BLOOD_STOCK_MOCK, CROSSMATCH_ORDERS_MOCK } from './data';
import { 
  Droplet, CheckCircle2, AlertTriangle, Plus, 
  Search, ShieldAlert, Thermometer, QrCode, ArrowRight, X, Clock
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function BankDarahTab() {
  const toast = useToast();
  const [bloodStock, setBloodStock] = useState<BloodBankStock[]>(() => {
    const saved = localStorage.getItem('simrs_blood_stock');
    return saved ? JSON.parse(saved) : BLOOD_STOCK_MOCK;
  });

  const [crossmatchList, setCrossmatchList] = useState<CrossmatchOrder[]>(() => {
    const saved = localStorage.getItem('simrs_crossmatch_orders');
    return saved ? JSON.parse(saved) : CROSSMATCH_ORDERS_MOCK;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');
  const [isCrossmatchModalOpen, setIsCrossmatchModalOpen] = useState(false);

  // New Crossmatch form
  const [patientName, setPatientName] = useState('');
  const [noRm, setNoRm] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A' | 'B' | 'AB' | 'O'>('O');
  const [rhesus, setRhesus] = useState<'+' | '-'>('+');
  const [componentType, setComponentType] = useState('Packed Red Cells (PRC)');
  const [jumlahKantong, setJumlahKantong] = useState(2);
  const [ruangan, setRuangan] = useState('IGD / Teratai');
  const [diagnosa, setDiagnosa] = useState('');

  // FILTERED STOCK
  const filteredStock = bloodStock.filter(item => {
    const asal = item.asal_darah || item.asal_pmi || '';
    const matchSearch = item.no_kantong.toLowerCase().includes(searchQuery.toLowerCase()) || asal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = selectedGroupFilter === 'ALL' || item.golongan_darah === selectedGroupFilter;
    return matchSearch && matchGroup;
  });

  // SUMMARY METRICS
  const totalBags = bloodStock.filter(b => b.status === 'Tersedia').length;
  const prcCount = bloodStock.filter(b => b.status === 'Tersedia' && ((b.jenis_komponen || b.komponen || '').includes('PRC'))).length;
  const tcCount = bloodStock.filter(b => b.status === 'Tersedia' && ((b.jenis_komponen || b.komponen || '').includes('TC'))).length;
  const ffpCount = bloodStock.filter(b => b.status === 'Tersedia' && ((b.jenis_komponen || b.komponen || '').includes('FFP'))).length;

  const handleReleaseBloodBag = (order: CrossmatchOrder) => {
    const status = order.kesimpulan || order.status_hasil || '';
    if (!status.includes('Kompatibel') && !status.includes('Cocok')) {
      toast.error('Darah belum teruji Kompatibel / Cocok!');
      return;
    }

    const updated = crossmatchList.map(c => {
      if (c.id === order.id) {
        return {
          ...c,
          status: 'Sudah Diambil Ruangan',
          status_hasil: 'Sudah Didistribusikan'
        };
      }
      return c;
    });

    setCrossmatchList(updated);

    toast.success(`Kantong darah untuk ${order.nama_pasien || order.pasien_nama} berhasil dikeluarkan ke ${order.ruangan}!`);
  };

  const handleCreateCrossmatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !noRm) {
      toast.error('Nama dan No. RM Pasien wajib diisi!');
      return;
    }

    const newId = `XM-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomBag = `BD-PRC-26-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: CrossmatchOrder = {
      id: newId,
      no_permintaan_bdrs: `REQ-${newId}`,
      nama_pasien: patientName,
      pasien_nama: patientName,
      no_rm: noRm,
      golongan_darah_pasien: bloodGroup,
      golongan_darah: bloodGroup,
      rhesus_pasien: rhesus,
      rhesus: rhesus,
      komponen: componentType,
      jumlah_kantong: jumlahKantong,
      ruangan: ruangan,
      diagnosa: diagnosa || 'Anemia gravis / Perdarahan akut',
      indikasi: diagnosa || 'Anemia gravis / Perdarahan akut',
      waktu_order: `${new Date().toISOString().split('T')[0]} 09:30 WIB`,
      no_kantong_darah: randomBag,
      reaksi_mayor: 'Aglutinasi (-)',
      reaksi_minor: 'Aglutinasi (-)',
      hasil_mayor: 'Negatif (Kompatibel)',
      hasil_minor: 'Negatif (Kompatibel)',
      autokontrol: 'Negatif (-)',
      hasil_autokontrol: 'Negatif',
      kesimpulan: 'Kompatibel (Aman Ditransfusikan)',
      status_hasil: 'Kompatibel (Cocok)',
      status: 'Siap Dikeluarkan',
      petugas_bdrs: 'Apt. Siti Rohmah, S.Tr.Kes',
      petugas_uji: 'Ahmad S., A.Md.AK',
      tanggal_uji: new Date().toISOString().split('T')[0]
    };

    const updated = [newOrder, ...crossmatchList];
    setCrossmatchList(updated);


    setIsCrossmatchModalOpen(false);
    setPatientName('');
    setNoRm('');
    setDiagnosa('');
    toast.success(`Permintaan Crossmatch ${newId} berhasil diproses dan teruji Kompatibel!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* BANNER BDRS */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <Droplet className="w-7 h-7 text-white fill-white" />
          </span>
          <div>
            <h3 className="font-extrabold text-lg">
              Bank Darah Klinik (BDRS) & Uji Cocok Serasi (Crossmatching)
            </h3>
            <p className="text-xs text-rose-100 mt-0.5">
              Penyimpanan Darah Dingin Terpantau Suhu 2°C - 6°C, Gel Test Crossmatch & Integrasi PMI.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCrossmatchModalOpen(true)}
          className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Form Permintaan & Uji Crossmatch</span>
        </button>
      </div>

      {/* METRIC BADGES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-xl font-black text-lg">
            A/B
          </span>
          <div>
            <span className="text-[11px] text-slate-500 block">Total Stok Darah Siap</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalBags} <span className="text-xs font-medium text-slate-400">Kantong</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-xl font-black text-xs">
            PRC
          </span>
          <div>
            <span className="text-[11px] text-slate-500 block">Packed Red Cells (PRC)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{prcCount} <span className="text-xs font-medium text-slate-400">Ktg</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl font-black text-xs">
            TC
          </span>
          <div>
            <span className="text-[11px] text-slate-500 block">Trombosit (TC)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{tcCount} <span className="text-xs font-medium text-slate-400">Ktg</span></span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <span className="p-2.5 bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 rounded-xl font-black text-xs">
            FFP
          </span>
          <div>
            <span className="text-[11px] text-slate-500 block">Plasma Segar (FFP)</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{ffpCount} <span className="text-xs font-medium text-slate-400">Ktg</span></span>
          </div>
        </div>
      </div>

      {/* CROSSMATCH WORKLIST TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Antrean Permintaan Darah & Hasil Uji Cocok Serasi (Crossmatch)
            </h4>
            <p className="text-xs text-slate-500">
              Validasi Reaksi Mayor, Reaksi Minor, dan Autokontrol metode Gel Card / Tube Test.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">ID Order</th>
                <th className="p-3.5">Pasien & Gol. Darah</th>
                <th className="p-3.5">Komponen & Jml</th>
                <th className="p-3.5">Ruangan Asal</th>
                <th className="p-3.5">No. Kantong Darah</th>
                <th className="p-3.5">Hasil Mayor / Minor / Auto</th>
                <th className="p-3.5">Status Kecocokan</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {crossmatchList.map(order => {
                const status = order.kesimpulan || order.status_hasil || order.status || '';
                const isCompat = status.includes('Kompatibel') || status.includes('Cocok') || status === 'Siap Dikeluarkan';
                const isDistributed = status === 'Sudah Didistribusikan' || status === 'Sudah Diambil Ruangan';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-cyan-600">
                      {order.id}
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {order.nama_pasien || order.pasien_nama}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {order.no_rm} • Gol: <span className="text-rose-600 font-bold">{order.golongan_darah_pasien || order.golongan_darah}{order.rhesus_pasien || order.rhesus}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-semibold">
                      {order.komponen} ({order.jumlah_kantong} Ktg)
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {order.ruangan}
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-bold">
                      {order.no_kantong_darah || order.no_permintaan_bdrs || '-'}
                    </td>

                    <td className="p-3.5 text-[11px] text-slate-500">
                      <div>M: <span className="text-slate-800 dark:text-slate-200 font-medium">{order.reaksi_mayor || order.hasil_mayor || 'Negatif'}</span></div>
                      <div>m: <span className="text-slate-800 dark:text-slate-200 font-medium">{order.reaksi_minor || order.hasil_minor || 'Negatif'}</span></div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isDistributed ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                        isCompat ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      {isCompat && !isDistributed && (
                        <button
                          onClick={() => handleReleaseBloodBag(order)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow transition-colors"
                        >
                          Keluarkan Darah
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOOD STOCK REFRIGERATOR INVENTORY */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-600" />
              <span>Inventori Stok Kantong Darah Dingin (Blood Chiller 2-6°C)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Monitoring suhu real-time, tanggal kedaluwarsa (ED), dan nomor barcode kantong.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* SEARCH */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari no. kantong / PMI..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 outline-none"
              />
            </div>

            {/* FILTER GOL DARAH */}
            <select
              value={selectedGroupFilter}
              onChange={e => setSelectedGroupFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-bold outline-none"
            >
              <option value="ALL">Semua Golongan</option>
              <option value="A">Gol. A</option>
              <option value="B">Gol. B</option>
              <option value="AB">Gol. AB</option>
              <option value="O">Gol. O</option>
            </select>
          </div>
        </div>

        {/* STOCK TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">No. Kantong Darah</th>
                <th className="p-3.5 text-center">Golongan & Rhesus</th>
                <th className="p-3.5">Komponen Darah</th>
                <th className="p-3.5">Volume (mL)</th>
                <th className="p-3.5">Asal Darah / PMI</th>
                <th className="p-3.5">Lokasi Chiller / Suhu</th>
                <th className="p-3.5">Tanggal Kedaluwarsa</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStock.map(bag => (
                <tr key={bag.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {bag.no_kantong}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-extrabold text-xs">
                      {bag.golongan_darah}{bag.rhesus}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {bag.jenis_komponen || bag.komponen}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {bag.volume_ml} mL
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {bag.asal_darah || bag.asal_pmi}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">
                    {bag.lokasi_chiller || bag.lokasi_simpan} ({bag.suhu_penyimpanan})
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200">
                    {bag.tanggal_exp || bag.tanggal_expired}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-bold">
                      {bag.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW CROSSMATCH MODAL */}
      {isCrossmatchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-rose-50 dark:bg-rose-950/40">
              <div className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Input Form Uji Cocok Serasi (Crossmatch)
                </h3>
              </div>
              <button
                onClick={() => setIsCrossmatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrossmatch} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    No. Rekam Medis (No. RM) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="RM-2608XX-XXXX"
                    value={noRm}
                    onChange={e => setNoRm(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Pasien Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Pasien"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Golongan Darah Pasien
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Rhesus Pasien
                  </label>
                  <select
                    value={rhesus}
                    onChange={e => setRhesus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none"
                  >
                    <option value="+">Positif (+)</option>
                    <option value="-">Negatif (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jenis Komponen Darah
                  </label>
                  <select
                    value={componentType}
                    onChange={e => setComponentType(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none"
                  >
                    <option value="Packed Red Cells (PRC)">Packed Red Cells (PRC)</option>
                    <option value="Whole Blood (WB)">Whole Blood (WB)</option>
                    <option value="Thrombocyte Concentrate (TC)">Thrombocyte Concentrate (TC)</option>
                    <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jumlah Kantong
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={jumlahKantong}
                    onChange={e => setJumlahKantong(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ruangan Pemesan / Asal
                </label>
                <input
                  type="text"
                  value={ruangan}
                  onChange={e => setRuangan(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Diagnosa Klinis & Indikasi Transfusi
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Anemia gravis Hb 6.2, persiapan operasi..."
                  value={diagnosa}
                  onChange={e => setDiagnosa(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-[11px]">
                <ShieldAlert className="w-4 h-4 inline mr-1 text-amber-600" />
                <span>Uji Crossmatch otomatis mensimulasikan uji Mayor, Minor, dan Autokontrol dengan validasi keamanan transfusi.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCrossmatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
                >
                  Simpan & Uji Crossmatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
