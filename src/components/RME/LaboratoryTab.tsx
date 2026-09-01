import React, { useState } from 'react';
import { FlaskConical, Plus, CheckCircle2, AlertTriangle, Printer, Search, FileText, Check, Clock, Filter, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../PrintPDFButton';

export interface LabTestItem {
  id: string;
  name: string;
  loinc: string;
  category: string;
  result: string;
  unit: string;
  refRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
  flagText?: string;
}

export interface LabOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  doctor: string;
  diagnosaKlinis: string;
  status: 'Selesai' | 'Dalam Proses' | 'Pending Verifikasi';
  verifiedBy?: string;
  verifiedAt?: string;
  items: LabTestItem[];
}

export function LaboratoryTab({ patientData }: { patientData: any }) {
  const [selectedOrder, setSelectedOrder] = useState<string>('LAB-2026-0801');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const [orders, setOrders] = useState<LabOrder[]>([
    {
      id: 'LAB-2026-0801',
      orderNumber: 'ORD-LAB-88210',
      orderDate: '30 Aug 2026 08:30',
      doctor: 'dr. Budi Santoso, Sp.PD',
      diagnosaKlinis: 'Hipertensi Primer, Suspek Diabetes Melitus Tipe 2',
      status: 'Pending Verifikasi',
      items: [
        { id: '1', name: 'Hemoglobin (Hb)', loinc: '718-7', category: 'Hematologi', result: '14.2', unit: 'g/dL', refRange: '13.5 - 17.5', status: 'Normal' },
        { id: '2', name: 'Leukosit', loinc: '6690-2', category: 'Hematologi', result: '7,800', unit: '/µL', refRange: '4,000 - 10,000', status: 'Normal' },
        { id: '3', name: 'Trombosit', loinc: '777-3', category: 'Hematologi', result: '265,000', unit: '/µL', refRange: '150,000 - 450,000', status: 'Normal' },
        { id: '4', name: 'Hematokrit (Ht)', loinc: '4544-3', category: 'Hematologi', result: '42.5', unit: '%', refRange: '40.0 - 52.0', status: 'Normal' },
        { id: '5', name: 'Glukosa Darah Puasa (GDP)', loinc: '2345-7', category: 'Kimia Darah', result: '145', unit: 'mg/dL', refRange: '70 - 100', status: 'High', flagText: 'Hiperglikemia' },
        { id: '6', name: 'HbA1c', loinc: '4548-4', category: 'Kimia Darah', result: '7.4', unit: '%', refRange: '< 5.7', status: 'High', flagText: 'Diabetes Terkontrol Buruk' },
        { id: '7', name: 'Kolesterol Total', loinc: '2093-3', category: 'Profil Lipid', result: '240', unit: 'mg/dL', refRange: '< 200', status: 'High', flagText: 'Hiperkolesterolemia' },
        { id: '8', name: 'Trigliserida', loinc: '2571-8', category: 'Profil Lipid', result: '180', unit: 'mg/dL', refRange: '< 150', status: 'High' },
        { id: '9', name: 'Kolesterol HDL', loinc: '2085-9', category: 'Profil Lipid', result: '42', unit: 'mg/dL', refRange: '> 40', status: 'Normal' },
        { id: '10', name: 'Kolesterol LDL (Direk)', loinc: '13457-7', category: 'Profil Lipid', result: '162', unit: 'mg/dL', refRange: '< 100', status: 'High' },
        { id: '11', name: 'Ureum', loinc: '3094-0', category: 'Fungsi Ginjal', result: '28', unit: 'mg/dL', refRange: '15 - 45', status: 'Normal' },
        { id: '12', name: 'Kreatinin Serum', loinc: '2160-0', category: 'Fungsi Ginjal', result: '1.05', unit: 'mg/dL', refRange: '0.7 - 1.3', status: 'Normal' },
        { id: '13', name: 'Asam Urat', loinc: '3084-1', category: 'Kimia Darah', result: '7.8', unit: 'mg/dL', refRange: '3.5 - 7.2', status: 'High' },
        { id: '14', name: 'SGOT (AST)', loinc: '1920-8', category: 'Fungsi Hati', result: '24', unit: 'U/L', refRange: '< 35', status: 'Normal' },
        { id: '15', name: 'SGPT (ALT)', loinc: '1742-6', category: 'Fungsi Hati', result: '28', unit: 'U/L', refRange: '< 45', status: 'Normal' },
      ]
    },
    {
      id: 'LAB-2026-0715',
      orderNumber: 'ORD-LAB-81042',
      orderDate: '15 Jul 2026 10:15',
      doctor: 'dr. Budi Santoso, Sp.PD',
      diagnosaKlinis: 'Kontrol Rutin Hipertensi',
      status: 'Selesai',
      verifiedBy: 'dr. Ratna Sp.PK',
      verifiedAt: '15 Jul 2026 12:45',
      items: [
        { id: '1', name: 'Glukosa Darah Sewaktu (GDS)', loinc: '2339-0', category: 'Kimia Darah', result: '138', unit: 'mg/dL', refRange: '< 140', status: 'Normal' },
        { id: '2', name: 'Kreatinin Serum', loinc: '2160-0', category: 'Fungsi Ginjal', result: '1.02', unit: 'mg/dL', refRange: '0.7 - 1.3', status: 'Normal' },
        { id: '3', name: 'Kalium Serum', loinc: '2823-3', category: 'Elektrolit', result: '4.2', unit: 'mEq/L', refRange: '3.5 - 5.0', status: 'Normal' },
        { id: '4', name: 'Natrium Serum', loinc: '2951-2', category: 'Elektrolit', result: '139', unit: 'mEq/L', refRange: '135 - 145', status: 'Normal' },
      ]
    }
  ]);

  // Modal order state
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [orderClinicalNotes, setOrderClinicalNotes] = useState('');

  const activeOrder = orders.find(o => o.id === selectedOrder) || orders[0];

  const handleVerifyOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Selesai',
          verifiedBy: 'dr. Budi Santoso (DPJP)',
          verifiedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
      }
      return o;
    }));
    toast.success('Hasil laboratorium berhasil diverifikasi dan ditandatangani secara digital');
  };

  const handleCreateNewOrder = () => {
    if (selectedTests.length === 0) {
      toast.error('Pilih minimal 1 pemeriksaan laboratorium');
      return;
    }

    const testMap: Record<string, { name: string; loinc: string; category: string; unit: string; refRange: string }> = {
      'Darah Rutin': { name: 'Paket Darah Lengkap (CBC)', loinc: '57021-8', category: 'Hematologi', unit: 'Panel', refRange: 'Normal' },
      'GDP': { name: 'Glukosa Darah Puasa (GDP)', loinc: '2345-7', category: 'Kimia Darah', unit: 'mg/dL', refRange: '70 - 100' },
      'HbA1c': { name: 'Hemoglobin A1c (HbA1c)', loinc: '4548-4', category: 'Kimia Darah', unit: '%', refRange: '< 5.7' },
      'Profil Lipid': { name: 'Profil Lipid Lengkap (Kol/TG/HDL/LDL)', loinc: '57698-3', category: 'Profil Lipid', unit: 'Panel', refRange: 'Normal' },
      'Fungsi Ginjal': { name: 'Ureum & Kreatinin Serum', loinc: '24362-6', category: 'Fungsi Ginjal', unit: 'Panel', refRange: 'Normal' },
      'Fungsi Hati': { name: 'SGOT & SGPT (Transaminase)', loinc: '24325-3', category: 'Fungsi Hati', unit: 'Panel', refRange: 'Normal' },
      'Urinalisis': { name: 'Urinalisis Lengkap Otomatis', loinc: '24356-8', category: 'Urinalisis', unit: 'Panel', refRange: 'Normal' },
      'Elektrolit': { name: 'Elektrolit Serum (Na, K, Cl)', loinc: '24326-1', category: 'Elektrolit', unit: 'Panel', refRange: 'Normal' },
    };

    const newItems: LabTestItem[] = selectedTests.map((key, idx) => {
      const def = testMap[key] || { name: key, loinc: '0000-0', category: 'Lainnya', unit: '-', refRange: '-' };
      return {
        id: `${Date.now()}-${idx}`,
        name: def.name,
        loinc: def.loinc,
        category: def.category,
        result: 'Menunggu Sampel',
        unit: def.unit,
        refRange: def.refRange,
        status: 'Normal'
      };
    });

    const newOrder: LabOrder = {
      id: `LAB-${Date.now()}`,
      orderNumber: `ORD-LAB-${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      doctor: 'dr. Budi Santoso (DPJP)',
      diagnosaKlinis: orderClinicalNotes || 'Pemeriksaan Rutin Penunjang',
      status: 'Dalam Proses',
      items: newItems
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrder(newOrder.id);
    setShowOrderModal(false);
    setSelectedTests([]);
    setOrderClinicalNotes('');
    toast.success('Order laboratorium berhasil dikirim ke LIS (Laboratory Information System)');
  };

  const categories = ['Semua', ...Array.from(new Set(activeOrder?.items.map(i => i.category) || []))];

  const filteredItems = activeOrder?.items.filter(item => {
    const matchCategory = filterCategory === 'Semua' || item.category === filterCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.loinc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER SECTION */}
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <FlaskConical className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Rekam Hasil Laboratorium (LIS Integrated)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Data pemeriksaan patologi klinik berstandar kodefikasi LOINC dengan peringatan nilai kritis otomatis.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Order Lab Baru
            </button>
          </div>
        </div>

        {/* ORDER SELECTOR PILLS */}
        <div className="flex items-center gap-3 overflow-x-auto pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 custom-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Riwayat Order:</span>
          {orders.map(order => {
            const isSelected = order.id === selectedOrder;
            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrder(order.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{order.orderNumber}</span>
                <span className="text-[10px] opacity-70 font-normal">({order.orderDate.split(' ')[0]} {order.orderDate.split(' ')[1]})</span>
                <span className={`w-2 h-2 rounded-full ${
                  order.status === 'Selesai' ? 'bg-emerald-500' :
                  order.status === 'Pending Verifikasi' ? 'bg-amber-500 animate-ping' : 'bg-blue-500'
                }`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE ORDER DETAIL CARD */}
      {activeOrder && (
        <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* ORDER INFO BAR */}
          <div className="p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  No. Order: {activeOrder.orderNumber}
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  activeOrder.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' :
                  activeOrder.status === 'Pending Verifikasi' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' :
                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300'
                }`}>
                  {activeOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pengirim: <strong>{activeOrder.doctor}</strong> • Waktu: {activeOrder.orderDate} • Indikasi: <em>{activeOrder.diagnosaKlinis}</em>
              </p>
              {activeOrder.verifiedBy && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Diverifikasi oleh {activeOrder.verifiedBy} ({activeOrder.verifiedAt})
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {activeOrder.status === 'Pending Verifikasi' && (
                <button
                  onClick={() => handleVerifyOrder(activeOrder.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Verifikasi & Sign (DPJP)
                </button>
              )}
              
              <PrintPDFButton
                filename={`Lab_${patientData?.nama || 'Pasien'}_${activeOrder.orderNumber}`}
                label="Cetak Hasil Lab"
                className="text-xs bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-300 dark:border-slate-700 !text-slate-700 dark:!text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 py-2"
                documentData={{ ...patientData, labOrder: activeOrder }}
                docType="resume_medis"
                title="HASIL PEMERIKSAAN LABORATORIUM KLINIK"
              />
            </div>
          </div>

          {/* FILTER & SEARCH */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari parameter / LOINC..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* LAB ITEMS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Pemeriksaan</th>
                  <th className="p-4">Kode LOINC</th>
                  <th className="p-4">Hasil</th>
                  <th className="p-4">Satuan</th>
                  <th className="p-4">Nilai Rujukan</th>
                  <th className="p-4 text-center">Status Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Tidak ada parameter pemeriksaan yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isAbnormal = item.status === 'High' || item.status === 'Low' || item.status === 'Critical';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[11px] font-normal text-slate-400">{item.category}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {item.loinc}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-extrabold text-base ${
                            item.status === 'Critical' ? 'text-rose-600 dark:text-rose-400 animate-pulse' :
                            item.status === 'High' ? 'text-rose-600 dark:text-rose-400' :
                            item.status === 'Low' ? 'text-amber-600 dark:text-amber-400' :
                            'text-slate-800 dark:text-slate-200'
                          }`}>
                            {item.result}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">{item.unit}</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400 text-xs font-mono">{item.refRange}</td>
                        <td className="p-4 text-center">
                          {item.status === 'Normal' ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              Normal
                            </span>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{item.status} {item.flagText ? `(${item.flagText})` : ''}</span>
                            </div>
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
      )}

      {/* ORDER LAB MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-purple-600 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" /> Formulir Order Laboratorium
                </h3>
                <p className="text-xs text-purple-100 mt-0.5">Pasien: {patientData?.nama} ({patientData?.no_rm})</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-white/80 hover:text-white p-1">✕</button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Pilih Paket & Parameter Pemeriksaan
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'Darah Rutin', label: 'Paket Darah Rutin (CBC)' },
                    { id: 'GDP', label: 'Glukosa Darah Puasa' },
                    { id: 'HbA1c', label: 'HbA1c (Glycated Hb)' },
                    { id: 'Profil Lipid', label: 'Profil Lipid Lengkap' },
                    { id: 'Fungsi Ginjal', label: 'Ureum & Kreatinin' },
                    { id: 'Fungsi Hati', label: 'SGOT & SGPT' },
                    { id: 'Urinalisis', label: 'Urinalisis Lengkap' },
                    { id: 'Elektrolit', label: 'Elektrolit Serum (Na, K, Cl)' },
                  ].map(test => {
                    const isChecked = selectedTests.includes(test.id);
                    return (
                      <label
                        key={test.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedTests(selectedTests.filter(t => t !== test.id));
                          } else {
                            setSelectedTests([...selectedTests, test.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-bold transition-all ${
                          isChecked
                            ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>{test.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Indikasi Klinis / Catatan untuk Petugas Lab
                </label>
                <textarea
                  rows={3}
                  value={orderClinicalNotes}
                  onChange={e => setOrderClinicalNotes(e.target.value)}
                  placeholder="Contoh: Evaluasi kepatuhan terapi OHO dan kontrol kadar lipid berkala..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={handleCreateNewOrder}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-md transition-all"
              >
                Kirim Permintaan Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
