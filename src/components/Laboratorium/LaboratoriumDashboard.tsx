import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LabOrder } from './types';
import { INITIAL_LAB_ORDERS_MOCK } from './data';
import { WorklistTab } from './WorklistTab';
import { InputHasilTab } from './InputHasilTab';
import { ValidasiSpPKTab } from './ValidasiSpPKTab';
import { KatalogLabTab } from './KatalogLabTab';
import { QualityControlTab } from './QualityControlTab';
import { BankDarahTab } from './BankDarahTab';
import { CetakHasilModal } from './CetakHasilModal';
import { 
  TestTube, Cpu, ShieldCheck, BookOpen, 
  Activity, Droplet, Sparkles, RefreshCw
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function LaboratoriumDashboard() {
  const toast = useToast();
  
  // Tab sync with ModuleLayout router outlet
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [currentTab, setCurrentTab] = useState<string>('Worklist & Permintaan');

  // Persistence for Lab Orders
  const [orders, setOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem('simrs_lab_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_LAB_ORDERS_MOCK;
  });

  useEffect(() => {

  }, [orders]);
  // Active selected order for cross-tab workflows
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Print modal state
  const [orderForPrint, setOrderForPrint] = useState<LabOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sync with outletCtx if changes from Sidebar submenu
  useEffect(() => {
    if (outletCtx?.activeTab) {
      const tabMap: Record<string, string> = {
        'Permintaan Lab': 'Worklist & Permintaan',
        'Worklist & Permintaan': 'Worklist & Permintaan',
        'Hasil Lab': 'Input Hasil (LIS)',
        'Input Hasil (LIS)': 'Input Hasil (LIS)',
        'Validasi Hasil': 'Validasi Sp.PK',
        'Validasi Sp.PK': 'Validasi Sp.PK',
        'Katalog & Tarif LOINC': 'Katalog & Tarif LOINC',
        'Quality Control (QC)': 'Quality Control (QC)',
        'Bank Darah (BDRS)': 'Bank Darah (BDRS)'
      };
      if (tabMap[outletCtx.activeTab]) {
        setCurrentTab(tabMap[outletCtx.activeTab]);
      }
    }
  }, [outletCtx?.activeTab]);

  // Tab change handlers with context passing
  const handleSelectOrderForInput = (order: LabOrder) => {
    setSelectedOrderId(order.id);
    setCurrentTab('Input Hasil (LIS)');
    toast.info(`Beralih ke form input hasil LIS untuk order ${order.id}`);
  };

  const handleSelectOrderForValidation = (order: LabOrder) => {
    setSelectedOrderId(order.id);
    setCurrentTab('Validasi Sp.PK');
    toast.info(`Beralih ke telaah validasi Sp.PK untuk order ${order.id}`);
  };

  const handleOpenPrint = (order: LabOrder) => {
    setOrderForPrint(order);
    setIsPrintModalOpen(true);
  };

  // Badge counts
  const pendingWorklistCount = orders.filter(o => o.status !== 'Selesai & Tervalidasi').length;
  const needValidationCount = orders.filter(o => o.status === 'Menunggu Validasi').length;

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col gap-6">
      {/* TOP TITLE & MODULE BANNER */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
            <TestTube className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Laboratorium Sentral & Bank Darah (LIS)
              </h1>
              <span className="px-2 py-0.5 bg-cyan-400/30 border border-cyan-200/40 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                ISO 15189 KARS
              </span>
            </div>
            <p className="text-xs text-cyan-100 mt-0.5 font-medium">
              Sistem Informasi Laboratorium Terintegrasi: Order Worklist, LIS Analyzer HL7/ASTM, Delta Check, Validasi Sp.PK, & BDRS.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setOrders(INITIAL_LAB_ORDERS_MOCK);

              toast.success('Data contoh laboratorium & bank darah berhasil direset!');
            }}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Data Demo
          </button>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION BAR */}
      <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('Worklist & Permintaan')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Worklist & Permintaan'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <TestTube className="w-4 h-4" />
          <span>Worklist & Permintaan</span>
          {pendingWorklistCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              currentTab === 'Worklist & Permintaan' ? 'bg-white text-cyan-700' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
            }`}>
              {pendingWorklistCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('Input Hasil (LIS)')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Input Hasil (LIS)'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Input Hasil (LIS)</span>
        </button>

        <button
          onClick={() => setCurrentTab('Validasi Sp.PK')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Validasi Sp.PK'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Validasi Sp.PK</span>
          {needValidationCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              currentTab === 'Validasi Sp.PK' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
            }`}>
              {needValidationCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('Katalog & Tarif LOINC')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Katalog & Tarif LOINC'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog & Tarif LOINC</span>
        </button>

        <button
          onClick={() => setCurrentTab('Quality Control (QC)')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Quality Control (QC)'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Quality Control (QC)</span>
        </button>

        <button
          onClick={() => setCurrentTab('Bank Darah (BDRS)')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all ${
            currentTab === 'Bank Darah (BDRS)'
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Bank Darah (BDRS)</span>
        </button>
      </div>

      {/* ACTIVE TAB CONTENT */}
      <div className="flex-1">
        {currentTab === 'Worklist & Permintaan' && (
          <WorklistTab
            orders={orders}
            onUpdateOrders={setOrders}
            onSelectOrderForInput={handleSelectOrderForInput}
            onSelectOrderForValidation={handleSelectOrderForValidation}
            onViewResult={handleOpenPrint}
          />
        )}

        {currentTab === 'Input Hasil (LIS)' && (
          <InputHasilTab
            orders={orders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onUpdateOrders={setOrders}
            onSwitchToValidation={handleSelectOrderForValidation}
          />
        )}

        {currentTab === 'Validasi Sp.PK' && (
          <ValidasiSpPKTab
            orders={orders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onUpdateOrders={setOrders}
            onOpenPrintModal={handleOpenPrint}
          />
        )}

        {currentTab === 'Katalog & Tarif LOINC' && (
          <KatalogLabTab />
        )}

        {currentTab === 'Quality Control (QC)' && (
          <QualityControlTab />
        )}

        {currentTab === 'Bank Darah (BDRS)' && (
          <BankDarahTab />
        )}
      </div>

      {/* OFFICIAL PRINT RESULT MODAL */}
      <CetakHasilModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={orderForPrint}
      />
    </div>
  );


}
