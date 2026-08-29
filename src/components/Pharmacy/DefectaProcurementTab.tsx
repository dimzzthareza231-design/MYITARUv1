import React, { useState } from 'react';
import { MedicationStock, PurchaseOrderDefecta, DefectaItem } from './types';
import { 
  ShoppingCart, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  Printer, 
  Plus, 
  Send, 
  ShieldCheck, 
  Building,
  DollarSign
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';

interface DefectaProcurementTabProps {
  stocks: MedicationStock[];
  poList: PurchaseOrderDefecta[];
  defectaList: DefectaItem[];
  onAddPO: (po: PurchaseOrderDefecta) => void;
  onUpdatePO: (po: PurchaseOrderDefecta) => void;
}

export function DefectaProcurementTab({
  stocks,
  poList,
  defectaList,
  onAddPO,
  onUpdatePO
}: DefectaProcurementTabProps) {
  const toast = useToast();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderDefecta | null>(poList[0] || null);
  const [showCreateSPModal, setShowCreateSPModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // FORM SP STATE
  const [spType, setSpType] = useState<'SP Reguler' | 'SP Narkotika (Khusus)' | 'SP Psikotropika' | 'SP Prekursor'>('SP Reguler');
  const [selectedPbf, setSelectedPbf] = useState('PT Mensa Bina Sukses');
  const [spItems, setSpItems] = useState<Array<{ kode_obat: string; nama_obat: string; jumlah_order: number; satuan: string; harga_satuan: number; subtotal: number }>>([]);
  const [selectedDrugToAdd, setSelectedDrugToAdd] = useState('');
  const [orderQty, setOrderQty] = useState(10);

  // AUTOMATIC DEFECTA CALCULATION FROM REAL-TIME STOCKS
  const autoDefecta = stocks
    .filter(s => s.stok_total <= s.stok_minimum)
    .map(s => ({
      kode_obat: s.id,
      nama_obat: s.nama_obat,
      stok_tersisa: s.stok_total,
      stok_minimum: s.stok_minimum,
      jumlah_reorder_disarankan: Math.max(10, s.stok_maksimum - s.stok_total),
      satuan: s.satuan_terkecil,
      harga_estimasi_satuan: s.harga_beli,
      subtotal: (s.stok_maksimum - s.stok_total) * s.harga_beli,
      distributor_rekomendasi: s.distributor_utama,
      alasan: s.stok_total === 0 ? 'Mendekati Habis' : 'Stok Kritis (< Min)'
    } as DefectaItem));

  const allDefecta = autoDefecta.length > 0 ? autoDefecta : defectaList;

  // ADD ITEM TO SP
  const handleAddItemToSP = () => {
    const drug = stocks.find(s => s.id === selectedDrugToAdd);
    if (!drug) {
      toast.error('Pilih obat terlebih dahulu!');
      return;
    }
    const item = {
      kode_obat: drug.id,
      nama_obat: drug.nama_obat,
      jumlah_order: orderQty,
      satuan: drug.satuan_terkecil,
      harga_satuan: drug.harga_beli,
      subtotal: drug.harga_beli * orderQty
    };
    setSpItems([...spItems, item]);
    setSelectedDrugToAdd('');
    toast.success(`${drug.nama_obat} dimasukkan ke draf Surat Pesanan.`);
  };

  // SAVE NEW SP
  const handleSaveSP = () => {
    if (spItems.length === 0) {
      toast.error('Tambahkan minimal 1 item obat ke Surat Pesanan!');
      return;
    }
    const totalNilai = spItems.reduce((acc, it) => acc + it.subtotal, 0);
    const newPO: PurchaseOrderDefecta = {
      id: `PO-${Date.now()}`,
      no_po: `PO-Klinik-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal_order: new Date().toISOString().split('T')[0],
      distributor_pbf: selectedPbf,
      alamat_pbf: 'Kawasan Pergudangan Farmasi Nasional, Jakarta',
      telepon_pbf: '(021) 500-8899',
      jenis_sp: spType,
      items: spItems,
      total_nilai_po: totalNilai,
      status: 'Disetujui Ka. Instalasi',
      petugas_pembuat: 'Apt. Sarah Larasati, S.Farm',
      apoteker_penanggung_jawab: 'Apt. Dimas Alifia, S.Farm., M.Clin.Pharm',
      sipa_apoteker: 'SIPA.19940826/SIPA-Klinik/2023'
    };

    onAddPO(newPO);
    setSelectedPO(newPO);
    setShowCreateSPModal(false);
    setSpItems([]);
    toast.success(`Surat Pesanan ${newPO.no_po} (${spType}) berhasil diterbitkan dan siap dikirim ke ${selectedPbf}!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            Pengadaan &amp; Buffer Stock Klinik
          </span>
          <h2 className="text-xl font-black mt-1">Defecta &amp; Surat Pesanan (SP) Farmasi</h2>
          <p className="text-xs text-slate-300">
            Sistem otomatis mendeteksi obat di bawah buffer stock minimum untuk mencegah kekosongan obat (Out of Stock).
          </p>
        </div>

        <button
          onClick={() => setShowCreateSPModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Surat Pesanan (SP) Resmi</span>
        </button>
      </div>

      {/* 2. DEFECTA LIST (AUTOMATIC REORDER RECOMMENDATION) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Daftar Defecta Real-Time ({allDefecta.length} Obat Perlu Reorder)
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">Auto-Buffer Stock Analysis</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-3">Kode Obat</th>
                <th className="p-3">Nama Obat</th>
                <th className="p-3 text-center">Sisa Stok</th>
                <th className="p-3 text-center">Batas Minimum</th>
                <th className="p-3 text-center">Saran Order</th>
                <th className="p-3">Distributor Rekomendasi</th>
                <th className="p-3 text-right">Estimasi Anggaran</th>
                <th className="p-3 text-center">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {allDefecta.map((df, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-mono font-bold text-blue-600">{df.kode_obat}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{df.nama_obat}</td>
                  <td className="p-3 text-center font-mono font-black text-rose-600">
                    {df.stok_tersisa} {df.satuan}
                  </td>
                  <td className="p-3 text-center font-mono text-slate-500">{df.stok_minimum}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-600">
                    +{df.jumlah_reorder_disarankan} {df.satuan}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">{df.distributor_rekomendasi}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    Rp {df.subtotal.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded text-[10px] font-bold">
                      {df.alasan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SURAT PESANAN (PO) LIST & PRINT PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LIST PO (5 COLS) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-black uppercase text-slate-500 px-1">
            Riwayat Surat Pesanan Resmi ({poList.length})
          </span>

          {poList.map(po => {
            const isSelected = selectedPO?.id === po.id;
            return (
              <div
                key={po.id}
                onClick={() => setSelectedPO(po)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {po.no_po}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">
                      {po.distributor_pbf}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {po.jenis_sp} • {po.tanggal_order}
                    </p>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {po.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
                  <span className="text-slate-500">{po.items.length} Item Obat Dipesan</span>
                  <span className="font-black text-blue-600">Rp {po.total_nilai_po.toLocaleString('id-ID')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PO DOCUMENT OFFICIAL FORMAT (7 COLS) */}
        <div className="lg:col-span-7">
          {selectedPO ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-mono text-xs font-bold text-slate-500">DOKUMEN SURAT PESANAN RESMI</span>
                <button
                  onClick={() => {
                    setShowPreview(true);
                  }}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat Pesanan</span>
                </button>
              </div>

              {/* KOP SURAT PESANAN */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs font-sans">
                <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-3">
                  <h3 className="font-black text-base text-slate-900 dark:text-white uppercase tracking-wider">
                    KLINIK ITARU MEDIKA
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    INSTALASI FARMASI Klinik ITARU • Jl. Kesehatan No. 10 Jakarta
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Izin Operasional Klinik: 440/12/DINKES/2020 • Telp: (021) 789-0123
                  </p>
                  <div className="mt-2 inline-block px-3 py-0.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs uppercase tracking-widest rounded">
                    {selectedPO.jenis_sp}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Nomor SP:</span>
                    <span className="font-mono font-bold">{selectedPO.no_po}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Tanggal Pesanan:</span>
                    <span className="font-bold">{selectedPO.tanggal_order}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kepada Distributor (PBF):</span>
                    <strong className="text-slate-900 dark:text-white">{selectedPO.distributor_pbf}</strong>
                    <p className="text-[11px] text-slate-500">{selectedPO.alamat_pbf}</p>
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <table className="w-full text-left text-xs border border-slate-300 dark:border-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-800 font-bold">
                    <tr>
                      <th className="p-2 border">No</th>
                      <th className="p-2 border">Nama Obat / BMHP</th>
                      <th className="p-2 border text-center">Jumlah</th>
                      <th className="p-2 border text-right">Harga Satuan</th>
                      <th className="p-2 border text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPO.items.map((it, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2 border text-center">{idx + 1}</td>
                        <td className="p-2 border font-bold">{it.nama_obat}</td>
                        <td className="p-2 border text-center font-mono font-bold">{it.jumlah_order} {it.satuan}</td>
                        <td className="p-2 border text-right font-mono">Rp {it.harga_satuan.toLocaleString('id-ID')}</td>
                        <td className="p-2 border text-right font-mono font-black">Rp {it.subtotal.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 dark:bg-slate-800 font-black border-t-2">
                      <td colSpan={4} className="p-2 text-right">TOTAL NILAI PEMBELIAN (Exc. PPN):</td>
                      <td className="p-2 text-right font-mono text-blue-600">Rp {(selectedPO as any).total_harga_po.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>

                {/* TANDA TANGAN APOTEKER PENANGGUNG JAWAB */}
                <div className="flex justify-between items-end pt-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Petugas Pengadaan:</span>
                    <p className="font-bold">{selectedPO.petugas_pembuat}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-slate-500">Jakarta, {selectedPO.tanggal_order}</p>
                    <p className="font-bold">Apoteker Penanggung Jawab (APJ)</p>
                    <div className="h-12 flex items-center justify-center italic text-slate-400 text-xs">
                      (Tanda Tangan &amp; Cap)
                    </div>
                    <p className="font-black underline">{selectedPO.apoteker_penanggung_jawab}</p>
                    <p className="text-[10px] font-mono text-slate-500">{selectedPO.sipa_apoteker}</p>
                  </div>
                </div>
              </div>
            </div>

              
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              Pilih Surat Pesanan di sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {showPreview && selectedPO && (
                <DocumentPreviewModal 
                  isOpen={showPreview}
                  onClose={() => setShowPreview(false)}
                  customContent={(
                    <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm max-w-4xl mx-auto">
                      <div className="text-center border-b-2 border-slate-800 pb-3">
                        <h3 className="font-black text-base uppercase tracking-wider">
                          KLINIK ITARU MEDIKA
                        </h3>
                        <p className="text-xs text-slate-600">
                          INSTALASI FARMASI Klinik ITARU • Jl. Kesehatan No. 10 Jakarta
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Izin Operasional Klinik: 440/12/DINKES/2020 • Telp: (021) 789-0123
                        </p>
                        <div className="mt-2 inline-block px-3 py-0.5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded">
                          {selectedPO.jenis_sp}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                        <div>
                          <span className="text-slate-500 block">Nomor SP:</span>
                          <span className="font-mono font-bold">{selectedPO.no_po}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Tanggal Terbit:</span>
                          <span className="font-bold">{selectedPO.tanggal_order}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Kepada Yth. PBF:</span>
                          <span className="font-black text-slate-800 text-sm">{(selectedPO as any).supplier}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 border border-slate-300 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                            <tr>
                              <th className="p-2">No</th>
                              <th className="p-2">Nama Obat / BHP</th>
                              <th className="p-2">Kemasan</th>
                              <th className="p-2 text-center">Jml Pesan</th>
                              <th className="p-2 text-right">Harga Satuan (Rp)</th>
                              <th className="p-2 text-right">Subtotal (Rp)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {selectedPO.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="p-2 text-slate-400">{idx + 1}</td>
                                <td className="p-2 font-bold">{item.nama_obat}</td>
                                <td className="p-2">{(item as any).kemasan || 'Box'}</td>
                                <td className="p-2 text-center font-bold text-blue-700">{item.jumlah_order}</td>
                                <td className="p-2 text-right">{item.harga_satuan.toLocaleString('id-ID')}</td>
                                <td className="p-2 text-right font-bold text-slate-800">
                                  {(item.jumlah_order * item.harga_satuan).toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-slate-50 font-bold border-t border-slate-300">
                            <tr className="text-sm">
                              <td colSpan={5} className="p-2 text-right text-slate-700">Estimasi Total SP:</td>
                              <td className="p-2 text-right text-blue-800">
                                Rp {(selectedPO as any).total_harga.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <div className="pt-6 mt-4 border-t border-slate-300 flex justify-between text-xs">
                        <div className="text-slate-500">
                          * Harga tertera adalah estimasi belum termasuk PPN.
                        </div>
                        <div className="text-center">
                          <p className="text-[11px] text-slate-500">Jakarta, {selectedPO.tanggal_order}</p>
                          <p className="font-bold">Apoteker Penanggung Jawab (APJ)</p>
                          <div className="h-12 flex items-center justify-center italic text-slate-400 text-xs">
                            (Tanda Tangan & Cap)
                          </div>
                          <p className="font-black underline">{selectedPO.apoteker_penanggung_jawab}</p>
                          <p className="text-[10px] font-mono text-slate-500">{selectedPO.sipa_apoteker}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  title={`SP_${selectedPO.no_po}`}
                />
              )}
      {/* 4. MODAL BUAT SURAT PESANAN */}
      {showCreateSPModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Penerbitan Surat Pesanan (SP) Resmi
              </h3>
              <button onClick={() => setShowCreateSPModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Surat Pesanan *</label>
                  <select
                    value={spType}
                    onChange={e => setSpType(e.target.value as any)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-bold"
                  >
                    <option value="SP Reguler">SP Reguler (Obat Bebas &amp; Keras)</option>
                    <option value="SP Narkotika (Khusus)">SP Narkotika (Formulir Khusus 4 Rangkap)</option>
                    <option value="SP Psikotropika">SP Psikotropika</option>
                    <option value="SP Prekursor">SP Prekursor Farmasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Distributor PBF Tujuan *</label>
                  <select
                    value={selectedPbf}
                    onChange={e => setSelectedPbf(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="PT Kimia Farma Trading & Distribution">PT Kimia Farma Trading &amp; Distribution</option>
                    <option value="PT Anugrah Argon Medica">PT Anugrah Argon Medica</option>
                    <option value="PT Enseval Putera Megatrading">PT Enseval Putera Megatrading</option>
                    <option value="PT Mensa Bina Sukses">PT Mensa Bina Sukses</option>
                  </select>
                </div>
              </div>

              {/* ADD ITEM ROW */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2 border">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tambah Item ke SP:</span>
                <div className="flex gap-2 items-center">
                  <select
                    value={selectedDrugToAdd}
                    onChange={e => setSelectedDrugToAdd(e.target.value)}
                    className="flex-1 p-2 border rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="">-- Pilih Obat --</option>
                    {stocks.map(s => (
                      <option key={s.id} value={s.id}>{s.nama_obat} (HPP: Rp {s.harga_beli.toLocaleString('id-ID')})</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={orderQty}
                    onChange={e => setOrderQty(Number(e.target.value))}
                    className="w-20 p-2 border rounded-lg bg-white dark:bg-slate-800 font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToSP}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                  >
                    + Masukkan
                  </button>
                </div>
              </div>

              {/* CURRENT SP ITEMS */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Daftar Item SP ({spItems.length}):</span>
                {spItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                    <div>
                      <strong>{idx + 1}. {it.nama_obat}</strong>
                      <span className="text-slate-500 ml-2">({it.jumlah_order} {it.satuan})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                      <button
                        type="button"
                        onClick={() => setSpItems(spItems.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowCreateSPModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSP}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow"
              >
                Terbitkan Surat Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
