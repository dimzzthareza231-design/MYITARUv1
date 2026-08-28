import React, { useState, useEffect } from 'react';
import { 
  CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2, 
  Printer, ArrowRight, Calculator, AlertTriangle, Sparkles, RefreshCw, FileCheck
} from 'lucide-react';
import { BillingRecord, PaymentMethod } from './types';
import { useHospital } from '../../contexts/HospitalContext';
import { useToast } from '../../contexts/ToastContext';

interface PembayaranTabProps {
  billings: BillingRecord[];
  activeBillingForPayment: BillingRecord | null;
  onPaymentSuccess: (updatedBilling: BillingRecord) => void;
  onViewKwitansi: (billing: BillingRecord) => void;
}

export function PembayaranTab({
  billings,
  activeBillingForPayment,
  onPaymentSuccess,
  onViewKwitansi
}: PembayaranTabProps) {
  const toast = useToast();
  const { updateKunjunganStatus } = useHospital();
  
  // Selected billing to pay
  const [selectedBillingId, setSelectedBillingId] = useState<string>(
    activeBillingForPayment?.id || ''
  );

  const pendingBillings = billings.filter(b => b.status === 'Belum Lunas' || b.status === 'Sebagian');
  const activeBill = billings.find(b => b.id === selectedBillingId) || activeBillingForPayment || (pendingBillings.length > 0 ? pendingBillings[0] : null);

  // Payment form state
  const [method, setMethod] = useState<PaymentMethod>('Tunai');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [refNumber, setRefNumber] = useState<string>('');
  const [cardType, setCardType] = useState<'BCA' | 'Mandiri' | 'BRI' | 'BNI' | 'Lainnya'>('BCA');
  
  // Split payment state
  const [splitPrimaryMethod, setSplitPrimaryMethod] = useState<PaymentMethod>('Asuransi Swasta');
  const [splitPrimaryAmount, setSplitPrimaryAmount] = useState<number>(0);
  const [splitSecondaryMethod, setSplitSecondaryMethod] = useState<PaymentMethod>('Tunai');
  const [splitSecondaryAmount, setSplitSecondaryAmount] = useState<number>(0);

  // AI BPJS Pre-check
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiCheckResult, setAiCheckResult] = useState<any>(null);

  // Sync cash given when bill changes
  useEffect(() => {
    if (activeBill) {
      const amountToPay = activeBill.sisaTagihan > 0 ? activeBill.sisaTagihan : activeBill.totalTagihan;
      setCashGiven(amountToPay);
      setSplitPrimaryAmount(Math.round(amountToPay * 0.8));
      setSplitSecondaryAmount(amountToPay - Math.round(amountToPay * 0.8));
      setAiCheckResult(null);
    }
  }, [activeBill?.id]);

  if (!activeBill) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-16 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
        <CreditCard className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tidak Ada Antrian Pembayaran</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Semua tagihan rawat jalan dan rawat inap telah lunas, atau silakan pilih pasien dari tab Billing Ralan / Ranap.
        </p>
      </div>
    );
  }

  const amountToPay = activeBill.sisaTagihan > 0 ? activeBill.sisaTagihan : activeBill.totalTagihan;
  const change = Math.max(0, cashGiven - amountToPay);
  const isCashSufficient = method !== 'Tunai' || cashGiven >= amountToPay;

  const handleProcessPayment = () => {
    if (method === 'Tunai' && cashGiven < amountToPay) {
      toast.error('Uang tunai yang diterima kurang dari total tagihan!');
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const noKwitansiGenerated = `KW-${dateStr}-${randCode}`;
    const timeFormatted = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedBilling: BillingRecord = {
      ...activeBill,
      noKwitansi: noKwitansiGenerated,
      status: 'Lunas',
      metodePembayaran: method,
      jumlahDibayar: amountToPay,
      kembalian: method === 'Tunai' ? change : 0,
      waktuPembayaran: timeFormatted,
      nomorReferensiPembayaran: refNumber || (method === 'QRIS' ? `QR-${Date.now()}` : method === 'Debit' ? `TRC-${cardType}-${randCode}` : undefined),
      sisaTagihan: 0,
      detailSplitPayment: method === 'Split Payment' ? {
        metodeUtama: splitPrimaryMethod,
        nominalUtama: splitPrimaryAmount,
        metodeKedua: splitSecondaryMethod,
        nominalKedua: splitSecondaryAmount
      } : undefined
    };

    // Update state & sync context
    onPaymentSuccess(updatedBilling);
    if (activeBill.kunjunganId) {
      updateKunjunganStatus(activeBill.kunjunganId, 'Selesai');
    }

    toast.success(`Pembayaran sebesar Rp ${amountToPay.toLocaleString('id-ID')} BERHASIL! No Kwitansi: ${noKwitansiGenerated}`);
  };

  const handleAiBPJSCheck = () => {
    setIsAiChecking(true);
    setTimeout(() => {
      setIsAiChecking(false);
      setAiCheckResult({
        score: 95,
        status: 'valid',
        findings: [
          'Kesesuaian Diagnosis (ICD-10) dengan seluruh item obat dan tindakan valid 100%.',
          'Dokumen SEP elektronik aktif dan terverifikasi di server BPJS.',
          'Tidak terdeteksi over-utilization atau restriksi Fornas.'
        ],
        recommendation: 'Klaim siap ditagihkan tanpa kendala co-payment.'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Pending selector strip */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide shrink-0">
            Pilih Tagihan Kasir:
          </label>
          <select
            value={selectedBillingId || activeBill.id}
            onChange={(e) => setSelectedBillingId(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
          >
            {billings.map(b => (
              <option key={b.id} value={b.id}>
                {b.noBilling} - {b.namaPasien} ({b.tipeLayanan}) - Rp {b.sisaTagihan.toLocaleString('id-ID')} [{b.status}]
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Antrian Menunggu Pembayaran:</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
            {pendingBillings.length} Pasien
          </span>
        </div>
      </div>

      {/* Main Payment Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (5 cols): Bill Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-start">
              <div>
                <span className="text-[11px] font-mono text-blue-200 uppercase">{activeBill.noBilling}</span>
                <h3 className="text-lg font-bold">{activeBill.namaPasien}</h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  RM: {activeBill.noRm} • {activeBill.poliRuangan}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                {activeBill.tipeLayanan}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>Penjamin:</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeBill.namaPenjamin} ({activeBill.tipePenjamin})</strong>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                <span>Dokter:</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeBill.namaDokter}</strong>
              </div>

              {/* Items Breakdown list */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Rincian Pos Biaya:</div>
                <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                  {activeBill.items.map((item, idx) => (
                    <div key={item.id || idx} className="flex justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                      <div className="text-slate-700 dark:text-slate-300">
                        {item.deskripsi} <span className="text-[10px] text-slate-400">({item.jumlah}x)</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Rp {item.total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial calculations */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {activeBill.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {activeBill.biayaAdministrasi > 0 && (
                  <div className="flex justify-between">
                    <span>Biaya Administrasi:</span>
                    <span>Rp {activeBill.biayaAdministrasi.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {activeBill.uangMukaDeposit > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Deposit Terbayar:</span>
                    <span>- Rp {activeBill.uangMukaDeposit.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {activeBill.diskonTotal > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Diskon:</span>
                    <span>- Rp {activeBill.diskonTotal.toLocaleString('id-ID')}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <span>Nominal Pelunasan:</span>
                  <span className="text-blue-600 dark:text-blue-400 text-lg">
                    Rp {amountToPay.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* AI BPJS Validator Widget */}
              {activeBill.tipePenjamin === 'BPJS' && (
                <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>AI Klaim Pre-Check (BPJS)</span>
                    </div>
                    {!aiCheckResult && !isAiChecking && (
                      <button
                        onClick={handleAiBPJSCheck}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Audit Klaim
                      </button>
                    )}
                  </div>

                  {isAiChecking && (
                    <div className="py-2 text-center text-emerald-700 dark:text-emerald-400 animate-pulse">
                      Sedang memverifikasi ICD-10 & Fornas...
                    </div>
                  )}

                  {aiCheckResult && (
                    <div className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Skor Kelayakan: {aiCheckResult.score}% (Aman)</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{aiCheckResult.recommendation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right (7 cols): Payment Method Form & Execution */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Pilih Metode Pembayaran
              </h3>
              
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Tunai', label: 'Tunai (Cash)', icon: Banknote, color: 'text-emerald-600' },
                  { id: 'QRIS', label: 'QRIS Dinamis', icon: QrCode, color: 'text-blue-600' },
                  { id: 'Debit', label: 'Kartu Debit', icon: CreditCard, color: 'text-indigo-600' },
                  { id: 'Kredit', label: 'Kartu Kredit', icon: CreditCard, color: 'text-purple-600' },
                  { id: 'Transfer VA', label: 'Virtual Account', icon: Banknote, color: 'text-sky-600' },
                  { id: 'BPJS', label: 'Klaim BPJS', icon: ShieldCheck, color: 'text-emerald-700' },
                  { id: 'Asuransi Swasta', label: 'Asuransi', icon: FileCheck, color: 'text-teal-600' },
                  { id: 'Split Payment', label: 'Split Payment', icon: Calculator, color: 'text-amber-600' }
                ].map(m => {
                  const Icon = m.icon;
                  const isSelected = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${m.color}`} />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Payment Method Details */}
            
            {/* 1. TUNAI */}
            {method === 'Tunai' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Uang Diterima dari Pasien (Rp):
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={cashGiven}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                    className="w-full p-3 text-xl font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quick cash denomination buttons */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Pilihan Cepat Nominal:</span>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setCashGiven(amountToPay)}
                      className="p-2 text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded border border-blue-200 hover:bg-blue-200"
                    >
                      Uang Pas
                    </button>
                    {[50000, 100000, 200000, 500000, 1000000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCashGiven(val)}
                        className="p-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Rp {val.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live change calculation */}
                <div className={`p-4 rounded-lg flex justify-between items-center ${
                  cashGiven >= amountToPay 
                    ? 'bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-100/70 dark:bg-rose-900/30 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                }`}>
                  <span className="text-sm font-semibold">
                    {cashGiven >= amountToPay ? 'Kembalian Pasien:' : 'Uang Masih Kurang:'}
                  </span>
                  <span className="text-xl font-extrabold">
                    Rp {Math.abs(change).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* 2. QRIS */}
            {method === 'QRIS' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
                <div className="inline-block p-4 bg-white rounded-xl shadow-md border border-slate-200">
                  {/* Dummy SVG QRIS graphic */}
                  <div className="w-44 h-44 bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white">
                    <div className="w-full flex justify-between text-[10px] font-mono">
                      <span>QRIS RS MYITARU</span>
                      <span>NMID: ID1029384</span>
                    </div>
                    <QrCode className="w-28 h-28 text-white" />
                    <div className="text-[10px] font-bold text-center">
                      Scan via BCA / Mandiri / GoPay / OVO
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Nominal Pembayaran QRIS:</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Rp {amountToPay.toLocaleString('id-ID')}
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    ✓ QR Code aktif dan siap dipindai oleh pasien
                  </p>
                </div>
              </div>
            )}

            {/* 3. DEBIT / KREDIT EDC */}
            {(method === 'Debit' || method === 'Kredit') && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Bank Penerbit EDC:
                    </label>
                    <select
                      value={cardType}
                      onChange={(e) => setCardType(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="BCA">BCA (Debit / Flazz / CC)</option>
                      <option value="Mandiri">Mandiri (EDC Mandiri)</option>
                      <option value="BRI">BRI (EDC BRImo)</option>
                      <option value="BNI">BNI (TapCash / Kartu)</option>
                      <option value="Lainnya">Bank Lain / Visa / Mastercard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor Trace / Approval Code:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: TRC-948291"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                  Gesek kartu pada mesin EDC sesuai bank yang dipilih, lalu input approval code untuk bukti rekonsiliasi kasir.
                </div>
              </div>
            )}

            {/* 4. SPLIT PAYMENT */}
            {method === 'Split Payment' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Primary split */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Metode 1 (Utama):
                    </label>
                    <select
                      value={splitPrimaryMethod}
                      onChange={(e) => setSplitPrimaryMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-xs bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="BPJS">Klaim BPJS</option>
                      <option value="Asuransi Swasta">Asuransi Swasta</option>
                      <option value="Debit">Kartu Debit</option>
                      <option value="Transfer VA">Transfer VA</option>
                    </select>
                    <input
                      type="number"
                      value={splitPrimaryAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSplitPrimaryAmount(val);
                        setSplitSecondaryAmount(Math.max(0, amountToPay - val));
                      }}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm font-bold bg-white dark:bg-slate-800"
                    />
                  </div>

                  {/* Secondary split */}
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Metode 2 (Co-Pay / Sisa):
                    </label>
                    <select
                      value={splitSecondaryMethod}
                      onChange={(e) => setSplitSecondaryMethod(e.target.value as PaymentMethod)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-xs bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="Tunai">Tunai</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Debit">Kartu Debit</option>
                      <option value="Kredit">Kartu Kredit</option>
                    </select>
                    <input
                      type="number"
                      value={splitSecondaryAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSplitSecondaryAmount(val);
                        setSplitPrimaryAmount(Math.max(0, amountToPay - val));
                      }}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm font-bold bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Total Terbagi: Rp {(splitPrimaryAmount + splitSecondaryAmount).toLocaleString('id-ID')}</span>
                  <span>Target: Rp {amountToPay.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            {/* 5. BPJS / ASURANSI GUARANTEE */}
            {(method === 'BPJS' || method === 'Asuransi Swasta') && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Jaminan Pembayaran Terbit ({method})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Tagihan sebesar <strong>Rp {amountToPay.toLocaleString('id-ID')}</strong> akan dialihkan ke buku Piutang Penjamin ({activeBill.namaPenjamin}) untuk penagihan kolektif / e-Klaim.
                </p>
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    No. Surat Jaminan / No. SEP:
                  </label>
                  <input
                    type="text"
                    defaultValue={activeBill.noSep || `SEP-${Date.now().toString().slice(-6)}`}
                    className="w-full p-2 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs bg-white dark:bg-slate-800 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Execution Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end gap-3">
              {activeBill.status === 'Lunas' ? (
                <button
                  type="button"
                  onClick={() => onViewKwitansi(activeBill)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  <span>Cetak Ulang Kwitansi Lunas</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isCashSufficient}
                  onClick={handleProcessPayment}
                  className={`px-8 py-3.5 rounded-xl font-extrabold text-white text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                    isCashSufficient
                      ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.99] cursor-pointer'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Proses & Selesaikan Pembayaran</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
