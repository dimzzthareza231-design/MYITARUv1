import React, { useState } from 'react';
import { LabOrder, StatusLabOrder, PrioritasLab, TestItemOrdered } from './types';
import { KATALOG_LAB_MASTER } from './data';
import { 
  TestTube, Search, Plus, Filter, Clock, AlertTriangle, 
  CheckCircle2, Printer, QrCode, ArrowRight, User, Stethoscope, 
  FileText, Droplet, RefreshCw, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useHospital } from '../../contexts/HospitalContext';

interface WorklistTabProps {
  orders: LabOrder[];
  onUpdateOrders: (updated: LabOrder[]) => void;
  onSelectOrderForInput: (order: LabOrder) => void;
  onSelectOrderForValidation: (order: LabOrder) => void;
  onViewResult: (order: LabOrder) => void;
}

export function WorklistTab({
  orders,
  onUpdateOrders,
  onSelectOrderForInput,
  onSelectOrderForValidation,
  onViewResult
}: WorklistTabProps) {
  const toast = useToast();
  const { pasien: patientList, dokter: doctorList } = useHospital();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isSamplingModalOpen, setIsSamplingModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [activeOrderForModal, setActiveOrderForModal] = useState<LabOrder | null>(null);

  // Sampling Form State
  const [phlebotomistName, setPhlebotomistName] = useState('Bambang Irawan, A.Md.AK');
  const [samplingLocation, setSamplingLocation] = useState('Sampling Room Lab Sentral');
  const [sampleCondition, setSampleCondition] = useState<'Baik / Homogen' | 'Hemolisis Ringan' | 'Lipemik' | 'Ikterik' | 'Beku'>('Baik / Homogen');

  // New Order Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(doctorList[0]?.nama || 'dr. Satria Pratama, Sp.PD');
  const [originRoom, setOriginRoom] = useState('Poli Penyakit Dalam');
  const [serviceType, setServiceType] = useState<'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'MCU'>('Rawat Jalan');
  const [paymentMethod, setPaymentMethod] = useState('BPJS Kesehatan');
  const [orderPriority, setOrderPriority] = useState<PrioritasLab>('Rutin');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [selectedTestCodes, setSelectedTestCodes] = useState<string[]>([]);
  const [searchTestQuery, setSearchTestQuery] = useState('');

  // FILTERED ORDERS
  const filteredOrders = orders.filter(order => {
    const matchSearch = 
      order.nama_pasien.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.no_rm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.dokter_pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.diagnosa_klinis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchService = serviceFilter === 'ALL' || order.jenis_pelayanan === serviceFilter;
    const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || 
      (priorityFilter === 'CITO' ? order.prioritas === 'Cito / Emergency' || order.prioritas === 'Stat' : order.prioritas === 'Rutin');

    return matchSearch && matchService && matchStatus && matchPriority;
  });

  // STAT COUNTS
  const totalOrders = orders.length;
  const citoCount = orders.filter(o => o.prioritas === 'Cito / Emergency' || o.prioritas === 'Stat').length;
  const orderMasukCount = orders.filter(o => o.status === 'Order Masuk').length;
  const samplingCount = orders.filter(o => o.status === 'Sampling / Pengambilan').length;
  const inProgressCount = orders.filter(o => o.status === 'Diterima di Lab' || o.status === 'Sedang Dianalisis').length;
  const waitingValidationCount = orders.filter(o => o.status === 'Menunggu Validasi').length;
  const completedCount = orders.filter(o => o.status === 'Selesai & Tervalidasi').length;

  // HANDLERS
  const handleOpenSampling = (order: LabOrder) => {
    setActiveOrderForModal(order);
    setSamplingLocation(order.ruangan_asal);
    setIsSamplingModalOpen(true);
  };

  const handleConfirmSampling = () => {
    if (!activeOrderForModal) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const tubes = Array.from(new Set(activeOrderForModal.tests_ordered.map(t => t.wadah_sampel)));

    const updated = orders.map(o => {
      if (o.id === activeOrderForModal.id) {
        return {
          ...o,
          status: 'Diterima di Lab' as StatusLabOrder,
          sampling_info: {
            waktu_sampling: timeStr,
            petugas_phlebotomist: phlebotomistName,
            lokasi_pengambilan: samplingLocation,
            kondisi_sampel: sampleCondition,
            volume_cukup: true,
            wadah_tabung: tubes,
            barcode_specimen: `SPEC-${o.id.replace('LAB-', '')}-TUBE`
          },
          waktu_terima_lab: timeStr
        };
      }
      return o;
    });

    onUpdateOrders(updated);
    setIsSamplingModalOpen(false);
    toast.success(`Sampel pasien ${activeOrderForModal.nama_pasien} berhasil diambil dan diterima di laboratorium!`);
  };

  const handleReceiveSampleDirect = (order: LabOrder) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const updated = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'Diterima di Lab' as StatusLabOrder,
          waktu_terima_lab: timeStr
        };
      }
      return o;
    });
    onUpdateOrders(updated);
    toast.success(`Sampel ${order.id} dikonfirmasi Diterima di Lab.`);
  };

  const handleOpenBarcode = (order: LabOrder) => {
    setActiveOrderForModal(order);
    setIsBarcodeModalOpen(true);
  };

  // NEW ORDER CREATION
  const toggleSelectTest = (testCode: string) => {
    if (selectedTestCodes.includes(testCode)) {
      setSelectedTestCodes(selectedTestCodes.filter(c => c !== testCode));
    } else {
      setSelectedTestCodes([...selectedTestCodes, testCode]);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTestCodes.length === 0) {
      toast.error('Pilih minimal 1 jenis pemeriksaan laboratorium!');
      return;
    }

    const selectedPatient = patientList.find(p => p.id === selectedPatientId) || {
      id: 'P-MANUAL',
      nama: 'Pasien Rawat Jalan Baru',
      no_rm: 'RM-260826-9999',
      nik: '3273010000000000',
      jenis_kelamin: 'L',
      tanggal_lahir: '1990-01-01',
      penjamin: paymentMethod
    };

    const orderedItems: TestItemOrdered[] = selectedTestCodes.map(code => {
      const found = KATALOG_LAB_MASTER.find(k => k.kode === code)!;
      return {
        kode: found.kode,
        nama_pemeriksaan: found.nama_pemeriksaan,
        kategori: found.kategori,
        biaya: paymentMethod === 'BPJS Kesehatan' ? found.tarif_bpjs : found.tarif_umum,
        wadah_sampel: found.wadah,
        loinc_code: found.loinc_code
      };
    });

    const totalBiaya = orderedItems.reduce((acc, curr) => acc + curr.biaya, 0);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newLabId = `LAB-${dateStr.replace(/-/g, '').slice(2)}-${randomSuffix}`;

    const newOrder: LabOrder = {
      id: newLabId,
      no_order_rs: `ORD-LAB-${randomSuffix}`,
      no_rm: selectedPatient.no_rm || 'RM-260826-0101',
      nama_pasien: selectedPatient.nama,
      nik: selectedPatient.nik || '',
      jenis_kelamin: (selectedPatient.jenis_kelamin === 'P' ? 'P' : 'L'),
      tanggal_lahir: selectedPatient.tanggal_lahir || '1990-01-01',
      umur: '36 Th',
      ruangan_asal: originRoom,
      jenis_pelayanan: serviceType,
      penjamin: paymentMethod,
      dokter_pengirim: selectedDoctor,
      tanggal_order: dateStr,
      waktu_order: timeStr,
      prioritas: orderPriority,
      diagnosa_klinis: clinicalDiagnosis || 'Evaluasi Klinis Rutin',
      catatan_klinis: clinicalNotes,
      status: orderPriority === 'Cito / Emergency' ? 'Order Masuk' : 'Order Masuk',
      tests_ordered: orderedItems,
      total_biaya: totalBiaya,
      parameter_results: []
    };

    onUpdateOrders([newOrder, ...orders]);
    setIsNewOrderModalOpen(false);
    setSelectedTestCodes([]);
    setClinicalDiagnosis('');
    setClinicalNotes('');
    toast.success(`Order Lab ${newLabId} untuk ${selectedPatient.nama} berhasil dibuat!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Permintaan
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
              {totalOrders}
            </span>
            <span className="p-1.5 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 rounded-lg">
              <TestTube className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Cito / Stat
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
              {citoCount}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold rounded-full">
              Prioritas
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Order Masuk
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-amber-600">
              {orderMasukCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Antri Sampling</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Analisis / Running
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-blue-600">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Di LIS Analyzer</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">
            Perlu Validasi
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-purple-600">
              {waitingValidationCount}
            </span>
            <span className="text-[10px] text-purple-600 font-bold">dr. Sp.PK</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Selesai / Final
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-mono font-extrabold text-emerald-600">
              {completedCount}
            </span>
            <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari Pasien, No. RM, No. Lab, Dokter..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Unit / Pelayanan Filter */}
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="ALL">Semua Pelayanan</option>
            <option value="IGD">IGD (Emergency)</option>
            <option value="Rawat Jalan">Rawat Jalan (Poli)</option>
            <option value="Rawat Inap">Rawat Inap (Bangsal/ICU)</option>
            <option value="MCU">Medical Check-up</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Order Masuk">Order Masuk</option>
            <option value="Sampling / Pengambilan">Sampling</option>
            <option value="Diterima di Lab">Diterima di Lab</option>
            <option value="Sedang Dianalisis">Sedang Dianalisis</option>
            <option value="Menunggu Validasi">Menunggu Validasi</option>
            <option value="Selesai & Tervalidasi">Selesai & Tervalidasi</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="CITO">🚨 Cito / Emergency</option>
            <option value="RUTIN">Rutin</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Permintaan Lab Baru</span>
          </button>
        </div>
      </div>

      {/* TABLE WORKLIST ORDERS */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">ID Lab / No. RM</th>
                <th className="p-3.5">Identitas Pasien</th>
                <th className="p-3.5">Ruangan & Dokter</th>
                <th className="p-3.5">Pemeriksaan Diminta</th>
                <th className="p-3.5">Tabung & Spesimen</th>
                <th className="p-3.5">Status Alur</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    Tidak ditemukan data permintaan laboratorium yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const isCito = order.prioritas === 'Cito / Emergency' || order.prioritas === 'Stat';
                  const isFinal = order.status === 'Selesai & Tervalidasi';
                  const isNeedsValidation = order.status === 'Menunggu Validasi';
                  const isReadyToInput = order.status === 'Diterima di Lab' || order.status === 'Sedang Dianalisis';
                  const isPendingSampling = order.status === 'Order Masuk' || order.status === 'Sampling / Pengambilan';

                  return (
                    <tr 
                      key={order.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors ${
                        isCito ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      {/* ID LAB & NO RM */}
                      <td className="p-3.5 align-top">
                        <div className="flex items-center gap-1.5">
                          {isCito && (
                            <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-extrabold animate-pulse">
                              CITO
                            </span>
                          )}
                          <span className="font-mono font-extrabold text-cyan-700 dark:text-cyan-400">
                            {order.id}
                          </span>
                        </div>
                        <span className="font-mono text-slate-500 block text-[11px] mt-0.5">
                          {order.no_rm}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.tanggal_order} • {order.waktu_order}
                        </span>
                      </td>

                      {/* PATIENT INFO */}
                      <td className="p-3.5 align-top">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {order.nama_pasien}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {order.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {order.umur}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-medium">
                          {order.penjamin}
                        </span>
                      </td>

                      {/* ROOM & DOCTOR */}
                      <td className="p-3.5 align-top">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {order.ruangan_asal}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {order.dokter_pengirim}
                        </div>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
                          {order.jenis_pelayanan}
                        </span>
                      </td>

                      {/* TESTS ORDERED */}
                      <td className="p-3.5 align-top">
                        <div className="space-y-1">
                          {order.tests_ordered.map((t, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"></span>
                              <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                                {t.nama_pemeriksaan}
                              </span>
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-1">
                          Total: Rp {order.total_biaya.toLocaleString('id-ID')}
                        </span>
                      </td>

                      {/* SPECIMEN TUBES */}
                      <td className="p-3.5 align-top">
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(order.tests_ordered.map(t => t.wadah_sampel))).map((tube, i) => (
                            <span 
                              key={i} 
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                tube.includes('EDTA') ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300' :
                                tube.includes('Serum') ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300' :
                                tube.includes('Heparin') ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' :
                                tube.includes('Citrate') ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300' :
                                'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {tube}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => handleOpenBarcode(order)}
                          className="mt-1.5 text-[10px] text-cyan-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3 h-3" /> Cetak Label Tabung
                        </button>
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-3.5 align-top">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                          isFinal ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          isNeedsValidation ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' :
                          isReadyToInput ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-3.5 align-top text-right space-y-1.5">
                        {isPendingSampling && (
                          <button
                            onClick={() => handleOpenSampling(order)}
                            className="w-full px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                          >
                            <Droplet className="w-3.5 h-3.5" /> Ambil Sampel
                          </button>
                        )}

                        {isReadyToInput && (
                          <button
                            onClick={() => onSelectOrderForInput(order)}
                            className="w-full px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                          >
                            <TestTube className="w-3.5 h-3.5" /> Input Hasil LIS
                          </button>
                        )}

                        {isNeedsValidation && (
                          <button
                            onClick={() => onSelectOrderForValidation(order)}
                            className="w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Validasi Sp.PK
                          </button>
                        )}

                        {isFinal && (
                          <button
                            onClick={() => onViewResult(order)}
                            className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" /> Cetak Hasil
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SAMPLING / PHLEBOTOMY */}
      {isSamplingModalOpen && activeOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 rounded-xl">
                  <Droplet className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-base">
                  Pengambilan Sampel (Phlebotomy)
                </h3>
              </div>
              <button 
                onClick={() => setIsSamplingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pasien:</span>
                  <span className="font-bold">{activeOrderForModal.nama_pasien} ({activeOrderForModal.no_rm})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Permintaan Lab:</span>
                  <span className="font-mono font-bold text-cyan-600">{activeOrderForModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ruangan:</span>
                  <span>{activeOrderForModal.ruangan_asal}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Nama Petugas Sampling (Phlebotomist)</label>
                <input
                  type="text"
                  value={phlebotomistName}
                  onChange={e => setPhlebotomistName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Lokasi Pengambilan Spesimen</label>
                <input
                  type="text"
                  value={samplingLocation}
                  onChange={e => setSamplingLocation(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Kondisi & Kualitas Spesimen</label>
                <select
                  value={sampleCondition}
                  onChange={e => setSampleCondition(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Baik / Homogen">Baik / Homogen (Volume Cukup, Tanpa Bekuan)</option>
                  <option value="Hemolisis Ringan">Hemolisis Ringan</option>
                  <option value="Lipemik">Lipemik (Kekeruhan Lemak Tinggi)</option>
                  <option value="Ikterik">Ikterik (Kuning Pekat / Bilirubin Tinggi)</option>
                  <option value="Beku">Beku (Spesimen Darah Menggumpal)</option>
                </select>
              </div>

              <div className="p-3 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800 text-[11px] text-cyan-900 dark:text-cyan-200">
                <span className="font-bold block mb-1">Tabung yang harus disiapkan:</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(new Set(activeOrderForModal.tests_ordered.map(t => t.wadah_sampel))).map((tube, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-cyan-300 font-bold">
                      {tube}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSamplingModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSampling}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Sampling & Terima di Lab</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRINT BARCODE LABEL */}
      {isBarcodeModalOpen && activeOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-cyan-600" />
                <h3 className="font-extrabold text-base">
                  Label Barcode Spesimen Tabung
                </h3>
              </div>
              <button 
                onClick={() => setIsBarcodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <div className="font-mono text-sm font-extrabold tracking-widest text-slate-900 dark:text-white">
                  *{activeOrderForModal.id}*
                </div>
                <div className="flex justify-center py-2">
                  <div className="w-44 h-12 bg-slate-800 text-white flex items-center justify-center font-mono font-bold tracking-widest text-xs rounded">
                    ||| | | |||| | ||| ||
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeOrderForModal.nama_pasien} ({activeOrderForModal.no_rm})
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {activeOrderForModal.jenis_kelamin === 'L' ? 'L' : 'P'} / {activeOrderForModal.umur} • {activeOrderForModal.ruangan_asal}
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeOrderForModal.tanggal_order} {activeOrderForModal.waktu_order}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBarcodeModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Mencetak label barcode thermal 50x30mm...');
                    setIsBarcodeModalOpen(false);
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak Thermal Label
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUAT ORDER LAB BARU */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 rounded-xl">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="font-extrabold text-base">
                  Formulir Permintaan Pemeriksaan Laboratorium (LIS Order)
                </h3>
              </div>
              <button 
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-5 text-xs">
              {/* PATIENT SELECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Pilih Pasien Terdaftar</label>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">-- Pilih dari database pasien --</option>
                    {patientList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nama} ({p.no_rm}) - {p.penjamin}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Dokter Pengirim</label>
                  <select
                    value={selectedDoctor}
                    onChange={e => setSelectedDoctor(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {doctorList.map(d => (
                      <option key={d.id} value={d.nama}>{d.nama} ({d.spesialisasi})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Ruangan / Poli Asal</label>
                  <input
                    type="text"
                    value={originRoom}
                    onChange={e => setOriginRoom(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Contoh: Poli Penyakit Dalam / IGD / Bangsal Teratai"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Jenis Pelayanan & Prioritas</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={serviceType}
                      onChange={e => setServiceType(e.target.value as any)}
                      className="p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none"
                    >
                      <option value="Rawat Jalan">Rawat Jalan</option>
                      <option value="Rawat Inap">Rawat Inap</option>
                      <option value="IGD">IGD (Emergency)</option>
                      <option value="MCU">Medical Check-Up</option>
                    </select>

                    <select
                      value={orderPriority}
                      onChange={e => setOrderPriority(e.target.value as any)}
                      className={`p-2.5 border rounded-xl font-bold outline-none ${
                        orderPriority === 'Cito / Emergency' 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300' 
                          : 'border-slate-300 dark:border-slate-600 bg-transparent'
                      }`}
                    >
                      <option value="Rutin">Rutin</option>
                      <option value="Cito / Emergency">🚨 Cito / Emergency</option>
                      <option value="Stat">⚡ Stat (Segera)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* DIAGNOSIS & CLINICAL NOTES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Diagnosa Klinis / Indikasi</label>
                  <input
                    type="text"
                    required
                    value={clinicalDiagnosis}
                    onChange={e => setClinicalDiagnosis(e.target.value)}
                    placeholder="Contoh: Febris H-4 Suspek DHF / ACS / DM Tipe 2"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Penjamin Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan (JKN-KIS)</option>
                    <option value="Umum / Tunai">Umum / Tunai / Pribadi</option>
                    <option value="Asuransi Mandiri Inhealth">Asuransi Mandiri Inhealth</option>
                    <option value="Asuransi Prudential">Asuransi Prudential</option>
                  </select>
                </div>
              </div>

              {/* TEST CATALOG SELECTION */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-sm block">
                    Pilih Panel & Parameter Uji Laboratorium ({selectedTestCodes.length} dipilih)
                  </label>
                  <input
                    type="text"
                    placeholder="Filter tes lab..."
                    value={searchTestQuery}
                    onChange={e => setSearchTestQuery(e.target.value)}
                    className="px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  {KATALOG_LAB_MASTER
                    .filter(t => t.nama_pemeriksaan.toLowerCase().includes(searchTestQuery.toLowerCase()) || t.kategori.toLowerCase().includes(searchTestQuery.toLowerCase()))
                    .map(test => {
                      const isSelected = selectedTestCodes.includes(test.kode);
                      return (
                        <div
                          key={test.kode}
                          onClick={() => toggleSelectTest(test.kode)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-950 dark:text-cyan-100 shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-bold text-xs leading-tight">
                              {test.nama_pemeriksaan}
                            </span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
                            />
                          </div>

                          <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                            <span>{test.wadah.split('(')[0]}</span>
                            <span className="font-mono font-bold text-cyan-600">
                              Rp {(paymentMethod === 'BPJS Kesehatan' ? test.tarif_bpjs : test.tarif_umum).toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs">
                  <span className="text-slate-500">Estimasi Total Biaya: </span>
                  <span className="font-mono font-extrabold text-base text-cyan-600">
                    Rp {selectedTestCodes
                      .reduce((acc, code) => {
                        const t = KATALOG_LAB_MASTER.find(k => k.kode === code);
                        return acc + (t ? (paymentMethod === 'BPJS Kesehatan' ? t.tarif_bpjs : t.tarif_umum) : 0);
                      }, 0)
                      .toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewOrderModalOpen(false)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Kirim Permintaan ke Lab</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
