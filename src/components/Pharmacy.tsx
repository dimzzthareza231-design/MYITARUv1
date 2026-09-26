import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { storage } from '../utils/storage';

// TYPES & MOCK DATA
import { 
  MedicationStock, 
  PrescriptionOrder, 
  PrescriptionItem,
  UDDSchedule, 
  DrugReconciliation, 
  DrugReturn, 
  PurchaseOrderDefecta, 
  SIPNAPReport,
  DefectaItem
} from './Pharmacy/types';

import { 
  INITIAL_MEDICATIONS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_UDD_SCHEDULES, 
  INITIAL_RECONCILIATIONS, 
  INITIAL_RETURNS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_SIPNAP, 
  INITIAL_HIGH_ALERT, 
  INITIAL_DEFECTA 
} from './Pharmacy/data';

// SUB-COMPONENTS
import { ApotekRalanTab } from './Pharmacy/ApotekRalanTab';
import { ApotekRanapTab } from './Pharmacy/ApotekRanapTab';
import { StokInventoriTab } from './Pharmacy/StokInventoriTab';
import { DefectaProcurementTab } from './Pharmacy/DefectaProcurementTab';
import { NarkotikaLasaTab } from './Pharmacy/NarkotikaLasaTab';
import { KatalogFornasKfaTab } from './Pharmacy/KatalogFornasKfaTab';

import { 
  Pill, 
  Building2, 
  Boxes, 
  ShoppingCart, 
  ShieldAlert, 
  BookOpen, 
  Activity, 
  CheckCircle,
  Truck,
  RotateCcw,
  MapPin
} from 'lucide-react';
import { GoogleMapsHealthLocator } from './Common/GoogleMapsHealthLocator';

