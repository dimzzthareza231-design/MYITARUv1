import React, { useState } from 'react';
import { Pill, Plus, Trash2, User, CheckCircle2, AlertTriangle, Printer, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface RekonsiliasiObatModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function RekonsiliasiObatModal({ isOpen, onClose, patient }: RekonsiliasiObatModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_rekonsiliasi_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      riwayatObatSebelumAdmisi: [
        {
          namaObat: 'Amlodipine 10 mg',
          dosis: '10 mg',
          rute: 'Oral',
          aturanPakai: '1 x 1 tab pagi',
          tindakLanjut: 'Lanjut Sesuai Dosis',
          perubahanInstruksi: 'Lanjut minum jam 07.00 pagi',
        },
        {
          namaObat: 'Metformin 500 mg',
          dosis: '500 mg',
          rute: 'Oral',
          aturanPakai: '2 x 1 tab sesudah makan',
          tindakLanjut: 'Stop / Ditunda',
          perubahanInstruksi: 'Stop sementara selama puasa pre-op',
        },
        {
          namaObat: 'Antasida Doen Suspensi',
          dosis: '1 Cth (5 ml)',
          rute: 'Oral',
          aturanPakai: '3 x 1 Cth ac',
          tindakLanjut: 'Ganti Obat',
          perubahanInstruksi: 'Ganti Inj. Omeprazole 40mg IV',
        },
      ],
      catatanPemberianObatKPO: [
        {
          namaObat: 'Inj. Ceftriaxone 1 gr',
          dosisRute: '1 gr / IV Bolus',
          frekuensi: 'Tiap 12 Jam',
          jamPemberian: '08:00, 20:00',
          perawatPelaksana: 'Ns. Ratna Sari, S.Kep',
          status: 'Diberikan',
        },
        {
          namaObat: 'Inj. Omeprazole 40 mg',
          dosisRute: '40 mg / IV Bolus',
          frekuensi: 'Tiap 24 Jam',
          jamPemberian: '08:00',
          perawatPelaksana: 'Ns. Ratna Sari, S.Kep',
          status: 'Diberikan',
        },
        {
          namaObat: 'Drip Paracetamol 1000 mg',
          dosisRute: '1000 mg / IV Drip',
          frekuensi: 'K/P Suhu >= 38.5C',
          jamPemberian: '14:30',
          perawatPelaksana: 'Ns. Hendra, S.Kep',
          status: 'Diberikan',
        },
      ],
      apotekerKlinis: 'apt. Sarah Nurhaliza, S.Farm',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_rekonsiliasi_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Rekonsiliasi Obat & Catatan Pemberian Obat (KPO) berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    rekonsiliasiObatData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-teal-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Rekonsiliasi Obat & Catatan Pemberian Obat (KPO)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-600/80 font-mono">Standar PKPO KARS</span>
              </div>
              <p className="text-xs text-teal-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Verifikasi Interaksi & Riwayat Terapi Rumah ke Ranap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Section 1: Riwayat Obat Rumah */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Riwayat Penggunaan Obat Sebelum Masuk RS (Rekonsiliasi Admisi)
              </h4>
            </div>

            <div className="p-3 space-y-3">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="p-2">Nama Obat</th>
                    <th className="p-2">Dosis & Rute</th>
                    <th className="p-2">Aturan Pakai</th>
                    <th className="p-2">Tindak Lanjut DPJP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formData.riwayatObatSebelumAdmisi.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 font-bold">{item.namaObat}</td>
                      <td className="p-2">{item.dosis} ({item.rute})</td>
                      <td className="p-2">{item.aturanPakai}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.tindakLanjut === 'Lanjut Sesuai Dosis' ? 'bg-emerald-100 text-emerald-800' :
                          item.tindakLanjut === 'Stop / Ditunda' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.tindakLanjut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: KPO Rawat Inap */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                2. Kartu Pemberian Obat (KPO) Rawat Inap Terjadwal
              </h4>
            </div>

            <div className="p-3 space-y-3">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="p-2">Nama Obat</th>
                    <th className="p-2">Dosis & Rute</th>
                    <th className="p-2">Frekuensi & Jam</th>
                    <th className="p-2">Perawat & Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {formData.catatanPemberianObatKPO.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2 font-bold text-teal-800 dark:text-teal-300">{item.namaObat}</td>
                      <td className="p-2">{item.dosisRute}</td>
                      <td className="p-2 font-mono">{item.frekuensi} ({item.jamPemberian})</td>
                      <td className="p-2 font-bold text-emerald-600 dark:text-emerald-400">{item.status} ({item.perawatPelaksana})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Apoteker Penanggung Jawab Klinis</label>
            <input
              type="text"
              value={formData.apotekerKlinis}
              onChange={(e) => setFormData({ ...formData, apotekerKlinis: e.target.value })}
              className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Rekonsiliasi_Obat_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar Rekonsiliasi"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="rekonsiliasi_obat"
            title="REKONSILIASI & PEMBERIAN OBAT"
          />

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Rekonsiliasi Obat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
