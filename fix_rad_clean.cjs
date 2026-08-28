const fs = require('fs');

const code = `import React from 'react';
import { RadiologiItem } from './types';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';
import { Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LembarHasilPrintProps {
  item: RadiologiItem;
  onClose: () => void;
}

export function LembarHasilPrint({ item, onClose }: LembarHasilPrintProps) {
  const exp = item.laporan_ekspertise;

  const customContent = (
      <div className="bg-white text-slate-900 w-full p-8 space-y-6 text-left relative max-w-4xl mx-auto border border-slate-200">
        {/* --- OFFICIAL HOSPITAL LETTERHEAD (KOP SURAT) --- */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow">
              🏥
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950">
                RUMAH SAKIT MYITARU SEHAT
              </h1>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Jl. Kesehatan Raya No. 45, Jakarta Selatan 12345
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Telp: (021) 7890-1234 | Email: info@myitaru.id | SIP: 440/123/RS/2022
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">
              Instalasi Radiologi
            </h2>
            <div className="inline-block mt-1 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded">
              AKREDITASI PARIPURNA KARS
            </div>
          </div>
        </div>

        {/* --- DOCUMENT TITLE --- */}
        <div className="text-center pt-2 pb-4">
          <h3 className="font-extrabold text-lg uppercase underline underline-offset-4 decoration-2">
            Hasil Ekspertise Pemeriksaan Radiologi
          </h3>
          <p className="text-xs text-slate-600 mt-2 font-mono">
            No. Reg: {item.no_order} / {item.id}
          </p>
        </div>

        {/* --- PATIENT DATA GRID --- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs font-medium p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">Nama Pasien</span>
            <span className="font-bold text-slate-900">: {item.nama_pasien}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">No. RM</span>
            <span className="font-bold font-mono text-slate-900">: {item.no_rm}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">Tanggal Lahir</span>
            <span className="font-bold text-slate-900">: {item.tanggal_lahir}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">Jenis Pemeriksaan</span>
            <span className="font-bold text-slate-900">: {item.tindakan}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">Dokter Pengirim</span>
            <span className="font-bold text-slate-900">: {item.dokter_pengirim}</span>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <span className="text-slate-500">Tanggal Periksa</span>
            <span className="font-bold text-slate-900">: {item.tanggal_order}</span>
          </div>
        </div>

        {/* --- CLINICAL INFO --- */}
        <div className="text-sm">
          <span className="font-bold text-slate-700 block mb-1">Keterangan Klinis (Indikasi):</span>
          <p className="text-slate-800 p-3 bg-slate-50 border border-slate-200 rounded-lg italic">
            {exp?.keterangan_klinis || 'Pasien rujukan dari Poli Dalam dengan keluhan sesak napas.'}
          </p>
        </div>

        {/* --- EXPERTISE RESULTS --- */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 uppercase flex items-center gap-2 mb-2">
              <span>Uraian Hasil Pemeriksaan (Deskripsi):</span>
            </h4>
            <div className="text-sm text-slate-800 leading-relaxed space-y-2 whitespace-pre-wrap pl-4 border-l-4 border-slate-200">
              {exp?.deskripsi_hasil}
            </div>
          </div>

          <div className="pt-4">
            <h4 className="font-extrabold text-sm text-slate-900 uppercase flex items-center gap-2 mb-2">
              <span>Kesimpulan (Kesan/Diagnosa Radiologi):</span>
            </h4>
            <div className="text-sm text-slate-900 font-bold bg-yellow-50/50 p-4 rounded-lg border border-yellow-200/50 whitespace-pre-wrap">
              {exp?.kesimpulan}
            </div>
          </div>
        </div>

        {/* --- SIGNATURES & VALIDATION --- */}
        <div className="flex justify-between items-end pt-12 pb-4">
          <div className="w-48 text-center text-[10px] text-slate-500">
            <div className="w-16 h-16 mx-auto mb-2 opacity-20 border-2 border-slate-400 rounded-full flex items-center justify-center font-bold rotate-[-15deg]">
              VALID
            </div>
            Dokumen ini telah diverifikasi dan dienkripsi secara digital.
          </div>

          <div className="text-right space-y-1">
            <p className="text-slate-500 text-sm">
              Jakarta, {item.tanggal_order} {item.waktu_validasi || ''}
            </p>
            <p className="text-slate-700 font-medium text-sm">Dokter Spesialis Radiologi (Sp.Rad),</p>
            
            <div className="py-3 flex justify-end">
              <div className="px-3 py-1.5 border border-blue-500/40 bg-blue-50 text-blue-800 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>DIGITALLY SIGNED & VERIFIED</span>
              </div>
            </div>

            <p className="font-bold text-slate-900 underline text-base">
              {item.dokter_radiologi || 'dr. Satria Wirawan, Sp.Rad'}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              SIP: 446.1/RAD/DINKES/2023
            </p>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-4 border-t border-slate-200">
          Lembar hasil ini merupakan rekaman medis elektronik sah Rumah Sakit MYITARU SEHAT dan dapat diverifikasi secara daring.
        </div>
      </div>
  );

  return (
      <DocumentPreviewModal 
          isOpen={true}
          onClose={onClose}
          customContent={customContent}
          title={\`Hasil_Radiologi_\${item.no_order || item.nomor_pemeriksaan}\`}
      />
  );
}
`;

fs.writeFileSync('src/components/Radiologi/LembarHasilPrint.tsx', code);
console.log("Rewrote LembarHasilPrint.tsx");
