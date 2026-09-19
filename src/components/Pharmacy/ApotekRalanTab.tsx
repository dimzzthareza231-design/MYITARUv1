import React, { useState } from 'react';
import { 
  PrescriptionOrder, 
  PrescriptionItem, 
  MedicationStock, 
  PrescriptionStatus,
  RacikanDetail,
  RacikanBahan
} from './types';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Pill, 
  Printer, 
  Plus, 
  UserCheck, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  FileCheck,
  ChevronRight,
  Eye,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { EtiketPrintModal } from './EtiketPrintModal';
import { logAIAttempt } from '../../lib/activityLogger';

interface ApotekRalanTabProps {
  prescriptions: PrescriptionOrder[];
  stocks: MedicationStock[];
  onUpdatePrescription: (order: PrescriptionOrder) => void;
  onAddPrescription: (order: PrescriptionOrder) => void;
  onDeductStock: (items: PrescriptionItem[], depoKey: 'depo_ralan' | 'depo_ranap' | 'depo_igd') => void;
}

export function ApotekRalanTab({
  prescriptions,
  stocks,
  onUpdatePrescription,
  onAddPrescription,
  onDeductStock
}: ApotekRalanTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionOrder | null>(null);
  const [showEtiketModal, setShowEtiketModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'detail' | 'telaah' | 'racikan' | 'penyerahan'>('telaah');
  const [isCheckingAiDDI, setIsCheckingAiDDI] = useState(false);

  // NEW PRESCRIPTION MANUAL MODAL
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newNoRm, setNewNoRm] = useState('');
  const [newDoctor, setNewDoctor] = useState('dr. Andi Pratama, Sp.PD');
  const [newPoli, setNewPoli] = useState('Poliklinik Penyakit Dalam');
  const [newPenjamin, setNewPenjamin] = useState<'BPJS Kesehatan' | 'Umum / Pribadi' | 'Asuransi Swasta'>('BPJS Kesehatan');
  const [newItems, setNewItems] = useState<PrescriptionItem[]>([]);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [selectedQty, setSelectedQty] = useState(10);
  const [selectedSigna, setSelectedSigna] = useState('3 x sehari 1 tablet sesudah makan');

  // RACIKAN BUILDER STATE
  const [isRacikanMode, setIsRacikanMode] = useState(false);
  const [racikanName, setRacikanName] = useState('Puyer Racikan');
  const [racikanQty, setRacikanQty] = useState(10);
  const [racikanForm, setRacikanForm] = useState<'Pulveres (Puyer)' | 'Kapsul' | 'Salep Campuran'>('Pulveres (Puyer)');
  const [racikanSigna, setRacikanSigna] = useState('3 x sehari 1 bungkus sesudah makan');
  const [racikanBahanList, setRacikanBahanList] = useState<RacikanBahan[]>([]);

  // PIO PENYERAHAN FORM STATE
  const [penerimaName, setPenerimaName] = useState('');
  const [hubunganPenerima, setHubunganPenerima] = useState<'Pasien Sendiri' | 'Suami/Istri' | 'Orang Tua' | 'Anak' | 'Keluarga Lain'>('Pasien Sendiri');
  const [limaBenar, setLimaBenar] = useState({
    benar_pasien: true,
    benar_obat: true,
    benar_dosis: true,
    benar_waktu: true,
    benar_rute: true
  });
  const [catatanPio, setCatatanPio] = useState('Diberikan edukasi waktu minum obat & cara penyimpanan.');

  // FILTERED PRESCRIPTIONS
  const ralanOrders = prescriptions.filter(p => p.jenis_layanan === 'Rawat Jalan');
  const filteredOrders = ralanOrders.filter(p => {
    const matchSearch = p.nama_pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.no_rm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.no_resep.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // SUMMARY COUNTERS
  const countWaiting = ralanOrders.filter(p => p.status === 'Menunggu Telaah').length;
  const countDispensing = ralanOrders.filter(p => p.status === 'Dalam Penyiapan').length;
  const countReady = ralanOrders.filter(p => p.status === 'Menunggu Penyerahan').length;
  const countDone = ralanOrders.filter(p => p.status === 'Selesai Terlayani').length;

  // HANDLE TELAAH RESEP CONFIRMATION
  const handleApproveTelaah = (order: PrescriptionOrder) => {
    const updated: PrescriptionOrder = {
      ...order,
      status: 'Dalam Penyiapan',
      telaah_resep: {
        ...order.telaah_resep,
        status_telaah: 'Lolos Telaah',
        apoteker_penelaah: 'Apt. Sarah Larasati, S.Farm',
        waktu_telaah: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      dispensing: {
        ...order.dispensing,
        waktu_mulai_racik: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        petugas_peracik: 'Apt. Sarah Larasati, S.Farm'
      }
    };
    onUpdatePrescription(updated);
    setSelectedOrder(updated);
    toast.success(`Resep ${order.no_resep} lolos telaah farmasi! Lanjut ke tahap dispensing.`);
  };

  // HANDLE AI DRUG INTERACTION AUDIT
  const handleRunAIDrugCheck = async (order: PrescriptionOrder) => {
    setIsCheckingAiDDI(true);
    const startTime = Date.now();
    try {
      const drugNames = order.items.map(i => i.nama_obat);
      const res = await fetch('/api/ai/drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drugs: drugNames,
          patientAge: order.umur,
          allergies: order.riwayat_alergi,
          diagnosis: `${order.diagnosis_primer} (${order.kode_icd10})`
        })
      });

      const data = await res.json();
      const latency = Date.now() - startTime;

      const updated: PrescriptionOrder = {
        ...order,
        ai_clinical_check: {
          status_keamanan: data.safety_status === 'Aman' ? 'Aman' : data.safety_status === 'Bahaya / Kontraindikasi' ? 'Bahaya / Kontraindikasi' : 'Peringatan Moderat',
          interaksi_terdeteksi: data.interactions?.map((it: any) => ({
            obat_1: it.drug1,
            obat_2: it.drug2,
            level: it.severity === 'Major' ? 'Mayor / Bahaya' : it.severity === 'Moderate' ? 'Moderat / Perhatian' : 'Minor / Ringan',
            deskripsi: it.description,
            rekomendasi: it.clinical_management
          })) || [],
          peringatan_alergi: data.fornas_recommendations || [],
          penyesuaian_dosis_gfr: data.summary,
          ringkasan_ai: data.summary
        }
      };

      onUpdatePrescription(updated);
      setSelectedOrder(updated);

      logAIAttempt({
        action: 'AI_DRUG_INTERACTION',
        status: data.interactions?.length > 0 ? 'WARNING' : 'SUCCESS',
        module: 'ApotekRalan',
        queryOrContext: `Pasien: ${order.nama_pasien}, Obat: ${drugNames.join(', ')}`,
        resultSummary: data.summary,
        latencyMs: latency
      });

      toast.success('Audit interaksi obat AI selesai dianalisis.');
    } catch (err: any) {
      console.error('AI Drug Interaction Error:', err);
      toast.error('Gagal menjalankan AI screening obat.');
    } finally {
      setIsCheckingAiDDI(false);
    }
  };

  // HANDLE FINISH DISPENSING
  const handleFinishDispensing = (order: PrescriptionOrder) => {
    const updated: PrescriptionOrder = {
      ...order,
      status: 'Menunggu Penyerahan',
      dispensing: {
        ...order.dispensing,
        waktu_selesai_racik: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        petugas_double_check: 'Apt. Dimas Alifia, S.Farm'
      }
    };
    // Deduct stock from Depo Ralan
    onDeductStock(order.items, 'depo_ralan');
    onUpdatePrescription(updated);
    setSelectedOrder(updated);
    toast.success(`Resep ${order.no_resep} selesai diracik/disiapkan! Stok depo rawat jalan berhasil dipotong.`);
  };

  // HANDLE COMPLETE PENYERAHAN & PIO
  const handleCompletePenyerahan = (order: PrescriptionOrder) => {
    if (!penerimaName && hubunganPenerima !== 'Pasien Sendiri') {
      toast.error('Masukkan nama penerima obat!');
      return;
    }
    const updated: PrescriptionOrder = {
      ...order,
      status: 'Selesai Terlayani',
      penyerahan_pio: {
        petugas_penyerah: 'Apt. Sarah Larasati, S.Farm',
        nama_penerima: penerimaName || order.nama_pasien,
        hubungan_penerima: hubunganPenerima,
        verifikasi_5_benar: limaBenar,
        konseling_diberikan: true,
        materi_konseling: ['Waktu Minum', 'Efek Samping Potensial', 'Penyimpanan Suhu Kamar'],
        catatan_pio: catatanPio,
        waktu_penyerahan: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      }
    };
    onUpdatePrescription(updated);
    setSelectedOrder(updated);
    toast.success(`Obat berhasil diserahkan kepada ${penerimaName || order.nama_pasien} beserta konseling PIO.`);
  };

  // ADD ITEM TO MANUAL PRESCRIPTION
  const handleAddItemToManual = () => {
    const drug = stocks.find(s => s.id === selectedDrugId);
    if (!drug) {
      toast.error('Pilih obat terlebih dahulu!');
      return;
    }
    const itemPrice = newPenjamin === 'BPJS Kesehatan' ? drug.harga_jual_bpjs : drug.harga_jual_umum;
    const newItem: PrescriptionItem = {
      id: `RXI-${Date.now()}`,
      kode_obat: drug.id,
      nama_obat: drug.nama_obat,
      nama_generik: drug.nama_generik,
      bentuk_sediaan: drug.bentuk_sediaan,
      kekuatan: drug.kekuatan,
      dosis: drug.kekuatan,
      frekuensi: '3 x sehari',
      aturan_pakai: selectedSigna,
      jumlah: selectedQty,
      satuan: drug.satuan_terkecil,
      signa: selectedSigna,
      rute_pemberian: 'Oral',
      tipe_item: 'Non-Racikan',
      harga_satuan: itemPrice,
      total_harga: itemPrice * selectedQty,
      is_high_alert: drug.sifat_khusus === 'High Alert',
      is_lasa: drug.sifat_khusus === 'LASA / NORUM'
    };
    setNewItems([...newItems, newItem]);
    setSelectedDrugId('');
    toast.success(`${drug.nama_obat} ditambahkan ke resep.`);
  };

  // ADD RACIKAN BAHAN
  const handleAddRacikanBahan = (drugId: string, dosisPerBungkus: string, jmlTab: number) => {
    const drug = stocks.find(s => s.id === drugId);
    if (!drug) return;
    const itemPrice = newPenjamin === 'BPJS Kesehatan' ? drug.harga_jual_bpjs : drug.harga_jual_umum;
    const bahan: RacikanBahan = {
      kode_obat: drug.id,
      nama_obat: drug.nama_obat,
      kekuatan: drug.kekuatan,
      dosis_per_bungkus: dosisPerBungkus,
      jumlah_tablet_dibutuhkan: jmlTab,
      satuan: drug.satuan_terkecil,
      harga_satuan: itemPrice
    };
    setRacikanBahanList([...racikanBahanList, bahan]);
  };

  // FINALIZE RACIKAN TO ITEMS
  const handleFinalizeRacikan = () => {
    if (racikanBahanList.length === 0) {
      toast.error('Tambahkan minimal 1 bahan obat untuk racikan!');
      return;
    }
    const totalBahanCost = racikanBahanList.reduce((acc, b) => acc + (b.harga_satuan * b.jumlah_tablet_dibutuhkan), 0);
    const racikanDetail: RacikanDetail = {
      nama_racikan: racikanName,
      bentuk_racikan: racikanForm,
      jumlah_kemasan: racikanQty,
      satuan_kemasan: racikanForm === 'Pulveres (Puyer)' ? 'Bungkus' : racikanForm === 'Kapsul' ? 'Kapsul' : 'Pot',
      signa: racikanSigna,
      aturan_pakai: racikanSigna,
      waktu_minum: 'Pagi - Siang - Malam sesudah makan',
      petunjuk_khusus: 'Simpan di tempat kering dan sejuk.',
      komposisi: racikanBahanList
    };
    const racikanItem: PrescriptionItem = {
      id: `RXI-RACIK-${Date.now()}`,
      kode_obat: `RACIK-${Date.now().toString().slice(-4)}`,
      nama_obat: `${racikanName} (${racikanQty} ${racikanDetail.satuan_kemasan})`,
      bentuk_sediaan: racikanForm,
      kekuatan: 'Racikan Campuran',
      dosis: '1 Dosis',
      frekuensi: '3 x sehari',
      aturan_pakai: racikanSigna,
      jumlah: racikanQty,
      satuan: racikanDetail.satuan_kemasan,
      signa: racikanSigna,
      rute_pemberian: 'Oral',
      tipe_item: 'Racikan',
      racikan_detail: racikanDetail,
      harga_satuan: Math.ceil(totalBahanCost / racikanQty),
      total_harga: totalBahanCost + 5000 // Jasa racik
    };
    setNewItems([...newItems, racikanItem]);
    setRacikanBahanList([]);
    setIsRacikanMode(false);
    toast.success(`Racikan ${racikanName} berhasil ditambahkan ke resep.`);
  };

  // SAVE MANUAL PRESCRIPTION
  const handleSaveManualOrder = () => {
    if (!newPatientName || newItems.length === 0) {
      toast.error('Lengkapi nama pasien dan minimal 1 item obat!');
      return;
    }
    const totalObat = newItems.reduce((acc, it) => acc + it.total_harga, 0);
    const jasaEmbalase = 2000;
    const newOrder: PrescriptionOrder = {
      id: `RX-2026-${Date.now().toString().slice(-4)}`,
      no_resep: `RSP-RALAN-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal_resep: new Date().toISOString().split('T')[0],
      waktu_resep: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      kunjungan_id: `K-RALAN-${Date.now().toString().slice(-4)}`,
      no_rm: newNoRm || `RM-${Date.now().toString().slice(-6)}`,
      nama_pasien: newPatientName,
      umur: '35 Tahun',
      jenis_kelamin: 'L',
      berat_badan_kg: 60,
      riwayat_alergi: ['Tidak ada data alergi'],
      dokter_penulis: newDoctor,
      sip_dokter: 'SIP.503/Klinik-ITARU/2023',
      poli_ruangan: newPoli,
      jenis_layanan: 'Rawat Jalan',
      penjamin: newPenjamin,
      diagnosis_primer: 'Pemeriksaan Rutin / Poliklinik',
      kode_icd10: 'Z00.0',
      tipe_resep: newItems.some(i => i.tipe_item === 'Racikan') ? 'Racikan' : 'Non-Racikan',
      status: 'Menunggu Telaah',
      items: newItems,
      telaah_resep: {
        administratif: { keabsahan_resep: true, identitas_pasien: true, identitas_dokter: true, paraf_dokter: true, tanggal_resep: true, ruangan_poli: true },
        farmasetik: { bentuk_sediaan: true, dosis_kekuatan: true, stabilitas_inkompatibilitas: true, aturan_pakai_rute: true, jumlah_obat: true },
        klinis: { ketepatan_indikasi: true, duplikasi_terapi: true, alergi_reaksi_silang: true, interaksi_obat: true, kontraindikasi: true, penyesuaian_dosis_organ: true },
        status_telaah: 'Belum Ditelaah',
        apoteker_penelaah: 'Apt. Sarah Larasati, S.Farm',
        waktu_telaah: '-'
      },
      ai_clinical_check: {
        status_keamanan: 'Aman',
        interaksi_terdeteksi: [],
        peringatan_alergi: [],
        ringkasan_ai: 'Resep baru dibuat, silakan lakukan telaah farmasi sebelum peracikan.'
      },
      dispensing: {
        jenis_etiket_dicetak: ['Putih (Oral)']
      },
      total_biaya_obat: totalObat,
      jasa_embalase: jasaEmbalase,
      total_tagihan: totalObat + jasaEmbalase
    };

    onAddPrescription(newOrder);
    setShowAddModal(false);
    setNewItems([]);
    setNewPatientName('');
    toast.success(`Resep baru ${newOrder.no_resep} berhasil masuk ke antrean farmasi rawat jalan!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Menunggu Telaah
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countWaiting} <span className="text-xs font-normal text-slate-500">Resep</span>
            </div>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Dalam Penyiapan
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countDispensing} <span className="text-xs font-normal text-slate-500">Resep</span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Pill className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Siap Diserahkan
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countReady} <span className="text-xs font-normal text-slate-500">Resep</span>
            </div>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Selesai Terlayani
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countDone} <span className="text-xs font-normal text-slate-500">Resep</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. FILTER & ACTION CONTROLS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="flex flex-1 w-full md:w-auto gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari No. Resep, Nama Pasien, No. RM..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['Semua', 'Menunggu Telaah', 'Dalam Penyiapan', 'Menunggu Penyerahan', 'Selesai Terlayani'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Resep Manual / Cito</span>
        </button>
      </div>

      {/* 3. WORKLIST TABLE & DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LIST TABLE (7 COLS) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              <Pill className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="font-bold">Tidak ada antrean resep yang sesuai.</p>
              <p className="text-xs text-slate-400">Silakan ubah filter pencarian atau buat resep baru.</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {order.no_resep}
                        </span>
                        <span className="text-xs text-slate-400">{order.waktu_resep}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          order.penjamin === 'BPJS Kesehatan' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {order.penjamin}
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">
                        {order.nama_pasien}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {order.no_rm} • {order.umur} • {order.poli_ruangan}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                        order.status === 'Menunggu Telaah'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : order.status === 'Dalam Penyiapan'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300'
                          : order.status === 'Menunggu Penyerahan'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                        Rp {order.total_tagihan.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>

                  {/* ITEMS PREVIEW */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg text-xs space-y-1 mt-2">
                    <div className="font-semibold text-slate-600 dark:text-slate-400 flex justify-between text-[11px]">
                      <span>{order.items.length} R/ Obat Dipesan:</span>
                      <span className="font-mono text-slate-500">Dokter: {order.dokter_penulis}</span>
                    </div>
                    {order.items.map((it, idx) => (
                      <div key={it.id} className="flex justify-between items-center text-slate-800 dark:text-slate-200">
                        <span className="truncate max-w-[280px]">
                          {idx + 1}. {it.nama_obat} ({it.jumlah} {it.satuan})
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{it.signa}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI ALERT BADGE IF DETECTED */}
                  {order.ai_clinical_check?.interaksi_terdeteksi?.length > 0 && (
                    <div className="mt-2 p-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>AI Alert: Terdeteksi {order.ai_clinical_check.interaksi_terdeteksi.length} potensi interaksi obat.</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* DETAILS & ACTION WORKFLOW PANEL (5 COLS) */}
        <div className="lg:col-span-5">
          {selectedOrder ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-4">
              {/* HEADER PANEL */}
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">WORKFLOW DETAIL RESEP</span>
                  <h3 className="font-black text-sm">{selectedOrder.nama_pasien}</h3>
                  <p className="text-xs text-slate-300 font-mono">{selectedOrder.no_resep} • {selectedOrder.no_rm}</p>
                </div>
                <button
                  onClick={() => setShowEtiketModal(true)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Etiket</span>
                </button>
              </div>

              {/* TABS WORKFLOW */}
              <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-900">
                <button
                  onClick={() => setActiveModalTab('telaah')}
                  className={`py-2.5 text-center border-b-2 transition-all ${
                    activeModalTab === 'telaah'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  1. Telaah Resep
                </button>
                <button
                  onClick={() => setActiveModalTab('detail')}
                  className={`py-2.5 text-center border-b-2 transition-all ${
                    activeModalTab === 'detail'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  2. Dispensing
                </button>
                <button
                  onClick={() => setActiveModalTab('penyerahan')}
                  className={`py-2.5 text-center border-b-2 transition-all ${
                    activeModalTab === 'penyerahan'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  3. Penyerahan & PIO
                </button>
              </div>

              {/* TAB 1: TELAAH RESEP & AI SCREENING */}
              {activeModalTab === 'telaah' && (
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* AI CLINICAL SCREENING BANNER */}
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-extrabold text-xs">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                        <span>AI Clinical Pharmacist Assistant (Screening)</span>
                      </div>
                      <button
                        id="btn-run-ai-ddi-check"
                        onClick={() => handleRunAIDrugCheck(selectedOrder)}
                        disabled={isCheckingAiDDI}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        {isCheckingAiDDI ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Menganalisis...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-Audit AI Gemini</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-xs space-y-1 text-indigo-950 dark:text-indigo-200">
                      <p><strong>Diagnosis:</strong> {selectedOrder.diagnosis_primer} ({selectedOrder.kode_icd10})</p>
                      <p><strong>Riwayat Alergi:</strong> {selectedOrder.riwayat_alergi.join(', ') || 'Nihil'}</p>
                      {selectedOrder.ai_clinical_check.penyesuaian_dosis_gfr && (
                        <p><strong>Fungsi Ginjal & Rekomendasi:</strong> {selectedOrder.ai_clinical_check.penyesuaian_dosis_gfr}</p>
                      )}
                    </div>

                    {selectedOrder.ai_clinical_check.interaksi_terdeteksi.length > 0 ? (
                      <div className="mt-2 p-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg text-xs">
                        <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Peringatan Interaksi Obat (DDI):
                        </span>
                        {selectedOrder.ai_clinical_check.interaksi_terdeteksi.map((inter, i) => (
                          <div key={i} className="text-rose-900 dark:text-rose-200 text-[11px] mt-1 pl-2 border-l-2 border-rose-400">
                            <strong>{inter.obat_1} + {inter.obat_2} ({inter.level}):</strong>
                            <p>{inter.deskripsi}</p>
                            <p className="italic text-rose-700 dark:text-rose-400 font-semibold">Saran: {inter.rekomendasi}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Tidak ditemukan interaksi obat berbahaya antar item resep. Terapi aman diproses.</span>
                      </div>
                    )}
                  </div>

                  {/* 3-STEP TELAAH CHECKLIST (PMK 72/73) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Formulir Telaah Resep Farmasi (Standar Akreditasi KARS):
                    </h4>

                    {/* A. ADMINISTRATIF */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>A. Telaah Administratif</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Lengkap
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Keabsahan resep, identitas pasien ({selectedOrder.no_rm}), identitas dokter ({selectedOrder.dokter_penulis}), SIP, tanggal & poli asal.</p>
                    </div>

                    {/* B. FARMASETIK */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>B. Telaah Farmasetik</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Sesuai
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Bentuk sediaan, dosis & kekuatan obat, stabilitas/inkompatibilitas, aturan pakai & rute pemberian.</p>
                    </div>

                    {/* C. KLINIS */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>C. Telaah Klinis</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Tepat Indikasi
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Ketepatan indikasi & dosis, tidak ada duplikasi terapi, bebas alergi silang, kontraindikasi.</p>
                    </div>
                  </div>

                  {/* APPROVE BUTTON */}
                  {selectedOrder.status === 'Menunggu Telaah' && (
                    <button
                      onClick={() => handleApproveTelaah(selectedOrder)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Validasi & Loloskan Telaah Farmasi</span>
                    </button>
                  )}
                </div>
              )}

              {/* TAB 2: DISPENSING & RACIKAN */}
              {activeModalTab === 'detail' && (
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-500">Daftar Obat & Peracikan:</h4>
                    <span className="text-xs font-bold text-blue-600">Depo Rawat Jalan</span>
                  </div>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              {idx + 1}. {item.nama_obat}
                            </span>
                            {item.is_high_alert && (
                              <span className="ml-2 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase">
                                HIGH ALERT
                              </span>
                            )}
                            {item.is_lasa && (
                              <span className="ml-2 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase">
                                LASA
                              </span>
                            )}
                          </div>
                          <span className="font-black text-slate-800 dark:text-slate-200">
                            {item.jumlah} {item.satuan}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          <p>Signa: <strong className="text-blue-700 dark:text-blue-400">{item.signa}</strong></p>
                          <p>Rute: {item.rute_pemberian} • Harga: Rp {item.total_harga.toLocaleString('id-ID')}</p>
                        </div>

                        {/* DETAIL KOMPOSISI RACIKAN JIKA RACIKAN */}
                        {item.racikan_detail && (
                          <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <span className="font-bold text-purple-900 dark:text-purple-300 block text-[11px] mb-1">
                              Komposisi Bahan Racikan ({item.racikan_detail.jumlah_kemasan} {item.racikan_detail.satuan_kemasan}):
                            </span>
                            {item.racikan_detail.komposisi.map((b, bi) => (
                              <div key={bi} className="flex justify-between text-[10px] text-purple-950 dark:text-purple-200">
                                <span>• {b.nama_obat} (Dosis: {b.dosis_per_bungkus})</span>
                                <span className="font-mono font-bold">{b.jumlah_tablet_dibutuhkan} {b.satuan}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* SUMMARY TOTAL TAGIHAN */}
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Total Biaya Obat:</span>
                      <span>Rp {selectedOrder.total_biaya_obat.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Jasa Pelayanan & Embalase:</span>
                      <span>Rp {selectedOrder.jasa_embalase.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Total Tagihan:</span>
                      <span className="text-blue-600 dark:text-blue-400">Rp {selectedOrder.total_tagihan.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* ACTION DISPENSING */}
                  {selectedOrder.status === 'Dalam Penyiapan' && (
                    <button
                      onClick={() => handleFinishDispensing(selectedOrder)}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Selesaikan Dispensing & Potong Stok Depo Ralan</span>
                    </button>
                  )}
                </div>
              )}

              {/* TAB 3: PENYERAHAN & PIO */}
              {activeModalTab === 'penyerahan' && (
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Verifikasi 5 Benar (KARS) & Konseling Obat:
                    </h4>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-xs">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={limaBenar.benar_pasien}
                          onChange={e => setLimaBenar({ ...limaBenar, benar_pasien: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>1. Benar Pasien (Nama, No RM, Tanggal Lahir sesuai)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={limaBenar.benar_obat}
                          onChange={e => setLimaBenar({ ...limaBenar, benar_obat: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>2. Benar Obat (Nama obat fisik sesuai etiket & resep)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={limaBenar.benar_dosis}
                          onChange={e => setLimaBenar({ ...limaBenar, benar_dosis: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>3. Benar Dosis (Jumlah & takaran obat tepat)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={limaBenar.benar_waktu}
                          onChange={e => setLimaBenar({ ...limaBenar, benar_waktu: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>4. Benar Waktu (Pagi/Siang/Malam, Sebelum/Sesudah Makan)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={limaBenar.benar_rute}
                          onChange={e => setLimaBenar({ ...limaBenar, benar_rute: e.target.checked })}
                          className="rounded text-blue-600"
                        />
                        <span>5. Benar Rute (Oral, Topikal, Tetes, Inhalasi)</span>
                      </label>
                    </div>

                    {/* FORM IDENTITAS PENERIMA */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Nama Penerima Obat:
                        </label>
                        <input
                          type="text"
                          value={penerimaName}
                          onChange={e => setPenerimaName(e.target.value)}
                          placeholder={selectedOrder.nama_pasien}
                          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Hubungan dengan Pasien:
                        </label>
                        <select
                          value={hubunganPenerima}
                          onChange={e => setHubunganPenerima(e.target.value as any)}
                          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                        >
                          <option value="Pasien Sendiri">Pasien Sendiri</option>
                          <option value="Suami/Istri">Suami / Istri</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Anak">Anak</option>
                          <option value="Keluarga Lain">Keluarga Lain</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Catatan Konseling / PIO:
                        </label>
                        <textarea
                          rows={2}
                          value={catatanPio}
                          onChange={e => setCatatanPio(e.target.value)}
                          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none text-xs"
                        />
                      </div>
                    </div>

                    {selectedOrder.status === 'Menunggu Penyerahan' ? (
                      <button
                        onClick={() => handleCompletePenyerahan(selectedOrder)}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Serahkan Obat & Selesaikan Pelayanan (PIO)</span>
                      </button>
                    ) : selectedOrder.status === 'Selesai Terlayani' ? (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold text-center">
                        ✓ Resep telah diserahkan kepada {selectedOrder.penyerahan_pio?.nama_penerima || selectedOrder.nama_pasien} ({selectedOrder.penyerahan_pio?.waktu_penyerahan || 'Selesai'}).
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-300 rounded-xl text-xs text-center">
                        Resep masih dalam tahap {selectedOrder.status}. Selesaikan telaah & dispensing terlebih dahulu.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
              <Eye className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="font-bold">Pilih salah satu resep di sebelah kiri</p>
              <p className="text-xs text-slate-400">untuk membuka alur telaah, peracikan, etiket, dan penyerahan PIO.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL TAMBAH RESEP MANUAL / CITO DOKTER */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center shrink-0">
              <h3 className="font-black text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Resep Manual / Permintaan Cito Farmasi
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pasien *</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={e => setNewPatientName(e.target.value)}
                    placeholder="Contoh: Tn. Bambang"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Rekam Medis (RM)</label>
                  <input
                    type="text"
                    value={newNoRm}
                    onChange={e => setNewNoRm(e.target.value)}
                    placeholder="RM-2608XX-XXXX"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Penjamin</label>
                  <select
                    value={newPenjamin}
                    onChange={e => setNewPenjamin(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                    <option value="Umum / Pribadi">Umum / Pribadi</option>
                    <option value="Asuransi Swasta">Asuransi Swasta</option>
                  </select>
                </div>
              </div>

              {/* SWITCH MODE: NON-RACIKAN VS RACIKAN */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-slate-800 dark:text-slate-200">Input Item Peresepan:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRacikanMode(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        !isRacikanMode ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                      }`}
                    >
                      + Obat Jadi (Non-Racikan)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRacikanMode(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        isRacikanMode ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                      }`}
                    >
                      + Formula Racikan (Puyer/Kapsul)
                    </button>
                  </div>
                </div>

                {!isRacikanMode ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Pilih Obat dari Formularium:</label>
                      <select
                        value={selectedDrugId}
                        onChange={e => setSelectedDrugId(e.target.value)}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                      >
                        <option value="">-- Pilih Obat --</option>
                        {stocks.map(stk => (
                          <option key={stk.id} value={stk.id}>
                            {stk.nama_obat} (Stok Depo: {stk.lokasi_depo.depo_ralan} {stk.satuan_terkecil})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Jumlah:</label>
                      <input
                        type="number"
                        min={1}
                        value={selectedQty}
                        onChange={e => setSelectedQty(Number(e.target.value))}
                        className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddItemToManual}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Nama Racikan:</label>
                        <input
                          type="text"
                          value={racikanName}
                          onChange={e => setRacikanName(e.target.value)}
                          className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Bentuk Sediaan:</label>
                        <select
                          value={racikanForm}
                          onChange={e => setRacikanForm(e.target.value as any)}
                          className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900"
                        >
                          <option value="Pulveres (Puyer)">Pulveres (Puyer)</option>
                          <option value="Kapsul">Kapsul</option>
                          <option value="Salep Campuran">Salep Campuran</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1">Jumlah Kemasan:</label>
                        <input
                          type="number"
                          min={1}
                          value={racikanQty}
                          onChange={e => setRacikanQty(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    {/* BAHAN RACIKAN BUILDER */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-[11px] text-purple-900 dark:text-purple-300">Komposisi Bahan:</span>
                      {racikanBahanList.map((b, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 p-2 rounded border text-xs">
                          <span>{b.nama_obat}</span>
                          <span className="font-bold">{b.jumlah_tablet_dibutuhkan} {b.satuan} ({b.dosis_per_bungkus}/bungkus)</span>
                        </div>
                      ))}

                      <div className="flex gap-2 items-center pt-2">
                        <select
                          id="racikDrugSelect"
                          className="flex-1 p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                        >
                          <option value="">-- Pilih Obat Komposisi --</option>
                          {stocks.map(s => (
                            <option key={s.id} value={s.id}>{s.nama_obat}</option>
                          ))}
                        </select>
                        <input
                          id="racikDosisInput"
                          type="text"
                          placeholder="Dosis (e.g. 150mg)"
                          className="w-28 p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                        />
                        <input
                          id="racikTabCount"
                          type="number"
                          placeholder="Jml Tab"
                          className="w-20 p-2 border rounded-lg bg-white dark:bg-slate-900 text-xs"
                          defaultValue={2}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const sel = document.getElementById('racikDrugSelect') as HTMLSelectElement;
                            const dos = document.getElementById('racikDosisInput') as HTMLInputElement;
                            const tab = document.getElementById('racikTabCount') as HTMLInputElement;
                            if (sel.value) {
                              handleAddRacikanBahan(sel.value, dos.value || '1 Tab', Number(tab.value) || 1);
                              sel.value = '';
                              dos.value = '';
                            }
                          }}
                          className="px-3 py-2 bg-purple-600 text-white rounded-lg font-bold"
                        >
                          + Tambah Bahan
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFinalizeRacikan}
                      className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg"
                    >
                      ✓ Simpan Formula Racikan ke Daftar Resep
                    </button>
                  </div>
                )}

                {/* CURRENT ITEMS IN NEW PRESCRIPTION */}
                <div className="mt-3 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Daftar Item ({newItems.length}):</span>
                  {newItems.map((it, idx) => (
                    <div key={it.id} className="flex justify-between items-center p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">
                      <div>
                        <strong>{idx + 1}. {it.nama_obat}</strong>
                        <span className="text-slate-500 ml-2">({it.jumlah} {it.satuan})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Rp {it.total_harga.toLocaleString('id-ID')}</span>
                        <button
                          type="button"
                          onClick={() => setNewItems(newItems.filter(x => x.id !== it.id))}
                          className="text-rose-500 hover:text-rose-700 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveManualOrder}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-md"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Simpan & Masukkan ke Antrean</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ETIKET PRINT MODAL */}
      {showEtiketModal && selectedOrder && (
        <EtiketPrintModal
          order={selectedOrder}
          onClose={() => setShowEtiketModal(false)}
        />
      )}
    </div>
  );
}
