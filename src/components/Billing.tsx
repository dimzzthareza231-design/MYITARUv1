import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  CreditCard, FileText, CheckCircle, AlertTriangle, ShieldCheck, 
  Download, Sparkles, Tag, Clock, Layers, DollarSign, Wallet, TrendingUp,
  UserCheck, Activity, RefreshCw
} from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../utils/storage';

import { BillingRecord, MasterTarifItem, ShiftKasirRecord, PaymentMethod } from './Finance/types';
import { INITIAL_BILLINGS, INITIAL_MASTER_TARIF, INITIAL_SHIFTS } from './Finance/mockFinanceData';

import { BillingRalanTab } from './Finance/BillingRalanTab';
import { BillingRanapTab } from './Finance/BillingRanapTab';
import { PembayaranTab } from './Finance/PembayaranTab';
import { KwitansiTab } from './Finance/KwitansiTab';
import { MasterTarifTab } from './Finance/MasterTarifTab';
import { RekapShiftKasirTab } from './Finance/RekapShiftKasirTab';

export function Billing() {
  const toast = useToast();
  const { kunjungan, pasien, penjamin, dokter } = useHospital();
  
  // Outlet context from ModuleLayout or query param
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<string>(
    queryTab || outletCtx?.activeTab || 'Billing Ralan'
  );

  // Synchronize when URL or outlet context changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else if (outletCtx?.activeTab) {
      setActiveTab(outletCtx.activeTab);
    }
  }, [searchParams, outletCtx?.activeTab]);

  // Persistent States using storage wrapper
  const [billings, setBillings] = useState<BillingRecord[]>(() => {
    return storage.getItem<BillingRecord[]>('hospital_finance_billings', INITIAL_BILLINGS);
  });

  const [tarifs, setTarifs] = useState<MasterTarifItem[]>(() => {
    return storage.getItem<MasterTarifItem[]>('hospital_finance_tarifs', INITIAL_MASTER_TARIF);
  });

  const [shifts, setShifts] = useState<ShiftKasirRecord[]>(() => {
    return storage.getItem<ShiftKasirRecord[]>('hospital_finance_shifts', INITIAL_SHIFTS);
  });

  // Target billing for direct payment or kwitansi
  const [activeBillingForPayment, setActiveBillingForPayment] = useState<BillingRecord | null>(null);
  const [activeKwitansiBilling, setActiveKwitansiBilling] = useState<BillingRecord | null>(null);

  // Sync back to storage on update
  useEffect(() => {
    storage.setItem('hospital_finance_billings', billings);
  }, [billings]);

  useEffect(() => {
    storage.setItem('hospital_finance_tarifs', tarifs);
  }, [tarifs]);

  useEffect(() => {
    storage.setItem('hospital_finance_shifts', shifts);
  }, [shifts]);

  // Sync new visits from HospitalContext into billings if not already present
  const handleSyncFromKunjungan = () => {
    let addedCount = 0;
    const existingKunjunganIds = new Set(billings.map(b => b.kunjunganId).filter(Boolean));

    const newBillingsFromKunjungan: BillingRecord[] = [];

    kunjungan.forEach(k => {
      if (existingKunjunganIds.has(k.id)) return;

      const p = pasien.find(px => String(px.id) === String(k.pasien_id));
      const pj = penjamin.find(pjx => pjx.id === k.penjamin_id);
      const doc = dokter.find(dx => dx.id === k.dokter_id);

      if (!p) return;

      const isRanap = k.tipe === 'Rawat Inap';
      const isBPJS = pj?.nama.toUpperCase().includes('BPJS') || pj?.tipe === 'BPJS';

      const autoItems = [
        {
          id: `ITM-REG-${Date.now()}-${Math.random()}`,
          kategori: 'Pendaftaran' as const,
          deskripsi: isRanap ? 'Administrasi Rawat Inap' : 'Pendaftaran Pasien Poli',
          jumlah: 1,
          hargaSatuan: isRanap ? 50000 : 25000,
          total: isRanap ? 50000 : 25000,
          penjaminCovered: isBPJS
        },
        {
          id: `ITM-DOC-${Date.now()}-${Math.random()}`,
          kategori: 'Konsultasi' as const,
          deskripsi: `Konsultasi & Pemeriksaan ${doc?.nama || 'Dokter Spesialis'}`,
          jumlah: 1,
          hargaSatuan: 100000,
          total: 100000,
          penjaminCovered: isBPJS
        }
      ];

      const subtotal = autoItems.reduce((acc, curr) => acc + curr.total, 0);

      newBillingsFromKunjungan.push({
        id: `BIL-AUTOSYNC-${Date.now()}-${k.id}`,
        noBilling: `BIL-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        kunjunganId: k.id,
        pasienId: String(p.id),
        namaPasien: p.nama,
        noRm: p.no_rm,
        tipeLayanan: isRanap ? 'Rawat Inap' : 'Rawat Jalan',
        poliRuangan: k.poli_id || (isRanap ? 'Bangsal Mawar Kelas 2' : 'Poli Umum'),
        namaDokter: doc?.nama || 'dr. Pratama Sp.PD',
        penjaminId: k.penjamin_id,
        namaPenjamin: pj?.nama || 'Umum Mandiri',
        tipePenjamin: isBPJS ? 'BPJS' : 'Umum',
        noSep: isBPJS ? `SEP-${Date.now().toString().slice(-8)}` : undefined,
        status: k.status === 'Selesai' ? 'Lunas' : 'Belum Lunas',
        tanggalMasuk: k.tanggal || new Date().toISOString().slice(0, 10),
        items: autoItems,
        subtotal: subtotal,
        diskonTotal: 0,
        pajak: 0,
        biayaAdministrasi: 10000,
        totalTagihan: subtotal + 10000,
        uangMukaDeposit: 0,
        sisaTagihan: k.status === 'Selesai' ? 0 : subtotal + 10000,
        jumlahDibayar: k.status === 'Selesai' ? subtotal + 10000 : 0,
        kembalian: 0,
        kasirNama: 'Siti Rahmawati, S.E.',
        jenisKelamin: p.jenis_kelamin || 'L',
        metodePembayaran: k.status === 'Selesai' ? (isBPJS ? 'BPJS' : 'Tunai') : ('Tunai' as PaymentMethod)
      });
      addedCount++;
    });

    if (addedCount > 0) {
      setBillings(prev => [...newBillingsFromKunjungan, ...prev]);
      toast.success(`Berhasil menarik ${addedCount} data tagihan baru dari antrian kunjungan`);
    } else {
      toast.info('Semua data kunjungan poli & ranap sudah terintegrasi ke billing');
    }
  };

  // Actions passed to children
  const handleSelectForPayment = (billing: BillingRecord) => {
    setActiveBillingForPayment(billing);
    setActiveTab('Pembayaran');
    setSearchParams({ tab: 'Pembayaran' });
  };

  const handleViewKwitansi = (billing: BillingRecord) => {
    setActiveKwitansiBilling(billing);
    setActiveTab('Kwitansi');
    setSearchParams({ tab: 'Kwitansi' });
  };

  const handleUpdateBilling = (updated: BillingRecord) => {
    setBillings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handlePaymentSuccess = (updatedBilling: BillingRecord) => {
    setBillings(prev => prev.map(b => b.id === updatedBilling.id ? updatedBilling : b));
    setActiveBillingForPayment(null);
    setActiveKwitansiBilling(updatedBilling);
  };

  // Financial KPI Metrics calculation
  const totalRevenue = billings.filter(b => b.status === 'Lunas').reduce((sum, b) => sum + (b.jumlahDibayar || b.totalTagihan), 0);
  const totalPiutang = billings.filter(b => b.status !== 'Lunas').reduce((sum, b) => sum + b.sisaTagihan, 0);
  const totalTunai = billings.filter(b => b.status === 'Lunas' && b.metodePembayaran === 'Tunai').reduce((sum, b) => sum + (b.jumlahDibayar || b.totalTagihan), 0);
  const totalNonTunai = totalRevenue - totalTunai;

  const tabOptions = [
    { id: 'Billing Ralan', label: 'Billing Rawat Jalan', icon: CreditCard },
    { id: 'Billing Ranap', label: 'Billing Rawat Inap', icon: Layers },
    { id: 'Pembayaran', label: 'Kasir Pembayaran', icon: Wallet },
    { id: 'Kwitansi', label: 'Kwitansi & Invoice', icon: FileText },
    { id: 'Master Tarif', label: 'Master Tarif RS', icon: Tag },
    { id: 'Rekap Shift Kasir', label: 'Rekap Shift Kasir', icon: Clock }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Financial Dashboard KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Penerimaan Lunas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{billings.filter(b => b.status === 'Lunas').length} Transaksi Terbayar</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Piutang Berjalan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
            Rp {totalPiutang.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {billings.filter(b => b.status !== 'Lunas').length} Pasien Belum Lunas
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kas Tunai (Drawer)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
            Rp {totalTunai.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Uang fisik di laci kasir
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Non-Tunai / Klaim</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
            Rp {totalNonTunai.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            EDC / QRIS / Asuransi / BPJS
          </div>
        </div>

      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {tabOptions.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab.toLowerCase().includes(t.id.toLowerCase()) || 
                             (t.id === 'Kwitansi' && activeTab.toLowerCase().includes('kwitansi')) ||
                             activeTab === t.label;

          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setSearchParams({ tab: t.id });
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Renderers */}
      <div className="min-h-[500px]">
        {/* Tab 1: Billing Ralan */}
        {(activeTab === 'Billing Ralan' || activeTab.toLowerCase().includes('ralan')) && (
          <BillingRalanTab
            billings={billings}
            onSelectForPayment={handleSelectForPayment}
            onViewKwitansi={handleViewKwitansi}
            onUpdateBilling={handleUpdateBilling}
            onRefreshFromKunjungan={handleSyncFromKunjungan}
          />
        )}

        {/* Tab 2: Billing Ranap */}
        {(activeTab === 'Billing Ranap' || activeTab.toLowerCase().includes('ranap')) && (
          <BillingRanapTab
            billings={billings}
            onSelectForPayment={handleSelectForPayment}
            onViewKwitansi={handleViewKwitansi}
            onUpdateBilling={handleUpdateBilling}
          />
        )}

        {/* Tab 3: Pembayaran */}
        {(activeTab === 'Pembayaran' || activeTab.toLowerCase().includes('bayar')) && (
          <PembayaranTab
            billings={billings}
            activeBillingForPayment={activeBillingForPayment}
            onPaymentSuccess={handlePaymentSuccess}
            onViewKwitansi={handleViewKwitansi}
          />
        )}

        {/* Tab 4: Kwitansi & Invoice */}
        {(activeTab === 'Kwitansi' || activeTab.toLowerCase().includes('kwitansi') || activeTab.toLowerCase().includes('invoice')) && (
          <KwitansiTab
            billings={billings}
            activeKwitansiBilling={activeKwitansiBilling}
          />
        )}

        {/* Tab 5: Master Tarif */}
        {(activeTab === 'Master Tarif' || activeTab.toLowerCase().includes('tarif')) && (
          <MasterTarifTab
            tarifs={tarifs}
            onSaveTarifs={setTarifs}
          />
        )}

        {/* Tab 6: Rekap Shift Kasir */}
        {(activeTab === 'Rekap Shift Kasir' || activeTab.toLowerCase().includes('shift')) && (
          <RekapShiftKasirTab
            shifts={shifts}
            billings={billings}
            onSaveShifts={setShifts}
          />
        )}
      </div>

    </div>
  );
}
export default Billing;