export function Pharmacy() {
  const location = useLocation();
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const { kunjungan, updateKunjunganStatus } = useHospital();
  const toast = useToast();
  
  // URL Module detection: /modul/apotek-ralan, /modul/apotek-ranap, /modul/stok-obat
  const pathname = location.pathname;
  let initialTab: 'ralan' | 'ranap' | 'stok' | 'defecta' | 'narkotika' | 'fornas' | 'maps' = 'ralan';

  if (pathname.includes('apotek-ranap')) {
    initialTab = 'ranap';
  } else if (pathname.includes('stok-obat')) {
    initialTab = 'stok';
  }

  const [activeMainTab, setActiveMainTab] = useState<'ralan' | 'ranap' | 'stok' | 'defecta' | 'narkotika' | 'fornas' | 'maps'>(initialTab);

  // Sync tab if URL changes
  useEffect(() => {
    if (pathname.includes('apotek-ranap')) {
      setActiveMainTab('ranap');
    } else if (pathname.includes('stok-obat')) {
      setActiveMainTab('stok');
    } else if (pathname.includes('apotek-ralan')) {
      setActiveMainTab('ralan');
    }
  }, [pathname]);

  // Sync tab when submenu is clicked from ModuleLayout sidebar
  useEffect(() => {
    if (outletCtx?.activeTab) {
      const tab = outletCtx.activeTab.toLowerCase();
      if (tab.includes('ralan') || tab.includes('dispensing') || tab.includes('pio') || tab.includes('resep')) {
        setActiveMainTab('ralan');
      } else if (tab.includes('ranap') || tab.includes('udd') || tab.includes('rekonsiliasi') || tab.includes('retur')) {
        setActiveMainTab('ranap');
      } else if (tab.includes('defecta') || tab.includes('pesanan') || tab.includes('sp')) {
        setActiveMainTab('defecta');
      } else if (tab.includes('narkotika') || tab.includes('lasa')) {
        setActiveMainTab('narkotika');
      } else if (tab.includes('fornas') || tab.includes('kfa')) {
        setActiveMainTab('fornas');
      } else if (tab.includes('stok') || tab.includes('depo')) {
        setActiveMainTab('stok');
      } else if (tab.includes('peta') || tab.includes('maps')) {
        setActiveMainTab('maps');
      }
    }
  }, [outletCtx?.activeTab]);

  // PERSISTENT STORAGE WITH RESILIENT FALLBACK
  const [stocks, setStocks] = useState<MedicationStock[]>(() => {
    return storage.get<MedicationStock[]>('hospital_pharmacy_stocks', INITIAL_MEDICATIONS);
  });

  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(() => {
    return storage.get<PrescriptionOrder[]>('hospital_pharmacy_prescriptions', INITIAL_PRESCRIPTIONS);
  });

  const [uddSchedules, setUddSchedules] = useState<UDDSchedule[]>(() => {
    return storage.get<UDDSchedule[]>('hospital_pharmacy_udd', INITIAL_UDD_SCHEDULES);
  });

  const [reconciliations, setReconciliations] = useState<DrugReconciliation[]>(() => {
    return storage.get<DrugReconciliation[]>('hospital_pharmacy_reconciliations', INITIAL_RECONCILIATIONS);
  });

  const [returns, setReturns] = useState<DrugReturn[]>(() => {
    return storage.get<DrugReturn[]>('hospital_pharmacy_returns', INITIAL_RETURNS);
  });

  const [poList, setPoList] = useState<PurchaseOrderDefecta[]>(() => {
    return storage.get<PurchaseOrderDefecta[]>('hospital_pharmacy_po', INITIAL_PURCHASE_ORDERS);
  });

  const [sipnapList, setSipnapList] = useState<SIPNAPReport[]>(() => {
    return storage.get<SIPNAPReport[]>('hospital_pharmacy_sipnap', INITIAL_SIPNAP);
  });

  // SAVE VIA STORAGE WRAPPER
  useEffect(() => {
    storage.set('hospital_pharmacy_stocks', stocks);
  }, [stocks]);

  useEffect(() => {
    storage.set('hospital_pharmacy_prescriptions', prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    storage.set('hospital_pharmacy_udd', uddSchedules);
  }, [uddSchedules]);

  useEffect(() => {
    storage.set('hospital_pharmacy_reconciliations', reconciliations);
  }, [reconciliations]);

  useEffect(() => {
    storage.set('hospital_pharmacy_returns', returns);
  }, [returns]);

  useEffect(() => {
    storage.set('hospital_pharmacy_po', poList);
  }, [poList]);

  useEffect(() => {
    storage.set('hospital_pharmacy_sipnap', sipnapList);
  }, [sipnapList]);

  // SYNC WITH HOSPITAL CONTEXT KUNJUNGAN (Auto import prescriptions with status 'Farmasi')
  useEffect(() => {
    const farmasiKunjungan = kunjungan.filter(k => k.status === 'Farmasi');
    if (farmasiKunjungan.length === 0) return;

    setPrescriptions(prev => {
      const newItemsToAdd: PrescriptionOrder[] = [];
      farmasiKunjungan.forEach(k => {
        const patientName = (k as any).nama_pasien || '';
        const existing = prev.find(p => p.no_rm === k.pasien_id || (patientName && p.nama_pasien.toLowerCase() === patientName.toLowerCase()));
        if (!existing && patientName) {
          const newRXP: PrescriptionOrder = {
            id: `RXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            no_resep: `RXP-RALAN-${Math.floor(1000 + Math.random() * 9000)}`,
            tanggal_resep: k.tanggal || new Date().toISOString().split('T')[0],
            waktu_resep: 'Baru Saja',
            kunjungan_id: k.id || `KJ-${Date.now()}`,
            no_rm: k.pasien_id || 'RM-260800-001',
            nama_pasien: patientName || 'Pasien Ralan',
            umur: '42 Thn',
            jenis_kelamin: 'L',
            berat_badan_kg: 65,
            riwayat_alergi: [],
            dokter_penulis: (k as any).dokter || 'dr. Bambang Irawan, Sp.PD',
            sip_dokter: 'SIP.503/442/DU/2022',
            poli_ruangan: (k as any).poli || 'Poli Penyakit Dalam',
            jenis_layanan: 'Rawat Jalan',
            penjamin: (k as any).penjamin || 'BPJS Kesehatan',
            diagnosis_primer: (k as any).diagnosa || 'Pemeriksaan Rutin Poli',
            kode_icd10: 'Z00.0',
            tipe_resep: 'Non-Racikan',
            status: 'Menunggu Telaah',
            telaah_resep: {
              administratif: {
                keabsahan_resep: true,
                identitas_pasien: true,
                identitas_dokter: true,
                paraf_dokter: true,
                tanggal_resep: true,
                ruangan_poli: true
              },
              farmasetik: {
                bentuk_sediaan: true,
                dosis_kekuatan: true,
                stabilitas_inkompatibilitas: true,
                aturan_pakai_rute: true,
                jumlah_obat: true
              },
              klinis: {
                ketepatan_indikasi: true,
                duplikasi_terapi: false,
                alergi_reaksi_silang: false,
                interaksi_obat: false,
                kontraindikasi: false,
                penyesuaian_dosis_organ: false
              },
              status_telaah: 'Belum Ditelaah',
              apoteker_penelaah: '-',
              waktu_telaah: '-'
            },
            ai_clinical_check: {
              status_keamanan: 'Aman',
              interaksi_terdeteksi: [],
              peringatan_alergi: [],
              ringkasan_ai: 'Resep tunggal Paracetamol aman diberikan.'
            },
            dispensing: {
              jenis_etiket_dicetak: ['Putih (Oral)'],
              catatan_dispensing: 'Disiapkan dari Depo Ralan'
            },
            items: [
              {
                id: 'ITEM-PCT-001',
                kode_obat: 'MED-001',
                nama_obat: 'Paracetamol 500 mg Tablet',
                nama_generik: 'Paracetamol',
                bentuk_sediaan: 'Tablet',
                kekuatan: '500 mg',
                dosis: '500 mg',
                frekuensi: '3 x sehari 1 tablet',
                aturan_pakai: 'Sesudah Makan (Bila Nyeri/Demam)',
                rute_pemberian: 'Oral',
                signa: '3 x 1 Tab dc / pc',
                jumlah: 15,
                satuan: 'Tablet',
                harga_satuan: 1200,
                total_harga: 18000,
                tipe_item: 'Non-Racikan'
              }
            ],
            total_biaya_obat: 18000,
            jasa_embalase: 2000,
            total_tagihan: 20000
          };
          newItemsToAdd.push(newRXP);
        }
      });
      return newItemsToAdd.length > 0 ? [...newItemsToAdd, ...prev] : prev;
    });
  }, [kunjungan]);

  // STOCK DEDUCTION UPON DISPENSING
  const handleDispenseDeductStock = (items: PrescriptionItem[], depoKey: 'depo_ralan' | 'depo_ranap' | 'depo_igd' = 'depo_ralan') => {
    const updatedStocks = [...stocks];
    items.forEach(it => {
      const targetMed = updatedStocks.find(s => s.id === it.kode_obat || s.nama_obat === it.nama_obat);
      if (targetMed) {
        targetMed.stok_total = Math.max(0, targetMed.stok_total - it.jumlah);
        targetMed.lokasi_depo[depoKey] = Math.max(0, (targetMed.lokasi_depo[depoKey] || 0) - it.jumlah);
        if (targetMed.stok_total <= targetMed.stok_minimum) {
          targetMed.status = 'Stok Kritis';
        }
      }
    });
    setStocks(updatedStocks);
  };

  // RESTORE STOCK FROM RETURN
  const handleRestoreStockFromReturn = (ret: DrugReturn) => {
    const updatedStocks = [...stocks];
    ret.items.forEach(it => {
      const target = updatedStocks.find(s => s.id === it.kode_obat || s.nama_obat === it.nama_obat);
      if (target) {
        target.stok_total += it.jumlah_retur;
        target.lokasi_depo.depo_ranap += it.jumlah_retur;
        if (target.stok_total > target.stok_minimum) {
          target.status = 'Tersedia';
        }
      }
    });
    setStocks(updatedStocks);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto flex-1 w-full">
      {/* 1. TOP HEADER & MAIN MODULE NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              Sistem Informasi Farmasi &amp; Apotek Klinik
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 rounded-full text-[10px] font-extrabold uppercase">
                GPP / Permenkes 72
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Instalasi Farmasi Klinik ITARU Medika • E-Prescribing, Clinical Screening, UDD Ranap, Multi-Depo &amp; SIPNAP
            </p>
          </div>
        </div>

        {/* TOP TAB SWITCHER */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
          <button
            onClick={() => setActiveMainTab('ralan')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'ralan'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Apotek Ralan</span>
          </button>

          <button
            onClick={() => setActiveMainTab('ranap')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'ranap'
                ? 'bg-violet-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Apotek Ranap (UDD)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('stok')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'stok'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Stok Multi-Depo</span>
          </button>

          <button
            onClick={() => setActiveMainTab('defecta')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'defecta'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Defecta &amp; SP</span>
          </button>

          <button
            onClick={() => setActiveMainTab('narkotika')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'narkotika'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SIPNAP &amp; LASA</span>
          </button>

          <button
            onClick={() => setActiveMainTab('fornas')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'fornas'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fornas &amp; KFA</span>
          </button>

          <button
            onClick={() => setActiveMainTab('maps')}
            className={`px-3.5 py-2 rounded-lg text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all ${
              activeMainTab === 'maps'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-300" />
            <span>Peta Apotek &amp; PBF (Google Maps)</span>
          </button>
        </div>
      </div>

      {/* 2. RENDER ACTIVE TAB CONTENT */}
      {activeMainTab === 'maps' && (
        <GoogleMapsHealthLocator
          initialQuery="Apotek 24 Jam dan Distributor Pedagang Besar Farmasi (PBF)"
          defaultCategory="pharmacy"
          title="Peta Jaringan Apotek, Gudang Obat & Pedagang Besar Farmasi (PBF)"
          subtitle="Pencarian apotek rekanan terdekat, ketersediaan stok darurat, dan distributor resmi PBF dengan Google Maps"
        />
      )}
      {activeMainTab === 'ralan' && (
        <ApotekRalanTab
          prescriptions={prescriptions}
          stocks={stocks}
          onUpdatePrescription={(p) => {
            setPrescriptions(prev => prev.map(item => item.id === p.id ? p : item));
          }}
          onAddPrescription={(newP) => {
            setPrescriptions(prev => [newP, ...prev]);
          }}
          onDeductStock={handleDispenseDeductStock}
        />
      )}

      {activeMainTab === 'ranap' && (
        <ApotekRanapTab
          prescriptions={prescriptions}
          uddSchedules={uddSchedules}
          reconciliations={reconciliations}
          returns={returns}
          stocks={stocks}
          onUpdateUDD={(u) => {
            setUddSchedules(prev => prev.map(item => item.id === u.id ? u : item));
          }}
          onAddUDD={(u) => {
            setUddSchedules(prev => [u, ...prev]);
          }}
          onAddReconciliation={(r) => {
            setReconciliations(prev => [r, ...prev]);
          }}
          onAddReturn={(ret) => {
            setReturns(prev => [ret, ...prev]);
          }}
          onRestoreStockFromReturn={handleRestoreStockFromReturn}
        />
      )}

      {activeMainTab === 'stok' && (
        <StokInventoriTab
          stocks={stocks}
          onUpdateStocks={(stks) => setStocks(stks)}
          onAddStock={(newMed) => setStocks(prev => [newMed, ...prev])}
        />
      )}

      {activeMainTab === 'defecta' && (
        <DefectaProcurementTab
          stocks={stocks}
          poList={poList}
          defectaList={INITIAL_DEFECTA}
          onAddPO={(po) => setPoList(prev => [po, ...prev])}
          onUpdatePO={(po) => setPoList(prev => prev.map(item => item.id === po.id ? po : item))}
        />
      )}

      {activeMainTab === 'narkotika' && (
        <NarkotikaLasaTab
          sipnapList={sipnapList}
          highAlertList={INITIAL_HIGH_ALERT}
          onAddSipnap={(entry) => setSipnapList(prev => [entry, ...prev])}
        />
      )}

      {activeMainTab === 'fornas' && (
        <KatalogFornasKfaTab
          stocks={stocks}
        />
      )}
    </div>
  );
}

export default Pharmacy;
