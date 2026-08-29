import React, { useState } from 'react';
import { MedicationStock } from './types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Database, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface KatalogFornasKfaTabProps {
  stocks: MedicationStock[];
}

export function KatalogFornasKfaTab({ stocks }: KatalogFornasKfaTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFornas, setFilterFornas] = useState<'semua' | 'fornas_only' | 'kfa_valid'>('semua');

  const fornasList = [
    {
      kode_kfa: '93001024',
      nama_obat: 'Paracetamol 500 mg Tablet',
      golongan: 'Analgesik / Antipiretik',
      tingkat_faskes: 'Faskes 1, 2, 3 (Semua Jenjang)',
      restriksi_fornas: 'Maksimal 30 tab/bulan untuk terapi kronis/simptomatik.',
      ina_cbg_coverage: 'Ditanggung 100% Paket BPJS Kesehatan'
    },
    {
      kode_kfa: '93002055',
      nama_obat: 'Amoxicillin 500 mg Kapsul',
      golongan: 'Antibiotik Penisilin',
      tingkat_faskes: 'Faskes 1, 2, 3',
      restriksi_fornas: 'Hanya untuk infeksi bakteri terbukti atau kecurigaan kuat infeksi saluran napas/saluran kemih.',
      ina_cbg_coverage: 'Ditanggung 100% Paket BPJS Kesehatan'
    },
    {
      kode_kfa: '93003012',
      nama_obat: 'Amlodipine 10 mg Tablet',
      golongan: 'Antihipertensi (Calcium Channel Blocker)',
      tingkat_faskes: 'Faskes 1, 2, 3 (Program Rujuk Balik)',
      restriksi_fornas: 'Maks 30 tab/bulan. Obat PRB (Program Rujuk Balik) untuk hipertensi esensial stabil.',
      ina_cbg_coverage: 'Ditanggung 100% Paket BPJS & PRB'
    },
    {
      kode_kfa: '93004088',
      nama_obat: 'Ceftriaxone 1 g Serbuk Injeksi',
      golongan: 'Antibiotik Sefalosporin Generasi III',
      tingkat_faskes: 'Faskes 2, 3 (Klinik)',
      restriksi_fornas: 'Restriksi antibiotik lini 2 (Watch Group PPRA). Untuk infeksi berat yang tidak respon lini 1.',
      ina_cbg_coverage: 'Ditanggung Rawat Inap & IGD'
    },
    {
      kode_kfa: '93005011',
      nama_obat: 'Omeprazole 20 mg Kapsul',
      golongan: 'Penghambat Pompa Proton (PPI)',
      tingkat_faskes: 'Faskes 1, 2, 3',
      restriksi_fornas: 'Maksimal 30 kapsul/bulan untuk GERD atau Tukak Peptik.',
      ina_cbg_coverage: 'Ditanggung 100% Paket BPJS Kesehatan'
    },
    {
      kode_kfa: '93006099',
      nama_obat: 'Insulin Glargine 100 IU/mL Pen',
      golongan: 'Antidiabetes Analog Long-Acting',
      tingkat_faskes: 'Faskes 2, 3 (Spesialis Penyakit Dalam / Endokrin)',
      restriksi_fornas: 'Untuk pasien DM Tipe 2 dengan HbA1c > 8% yang tidak terkontrol dengan OAD kombinasi ganda.',
      ina_cbg_coverage: 'Ditanggung BPJS dengan Surat Rekomendasi Sp.PD'
    }
  ];

  const filtered = fornasList.filter(f => {
    const match = f.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.kode_kfa.includes(searchTerm) ||
      f.golongan.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  return (
    <div className="space-y-6">
      {/* 1. HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            Integrasi Kemenkes RI &amp; BPJS
          </span>
          <h2 className="text-xl font-black mt-1">Formularium Nasional (Fornas) &amp; Direktori KFA</h2>
          <p className="text-xs text-slate-300">
            Pengecekan batasan restriksi peresepan obat Fornas BPJS dan standardisasi kode KFA SatuSehat FHIR.
          </p>
        </div>

        <button
          onClick={() => toast.success('Sinkronisasi Direktori KFA Kemenkes RI berhasil diperbarui!')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
        >
          <Database className="w-4 h-4" />
          <span>Sinkronisasi KFA SatuSehat</span>
        </button>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari Kode KFA, Nama Obat Fornas, Golongan Farmakologi..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      {/* 3. FORNAS DIRECTORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start pb-2 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  KFA: {item.kode_kfa}
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">
                  {item.nama_obat}
                </h4>
                <p className="text-xs text-slate-500">{item.golongan}</p>
              </div>

              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded text-[10px] font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Fornas BPJS
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 font-bold block">Tingkat Faskes Berwenang:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.tingkat_faskes}</span>
              </div>

              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <span className="text-[11px] font-black text-amber-900 dark:text-amber-300 block mb-0.5">
                  Restriksi Peresepan Fornas:
                </span>
                <p className="text-[11px] text-amber-800 dark:text-amber-200">{item.restriksi_fornas}</p>
              </div>

              <div className="pt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{item.ina_cbg_coverage}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
