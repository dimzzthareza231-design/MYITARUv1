import React, { useState } from 'react';
import { RadiologiItem, ModalitasType, StatusPemeriksaan } from './types';
import { 
  Search, Filter, Plus, Eye, Play, CheckCircle2, Clock, 
  AlertTriangle, ShieldAlert, ArrowUpRight, FileText, Zap,
  Activity, CheckCircle, RefreshCw
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { OrderRadiologiModal } from './OrderRadiologiModal';
import { Modal } from '../Modal';

interface PermintaanTabProps {
  radiologiList: RadiologiItem[];
  onUpdateList: (updatedList: RadiologiItem[]) => void;
  onOpenPACS: (item: RadiologiItem) => void;
  onOpenEkspertise: (item: RadiologiItem) => void;
}

export function PermintaanTab({ radiologiList, onUpdateList, onOpenPACS, onOpenEkspertise }: PermintaanTabProps) {
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedPriority, setSelectedPriority] = useState<string>('Semua');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<RadiologiItem | null>(null);

  // Status Metrics
  const countTotal = radiologiList.length;
  const countCito = radiologiList.filter(r => r.prioritas === 'Cito / Emergency').length;
  const countAntrian = radiologiList.filter(r => r.status === 'Menunggu Antrian' || r.status === 'Persiapan & Screening').length;
  const countScanning = radiologiList.filter(r => r.status === 'Sedang Pemeriksaan').length;
  const countMenungguEkspertise = radiologiList.filter(r => r.status === 'Menunggu Ekspertise').length;
  const countSelesai = radiologiList.filter(r => r.status === 'Selesai & Tervalidasi').length;

  // Filter logic
  const filteredList = radiologiList.filter(item => {
    const matchSearch = 
      item.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.no_rm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_pemeriksaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dokter_pengirim.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModality = selectedModality === 'Semua' || item.modalitas === selectedModality;
    const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
    const matchPriority = selectedPriority === 'Semua' || item.prioritas === selectedPriority;

    return matchSearch && matchModality && matchStatus && matchPriority;
  });

  // Action: Start Examination
  const handleStartScan = (item: RadiologiItem) => {
    const nowTime = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} WIB`;
    const updated = radiologiList.map(r => {
      if (r.id === item.id) {
        return {
          ...r,
          status: 'Sedang Pemeriksaan' as StatusPemeriksaan,
          waktu_mulai_scan: nowTime,
          radiografer: r.radiografer || 'Radiografer On Duty'
        };
      }
      return r;
    });
    onUpdateList(updated);
    toast.success(`Pemeriksaan ${item.id} (${item.nama_pasien}) dimulai pada ${nowTime}`);
  };

  // Action: Finish Examination (Move to Menunggu Ekspertise)
  const handleFinishScan = (item: RadiologiItem) => {
    const nowTime = `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} WIB`;
    const updated = radiologiList.map(r => {
      if (r.id === item.id) {
        return {
          ...r,
          status: 'Menunggu Ekspertise' as StatusPemeriksaan,
          waktu_selesai_scan: nowTime,
          study_instance_uid: r.study_instance_uid || `1.2.840.113619.2.55.3.${Date.now()}`
        };
      }
      return r;
    });
    onUpdateList(updated);
    toast.success(`Pemeriksaan selesai. Citra terkirim ke PACS, menunggu ekspertise dokter spesialis radiologi.`);
  };

  // Action: Add new order
  const handleAddNewOrder = (newOrder: RadiologiItem) => {
    onUpdateList([newOrder, ...radiologiList]);
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">Total Permintaan</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{countTotal}</span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-xl border border-rose-200 dark:border-rose-800/60 shadow-sm">
          <span className="text-xs text-rose-700 dark:text-rose-400 font-bold block">🚨 Cito Emergency</span>
          <span className="text-2xl font-extrabold text-rose-700 dark:text-rose-400 mt-1 block">{countCito}</span>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-sm">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-bold block">Menunggu Antrian</span>
          <span className="text-2xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 block">{countAntrian}</span>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 shadow-sm">
          <span className="text-xs text-indigo-700 dark:text-indigo-400 font-bold block">Sedang Scan</span>
          <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1 block">{countScanning}</span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800/60 shadow-sm">
          <span className="text-xs text-purple-700 dark:text-purple-400 font-bold block">Menunggu Ekspertise</span>
          <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-400 mt-1 block">{countMenungguEkspertise}</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block">Selesai & Validasi</span>
          <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">{countSelesai}</span>
        </div>
      </div>

      {/* 2. FILTER & CONTROLS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari pasien, no RM, ID order, pemeriksaan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        {/* Modality & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Modalitas dropdown */}
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
          >
            <option value="Semua">Semua Modalitas</option>
            <option value="X-Ray">X-Ray (Rontgen)</option>
            <option value="CT-Scan">CT-Scan</option>
            <option value="MRI">MRI</option>
            <option value="USG">USG Diagnostik</option>
            <option value="Panoramic">Panoramic Dental</option>
            <option value="Mammografi">Mammografi</option>
          </select>

          {/* Status dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu Antrian">Menunggu Antrian</option>
            <option value="Persiapan & Screening">Persiapan & Screening</option>
            <option value="Sedang Pemeriksaan">Sedang Pemeriksaan</option>
            <option value="Menunggu Ekspertise">Menunggu Ekspertise</option>
            <option value="Selesai & Tervalidasi">Selesai & Tervalidasi</option>
          </select>

          {/* Priority dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
          >
            <option value="Semua">Semua Prioritas</option>
            <option value="Cito / Emergency">🚨 Cito Emergency</option>
            <option value="Rutin / Elektif">Rutin / Elektif</option>
          </select>

          {/* Add Order Button */}
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-600/30 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Order Radiologi Baru</span>
          </button>
        </div>
      </div>

      {/* 3. WORKLIST TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3.5">ID & Waktu</th>
                <th className="p-3.5">Pasien & Rekam Medis</th>
                <th className="p-3.5">Pemeriksaan & Modalitas</th>
                <th className="p-3.5">Pengirim & Diagnosa</th>
                <th className="p-3.5">Screening & Kontras</th>
                <th className="p-3.5">Status Alur</th>
                <th className="p-3.5 text-center">Aksi Pelayanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada permintaan radiologi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => {
                  const isCito = item.prioritas === 'Cito / Emergency';
                  return (
                    <tr 
                      key={item.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                        isCito ? 'bg-rose-50/40 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      {/* ID & Waktu */}
                      <td className="p-3.5 align-top">
                        <div className="font-mono font-bold text-xs text-pink-600 dark:text-pink-400">
                          {item.id}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.waktu_order}</div>
                        {isCito && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full shadow-sm animate-pulse">
                            CITO
                          </span>
                        )}
                      </td>

                      {/* Pasien & RM */}
                      <td className="p-3.5 align-top">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {item.nama_pasien}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {item.no_rm} ({item.jenis_kelamin}/{item.umur} Thn)
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold">
                          {item.penjamin}
                        </span>
                      </td>

                      {/* Pemeriksaan & Modalitas */}
                      <td className="p-3.5 align-top">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.nama_pemeriksaan}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.modalitas === 'CT-Scan' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' :
                            item.modalitas === 'MRI' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                            item.modalitas === 'USG' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' :
                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {item.modalitas}
                          </span>
                          <span className="text-[11px] text-slate-400">Posisi: {item.posisi_proyeksi}</span>
                        </div>
                      </td>

                      {/* Pengirim & Diagnosa */}
                      <td className="p-3.5 align-top">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {item.dokter_pengirim}
                        </div>
                        <div className="text-[11px] text-slate-500">{item.unit_asal}</div>
                        <div className="text-xs text-pink-700 dark:text-pink-300 italic mt-1 line-clamp-1">
                          {item.diagnosa_kerja}
                        </div>
                      </td>

                      {/* Screening & Kontras */}
                      <td className="p-3.5 align-top">
                        {item.screening.penggunaan_kontras ? (
                          <div className="space-y-1">
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded block w-fit">
                              ⚠️ Media Kontras
                            </span>
                            {item.screening.kreatinin_serum && (
                              <span className="text-[11px] text-slate-500 block font-mono">
                                Kreatinin: {item.screening.kreatinin_serum} mg/dL
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Non-Kontras Polos</span>
                        )}
                        {item.screening.implan_logam_pacemaker && (
                          <span className="text-[10px] text-rose-600 font-bold block mt-1">
                            ⚠️ Implan Logam
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 align-top">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          item.status === 'Selesai & Tervalidasi' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
                          item.status === 'Menunggu Ekspertise' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300' :
                          item.status === 'Sedang Pemeriksaan' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 animate-pulse' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Aksi Pelayanan */}
                      <td className="p-3.5 align-top text-center">
                        <div className="flex flex-col gap-1.5 justify-center items-center">
                          {item.status === 'Menunggu Antrian' || item.status === 'Persiapan & Screening' ? (
                            <button
                              onClick={() => handleStartScan(item)}
                              className="w-full px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Mulai Scan</span>
                            </button>
                          ) : item.status === 'Sedang Pemeriksaan' ? (
                            <button
                              onClick={() => handleFinishScan(item)}
                              className="w-full px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Selesai Scan</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onOpenEkspertise(item)}
                              className="w-full px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{item.status === 'Selesai & Tervalidasi' ? 'Lihat Hasil' : 'Ekspertise'}</span>
                            </button>
                          )}

                          <div className="flex gap-1 w-full">
                            <button
                              onClick={() => onOpenPACS(item)}
                              className="flex-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1"
                              title="Buka Citra di PACS Viewer"
                            >
                              <Eye className="w-3.5 h-3.5 text-pink-500" />
                              <span>PACS</span>
                            </button>
                            <button
                              onClick={() => setSelectedDetailItem(item)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold"
                              title="Detail Permintaan"
                            >
                              Info
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDetailItem && (
        <Modal
          isOpen={!!selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
          title={`Detail Permintaan Radiologi: ${selectedDetailItem.id}`}
        >
          <div className="space-y-4 text-left">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {selectedDetailItem.nama_pasien}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono">
                    RM: {selectedDetailItem.no_rm} | NIK: {selectedDetailItem.nik || '-'} | Umur: {selectedDetailItem.umur} Thn ({selectedDetailItem.jenis_kelamin})
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 rounded-full font-bold text-xs">
                  {selectedDetailItem.modalitas}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-500 block">Pemeriksaan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.nama_pemeriksaan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Posisi / Proyeksi:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.posisi_proyeksi}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dokter Pengirim:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.dokter_pengirim} ({selectedDetailItem.unit_asal})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ruang / Mesin:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDetailItem.ruang_pemeriksaan}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 space-y-2">
              <h5 className="font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Catatan Screening Keamanan & Kontras
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Penggunaan Kontras: <span className="font-bold">{selectedDetailItem.screening.penggunaan_kontras ? 'Ya' : 'Tidak'}</span></div>
                <div>Alergi Iodine: <span className="font-bold text-rose-600">{selectedDetailItem.screening.alergi_kontras ? 'Ada Alergi' : 'Tidak Ada'}</span></div>
                <div>Kreatinin Serum: <span className="font-bold">{selectedDetailItem.screening.kreatinin_serum ? `${selectedDetailItem.screening.kreatinin_serum} mg/dL` : 'Belum Dicek'}</span></div>
                <div>Implan Logam / Pacemaker: <span className="font-bold">{selectedDetailItem.screening.implan_logam_pacemaker ? 'Ada' : 'Aman (Tidak Ada)'}</span></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedDetailItem(null);
                  onOpenPACS(selectedDetailItem);
                }}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Buka di PACS Viewer
              </button>
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW ORDER MODAL */}
      <OrderRadiologiModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleAddNewOrder}
      />
    </div>
  );
}
