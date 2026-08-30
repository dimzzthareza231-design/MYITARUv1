import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, 
  Activity, Clock, CalendarDays, Download, 
  PieChart, LineChart, DollarSign, CreditCard,
  Pill, ShieldCheck, FileSpreadsheet, Printer,
  Filter, Layers, ArrowUpRight, ArrowDownRight,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Line, LineChart as RechartsLineChart, PieChart as RechartsPieChart, 
  Pie, Cell, Legend 
} from 'recharts';

import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../utils/storage';
import { BillingRecord, JasaMedisDokterRecord } from './Finance/types';
import { INITIAL_BILLINGS, INITIAL_JASA_MEDIS } from './Finance/mockFinanceData';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../utils/documentGenerator';

export function AnalyticsDashboard() {
  const toast = useToast();
  const { pasien, kunjungan, dokter, penjamin } = useHospital();
  
  // Outlet context or search params
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<string>(
    queryTab || outletCtx?.activeTab || 'Laporan Keuangan'
  );

  const [period, setPeriod] = useState<'Hari Ini' | 'Minggu Ini' | 'Bulan Ini' | 'Tahun Ini'>('Bulan Ini');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else if (outletCtx?.activeTab) {
      setActiveTab(outletCtx.activeTab);
    }
  }, [searchParams, outletCtx?.activeTab]);

  // Load finance records
  const billings = storage.getItem<BillingRecord[]>('hospital_finance_billings', INITIAL_BILLINGS);
  const jasaMedisList = storage.getItem<JasaMedisDokterRecord[]>('hospital_finance_jasamedis', INITIAL_JASA_MEDIS);

  // Financial aggregates
  const totalRevenue = billings.filter((b: BillingRecord) => b.status === 'Lunas').reduce((sum: number, b: BillingRecord) => sum + (b.jumlahDibayar || b.totalTagihan), 0);
  const totalPiutang = billings.filter((b: BillingRecord) => b.status !== 'Lunas').reduce((sum: number, b: BillingRecord) => sum + b.sisaTagihan, 0);

  // Revenue by Unit Data
  const revenueByUnitData = [
    { name: 'Rawat Jalan', value: billings.filter((b: BillingRecord) => b.tipeLayanan === 'Rawat Jalan').reduce((sum: number, b: BillingRecord) => sum + b.totalTagihan, 0), color: '#3b82f6' },
    { name: 'Rawat Inap', value: billings.filter((b: BillingRecord) => b.tipeLayanan === 'Rawat Inap').reduce((sum: number, b: BillingRecord) => sum + b.totalTagihan, 0), color: '#6366f1' },
    { name: 'Farmasi Resep', value: 42500000, color: '#10b981' },
    { name: 'Laboratorium', value: 18400000, color: '#f59e0b' },
    { name: 'Radiologi', value: 12600000, color: '#8b5cf6' },
    { name: 'Kamar Bedah / OK', value: 34800000, color: '#ec4899' },
  ];

  // Daily Trend Data
  const dailyTrendData = [
    { tanggal: '01/08', pendapatan: 12500000, pasien: 42, klaimBPJS: 8200000 },
    { tanggal: '05/08', pendapatan: 18400000, pasien: 58, klaimBPJS: 11400000 },
    { tanggal: '10/08', pendapatan: 15200000, pasien: 49, klaimBPJS: 9800000 },
    { tanggal: '15/08', pendapatan: 24800000, pasien: 74, klaimBPJS: 16500000 },
    { tanggal: '20/08', pendapatan: 21300000, pasien: 65, klaimBPJS: 14200000 },
    { tanggal: '25/08', pendapatan: 28900000, pasien: 82, klaimBPJS: 19800000 },
    { tanggal: '30/08', pendapatan: 31200000, pasien: 89, klaimBPJS: 22400000 },
  ];

  // Payment Methods Share
  const paymentShareData = [
    { name: 'BPJS Kesehatan', value: 58, color: '#059669' },
    { name: 'Tunai (Cash)', value: 18, color: '#2563eb' },
    { name: 'Debit / EDC', value: 12, color: '#7c3aed' },
    { name: 'QRIS', value: 7, color: '#d97706' },
    { name: 'Asuransi Swasta', value: 5, color: '#0891b2' },
  ];

  // Top 10 ICD-10 Diseases
  const topDiseasesData = [
    { code: 'I10', name: 'Essential (primary) hypertension', count: 142, percentage: '24%' },
    { code: 'E11.9', name: 'Type 2 Diabetes Mellitus without complications', count: 118, percentage: '20%' },
    { code: 'J06.9', name: 'Acute upper respiratory infection', count: 96, percentage: '16%' },
    { code: 'A90', name: 'Dengue fever (classical dengue)', count: 68, percentage: '11%' },
    { code: 'K29.7', name: 'Gastritis, unspecified', count: 54, percentage: '9%' },
    { code: 'J18.9', name: 'Pneumonia, unspecified', count: 42, percentage: '7%' },
    { code: 'A09', name: 'Infectious gastroenteritis & colitis', count: 38, percentage: '6%' },
    { code: 'M54.5', name: 'Low back pain', count: 31, percentage: '5%' },
  ];

  // Hospital Performance Indicators
  const hospitalKPIs = [
    { label: 'BOR (Bed Occupancy Rate)', value: '74.8%', target: '70 - 85%', desc: 'Tingkat keterisian tempat tidur ranap', status: 'Ideal' },
    { label: 'ALOS (Average Length of Stay)', value: '3.6 Hari', target: '3 - 5 Hari', desc: 'Rata-rata lama rawat pasien', status: 'Ideal' },
    { label: 'TOI (Turn Over Interval)', value: '1.4 Hari', target: '1 - 3 Hari', desc: 'Waktu rata-rata TT kosong', status: 'Ideal' },
    { label: 'BTO (Bed Turn Over)', value: '46 Kali', target: '40 - 50 Kali', desc: 'Frekuensi penggunaan per tempat tidur', status: 'Ideal' },
    { label: 'NDR (Net Death Rate)', value: '1.2 ‰', target: '< 2.5 ‰', desc: 'Angka kematian > 48 jam perawatan', status: 'Sangat Baik' },
    { label: 'GDR (Gross Death Rate)', value: '2.8 ‰', target: '< 4.5 ‰', desc: 'Angka kematian umum', status: 'Baik' },
  ];

  // BPJS Klaim Aging Data
  const bpjsAgingData = [
    { range: '0 - 30 Hari (Lancar)', count: 214, nominal: 428000000, status: 'Normal' },
    { range: '31 - 60 Hari (Verifikasi)', count: 42, nominal: 96500000, status: 'Dalam Proses' },
    { range: '61 - 90 Hari (Pending Berkas)', count: 12, nominal: 28400000, status: 'Review Kelengkapan' },
    { range: '> 90 Hari (Dispute / Banding)', count: 4, nominal: 14200000, status: 'Banding INA-CBGs' },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ['No Billing', 'Pasien', 'No RM', 'Layanan', 'Penjamin', 'Total Tagihan', 'Status'],
      ...billings.map((b: BillingRecord) => [
        b.noBilling,
        b.namaPasien,
        b.noRm,
        b.tipeLayanan,
        b.namaPenjamin,
        b.totalTagihan,
        b.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Keuangan_RS_MYITARU_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Laporan CSV berhasil diunduh');
  };

  const handlePrintReport = () => {
    const doc = generateHospitalDocument({
      type: 'laporan-medis',
      title: `LAPORAN EKSEKUTIF Klinik: ${activeTab.toUpperCase()}`,
      documentNumber: `LAP-EKS/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      department: 'Direksi & Manajemen Klinik',
      notes: `Laporan analitik eksekutif periode ${period}. Data terintegrasi dari seluruh unit kerja SIMK.`,
      signatures: [
        { role: 'Manajer Keuangan & Akuntansi', name: 'Ahmad Fauzi, SE, Ak., CA' },
        { role: 'Direktur Utama Klinik', name: 'dr. H. Hendra Wijaya, Sp.B, MARS' }
      ],
      sections: [
        {
          title: 'Ringkasan Eksekutif & Indikator Utama',
          type: 'key-value',
          data: [
            { label: 'Kategori Laporan', value: activeTab },
            { label: 'Periode Analisis', value: period },
            { label: 'Total Pendapatan Terverifikasi', value: `Rp ${totalRevenue.toLocaleString('id-ID')}` },
            { label: 'Total Piutang Berjalan', value: `Rp ${totalPiutang.toLocaleString('id-ID')}` },
            { label: 'Total Pasien Terdaftar', value: `${pasien.length} Pasien` },
            { label: 'Total Kunjungan Pelayanan', value: `${kunjungan.length} Kunjungan` }
          ]
        },
        {
          title: 'Distribusi Pendapatan per Unit Layanan',
          type: 'table',
          tableData: {
            headers: ['No', 'Unit Layanan / Instalasi', 'Estimasi Pendapatan (Rp)', 'Kontribusi (%)'],
            rows: revenueByUnitData.map((u, i) => [
              String(i + 1),
              u.name,
              `Rp ${u.value.toLocaleString('id-ID')}`,
              `${((u.value / (totalRevenue || 1)) * 100).toFixed(1)}%`
            ])
          }
        }
      ]
    });

    setPreviewDocument(doc);
    setShowPreviewModal(true);
    toast.success('Membuka pratinjau dokumen laporan eksekutif...');
  };

  const navTabs = [
    { id: 'Laporan Keuangan', label: 'Laporan Keuangan & Pendapatan', icon: DollarSign },
    { id: 'Laporan Laba Rugi', label: 'Laba Rugi (P&L)', icon: Activity },
    { id: 'Laporan Pasien', label: 'Laporan Pasien & Pelayanan', icon: Users },
    { id: 'Laporan Obat', label: 'Laporan Farmasi & Obat', icon: Pill },
    { id: 'Laporan BPJS', label: 'Laporan BPJS & Piutang', icon: ShieldCheck }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            <span>Pusat Laporan & Analitik Manajemen Klinik</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sistem pelaporan eksekutif terintegrasi: Keuangan, Rekam Medis Pasien, Logistik Farmasi, dan Klaim BPJS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Hari Ini">Hari Ini</option>
              <option value="Minggu Ini">Minggu Ini</option>
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Tahun Ini">Tahun Ini</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {navTabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab.toLowerCase().includes(t.id.toLowerCase()) || 
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

      {/* TAB 1: LAPORAN KEUANGAN */}
      {(activeTab === 'Laporan Keuangan' || activeTab.toLowerCase().includes('keuangan')) && (
        <div className="space-y-6">
          
          {/* 4 Financial Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Omset Klinik (Gross)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                Rp {(totalRevenue + totalPiutang).toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                ↑ 14.8% vs Bulan Lalu
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Penerimaan Kas & Lunas</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
                Rp {totalRevenue.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Uang masuk rekening & kas
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Piutang BPJS & Asuransi</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
                Rp {totalPiutang.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                {bpjsAgingData.reduce((s, a) => s + a.count, 0)} Berkas Klaim
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Jasa Medis Dokter</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1.5">
                Rp {jasaMedisList.reduce((sum: number, j: JasaMedisDokterRecord) => sum + j.brutoJasaMedis, 0).toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {jasaMedisList.length} Dokter Spesialis
              </span>
            </div>
          </div>

          {/* Revenue Charts 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Trend Pendapatan Harian (8 cols) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Tren Pendapatan Harian vs Klaim BPJS
                  </h3>
                  <p className="text-xs text-slate-500">Perbandingan perolehan kas harian dan porsi jaminan BPJS</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  Periode {period}
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="tanggal" fontSize={12} stroke="#94a3b8" />
                    <YAxis 
                      fontSize={11} 
                      stroke="#94a3b8"
                      tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}jt`}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')}`, '']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="pendapatan" name="Total Pendapatan Klinik" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="klaimBPJS" name="Porsi Klaim BPJS" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Pangsa Metode Pembayaran (4 cols) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Pangsa Metode Pembayaran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Distribusi penerimaan kasir</p>
              </div>

              <div className="h-56 my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={paymentShareData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {paymentShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`, 'Pangsa']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                {paymentShareData.map(item => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <strong className="text-slate-800 dark:text-slate-200">{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Jasa Medis Dokter Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Rekapitulasi Remunerasi & Jasa Medis Dokter (JM DPJP)
                </h3>
                <p className="text-xs text-slate-500">Perhitungan pembagian jasa medis berdasarkan tindakan, visite, dan konsultasi poli</p>
              </div>
              <span className="text-xs text-slate-500 font-medium">Bulan Berjalan</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Nama Dokter & Spesialisasi</th>
                    <th className="p-3 text-center">Pasien Ralan</th>
                    <th className="p-3 text-center">Visite Ranap</th>
                    <th className="p-3 text-center">Tindakan / OK</th>
                    <th className="p-3 text-right">Jasa Medis Bruto</th>
                    <th className="p-3 text-right">PPh 21 (Pajak)</th>
                    <th className="p-3 text-right font-extrabold">JM Netto Diterima</th>
                    <th className="p-3 text-center">Status Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                  {jasaMedisList.map((jm: JasaMedisDokterRecord) => {
                    const pph = jm.potonganPPh21;
                    const netto = jm.nettoDiterima;
                    return (
                      <tr key={jm.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-white">{jm.namaDokter}</div>
                          <span className="text-[10px] text-slate-400">{jm.spesialisasi}</span>
                        </td>
                        <td className="p-3 text-center">{jm.totalPasien}</td>
                        <td className="p-3 text-center">{jm.totalVisiteRanap}</td>
                        <td className="p-3 text-center">{jm.totalTindakanOperatif}</td>
                        <td className="p-3 text-right font-medium">Rp {jm.brutoJasaMedis.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right text-rose-500">- Rp {pph.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                          Rp {netto.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            jm.statusPembayaran === 'Disetujui Direksi' || jm.statusPembayaran === 'Sudah Ditransfer'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>
                            {jm.statusPembayaran}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB: LAPORAN LABA RUGI (P&L) */}
      {(activeTab === 'Laporan Laba Rugi' || activeTab.toLowerCase().includes('laba rugi')) && (() => {
        // P&L Calculations
        const totalPendapatanRalan = billings.filter((b: BillingRecord) => b.tipeLayanan === 'Rawat Jalan').reduce((sum: number, b: BillingRecord) => sum + b.totalTagihan, 0);
        const totalPendapatanRanap = billings.filter((b: BillingRecord) => b.tipeLayanan === 'Rawat Inap').reduce((sum: number, b: BillingRecord) => sum + b.totalTagihan, 0);
        
        // Static mockups for non-billing segments for realistic view
        const totalPendapatanFarmasi = 42500000;
        const totalPendapatanLab = 18400000;
        const totalPendapatanRad = 12600000;
        const totalPendapatanOK = 34800000;
        
        const totalPendapatanKotor = totalPendapatanRalan + totalPendapatanRanap + totalPendapatanFarmasi + totalPendapatanLab + totalPendapatanRad + totalPendapatanOK;

        // Expenses
        const totalJasaMedis = jasaMedisList.reduce((sum: number, j: JasaMedisDokterRecord) => sum + j.brutoJasaMedis, 0);
        const totalBiayaObat = totalPendapatanFarmasi * 0.45; // HPP obat ~45%
        const totalBiayaBHP = (totalPendapatanLab + totalPendapatanRad + totalPendapatanOK) * 0.35; // HPP BHP ~35%
        
        const labaKotor = totalPendapatanKotor - (totalJasaMedis + totalBiayaObat + totalBiayaBHP);

        // Opex
        const biayaGajiKaryawan = 45000000;
        const biayaOperasional = 15000000;
        const biayaPemeliharaan = 8500000;

        const totalBebanOperasional = biayaGajiKaryawan + biayaOperasional + biayaPemeliharaan;

        const labaBersihSebelumPajak = labaKotor - totalBebanOperasional;
        const pajakPenghasilanRS = labaBersihSebelumPajak > 0 ? labaBersihSebelumPajak * 0.11 : 0; // PPN 11% or Pajak Badan
        const labaBersih = labaBersihSebelumPajak - pajakPenghasilanRS;

        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Laporan Laba/Rugi (Profit & Loss)
                  </h3>
                  <p className="text-sm text-slate-500">Periode: {period} - Real-time berdasarkan data transaksi</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500 uppercase font-bold">Laba Bersih Setelah Pajak</div>
                  <div className={`text-2xl font-black ${labaBersih >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    Rp {labaBersih.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 text-left font-bold">Keterangan</th>
                      <th className="p-3 text-right font-bold w-48">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {/* Pendapatan */}
                    <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                      <td className="p-3 font-bold text-blue-800 dark:text-blue-300" colSpan={2}>1. PENDAPATAN OPERASIONAL</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Pendapatan Poli Rawat Jalan</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">{totalPendapatanRalan.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Pendapatan Akomodasi Rawat Inap</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">{totalPendapatanRanap.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Pendapatan Farmasi & Obat-obatan</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">{totalPendapatanFarmasi.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Pendapatan Penunjang (Lab & Radiologi)</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">{(totalPendapatanLab + totalPendapatanRad).toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Pendapatan Tindakan & Kamar Bedah (OK)</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-slate-100">{totalPendapatanOK.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold border-y-2 border-slate-200 dark:border-slate-700">
                      <td className="p-3 text-slate-900 dark:text-white pl-4">TOTAL PENDAPATAN KOTOR</td>
                      <td className="p-3 text-right text-blue-600 dark:text-blue-400">{totalPendapatanKotor.toLocaleString('id-ID')}</td>
                    </tr>

                    {/* Harga Pokok & Beban Langsung */}
                    <tr className="bg-rose-50/50 dark:bg-rose-900/10">
                      <td className="p-3 font-bold text-rose-800 dark:text-rose-300" colSpan={2}>2. HARGA POKOK & BEBAN LANGSUNG (COGS)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Beban Jasa Medis & Insentif Dokter</td>
                      <td className="p-3 text-right font-medium text-rose-600 dark:text-rose-400">({totalJasaMedis.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">HPP Obat & Perbekalan Farmasi</td>
                      <td className="p-3 text-right font-medium text-rose-600 dark:text-rose-400">({totalBiayaObat.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Bahan Habis Pakai (BHP) Medis & Penunjang</td>
                      <td className="p-3 text-right font-medium text-rose-600 dark:text-rose-400">({totalBiayaBHP.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold border-y-2 border-slate-200 dark:border-slate-700">
                      <td className="p-3 text-slate-900 dark:text-white pl-4">LABA KOTOR (GROSS PROFIT)</td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{labaKotor.toLocaleString('id-ID')}</td>
                    </tr>

                    {/* Beban Operasional */}
                    <tr className="bg-amber-50/50 dark:bg-amber-900/10">
                      <td className="p-3 font-bold text-amber-800 dark:text-amber-300" colSpan={2}>3. BEBAN OPERASIONAL (OPEX)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Beban Gaji & Tunjangan Karyawan Non-Medis</td>
                      <td className="p-3 text-right font-medium text-amber-600 dark:text-amber-400">({biayaGajiKaryawan.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Beban Operasional Umum (Listrik, Air, Internet)</td>
                      <td className="p-3 text-right font-medium text-amber-600 dark:text-amber-400">({biayaOperasional.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 pl-8 text-slate-700 dark:text-slate-300">Beban Pemeliharaan Fasilitas & Alkes</td>
                      <td className="p-3 text-right font-medium text-amber-600 dark:text-amber-400">({biayaPemeliharaan.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 font-bold border-y-2 border-slate-200 dark:border-slate-700">
                      <td className="p-3 text-slate-900 dark:text-white pl-4">LABA OPERASIONAL (EBITDA)</td>
                      <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">{labaBersihSebelumPajak.toLocaleString('id-ID')}</td>
                    </tr>

                    {/* Pajak & Laba Bersih */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 border-t-4 border-slate-200 dark:border-slate-700">
                      <td className="p-3 pl-4 text-slate-900 dark:text-white font-bold">Taksiran Pajak Badan (11%)</td>
                      <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">({pajakPenghasilanRS.toLocaleString('id-ID')})</td>
                    </tr>
                    <tr className="bg-emerald-600 dark:bg-emerald-500 font-black text-white text-base">
                      <td className="p-4 rounded-bl-xl uppercase tracking-wider">LABA BERSIH (NET PROFIT)</td>
                      <td className="p-4 text-right rounded-br-xl">Rp {labaBersih.toLocaleString('id-ID')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {/* Komposisi Biaya */}
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Komposisi Biaya & HPP</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <RechartsPieChart>
                       <Pie
                         data={[
                           { name: 'Jasa Medis', value: totalJasaMedis, color: '#3b82f6' },
                           { name: 'HPP Obat', value: totalBiayaObat, color: '#10b981' },
                           { name: 'BHP Medis', value: totalBiayaBHP, color: '#f59e0b' },
                           { name: 'Gaji & Opex', value: totalBebanOperasional, color: '#ec4899' },
                         ]}
                         cx="50%" cy="50%"
                         innerRadius={60} outerRadius={80}
                         paddingAngle={5}
                         dataKey="value"
                       >
                         {
                           [
                             { name: 'Jasa Medis', value: totalJasaMedis, color: '#3b82f6' },
                             { name: 'HPP Obat', value: totalBiayaObat, color: '#10b981' },
                             { name: 'BHP Medis', value: totalBiayaBHP, color: '#f59e0b' },
                             { name: 'Gaji & Opex', value: totalBebanOperasional, color: '#ec4899' },
                           ].map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))
                         }
                       </Pie>
                       <Tooltip formatter={(val: any) => `Rp ${Number(val).toLocaleString('id-ID')}`} />
                       <Legend />
                     </RechartsPieChart>
                   </ResponsiveContainer>
                 </div>
               </div>
               
               {/* Rasio Profitabilitas */}
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                 <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                   Rasio Profitabilitas (Margin)
                 </h3>
                 <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gross Profit Margin (GPM)</span>
                       <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{((labaKotor / totalPendapatanKotor) * 100).toFixed(1)}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500">Laba Kotor / Pendapatan</span>
                       <span className="text-emerald-600 font-medium">Target {'>'} 40%</span>
                     </div>
                   </div>
                   
                   <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit Margin (NPM)</span>
                       <span className="text-xl font-black text-blue-600 dark:text-blue-400">{((labaBersih / totalPendapatanKotor) * 100).toFixed(1)}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500">Laba Bersih / Pendapatan</span>
                       <span className="text-blue-600 font-medium">Target {'>'} 15%</span>
                     </div>
                   </div>
                   
                   <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rasio Jasa Medis (Cost Ratio)</span>
                       <span className="text-xl font-black text-amber-600 dark:text-amber-400">{((totalJasaMedis / totalPendapatanKotor) * 100).toFixed(1)}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500">Jasa Medis / Pendapatan</span>
                       <span className="text-amber-600 font-medium">Target {'<'} 25%</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 2: LAPORAN PASIEN & PELAYANAN */}
      {(activeTab === 'Laporan Pasien' || activeTab.toLowerCase().includes('pasien')) && (
        <div className="space-y-6">
          
          {/* Hospital Performance Standard Indicators */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Indikator Kinerja Pelayanan Rawat Inap (Depkes RI / Kemenkes)
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitalKPIs.map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {kpi.status}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Standar Ideal: <strong>{kpi.target}</strong>
                  </div>
                  <p className="text-[10px] text-slate-400">{kpi.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 ICD-10 Diseases */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  10 Besar Penyakit Terbanyak (Top 10 Morbiditas ICD-10)
                </h3>
                <p className="text-xs text-slate-500">Berdasarkan data input SOAP dan resume medis rawat jalan & rawat inap</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3 w-28">Kode ICD-10</th>
                    <th className="p-3">Nama Diagnosis / Penyakit</th>
                    <th className="p-3 text-center">Jumlah Kasus</th>
                    <th className="p-3 text-center">Proporsi Kasus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                  {topDiseasesData.map((d, idx) => (
                    <tr key={d.code} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{d.code}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{d.name}</td>
                      <td className="p-3 text-center font-bold">{d.count} Pasien</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                          {d.percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: LAPORAN OBAT & FARMASI */}
      {(activeTab === 'Laporan Obat' || activeTab.toLowerCase().includes('obat')) && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Omset Farmasi Bulan Ini</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
                Rp 86.450.000
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Ralan + Ranap + Resep Bebas</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Nilai Stok Gudang</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                Rp 245.800.000
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">184 Item Obat Aktif</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Resep Terlayani</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1.5">
                1.428 Lembar
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Rata-rata 48 resep/hari</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase">Peringatan Stok Kritis</span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1.5">
                4 Item Obat
              </div>
              <span className="text-[11px] text-rose-500 font-medium mt-1 block">Di bawah Buffer Stock</span>
            </div>
          </div>

          {/* Fast Moving Drugs Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Obat Fast Moving (Paling Banyak Diresapkan)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Nama Obat & Sediaan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-center">Jumlah Keluar (Dispensed)</th>
                    <th className="p-3 text-right">Harga Jual</th>
                    <th className="p-3 text-right font-bold">Total Nilai Penjualan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                  {[
                    { nama: 'Paracetamol 500mg Tab', kat: 'Analgesik / Antipiretik', qty: '4.800 Tab', harga: 500, total: 2400000 },
                    { nama: 'Amoxicillin 500mg Kaplet', kat: 'Antibiotik', qty: '2.100 Kaplet', harga: 1200, total: 2520000 },
                    { nama: 'Metformin 500mg Tab', kat: 'Antidiabetes Oral', qty: '3.400 Tab', harga: 800, total: 2720000 },
                    { nama: 'Amlodipine 10mg Tab', kat: 'Antihipertensi', qty: '3.100 Tab', harga: 1500, total: 4650000 },
                    { nama: 'Omeprazole 20mg Kapsul', kat: 'Antasida & Antiulserasi', qty: '1.950 Kapsul', harga: 2000, total: 3900000 },
                  ].map((m) => (
                    <tr key={m.nama} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{m.nama}</td>
                      <td className="p-3 text-slate-500">{m.kat}</td>
                      <td className="p-3 text-center font-semibold">{m.qty}</td>
                      <td className="p-3 text-right text-slate-500">Rp {m.harga.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        Rp {m.total.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: LAPORAN BPJS & PIUTANG */}
      {(activeTab === 'Laporan BPJS' || activeTab.toLowerCase().includes('bpjs')) && (
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Analisis Umur Piutang Klaim BPJS (Aging Accounts Receivable)
            </h3>
            <p className="text-xs text-slate-500">Monitoring kecepatan pembayaran dan pengajuan klaim INA-CBGs BPJS Kesehatan</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bpjsAgingData.map((age) => (
                <div key={age.range} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{age.range}</span>
                  <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    Rp {age.nominal.toLocaleString('id-ID')}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{age.count} Berkas SEP</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{age.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {showPreviewModal && previewDocument && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDocument}
        />
      )}
    </div>
  );
}
export default AnalyticsDashboard;
