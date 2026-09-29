import React, { useState } from 'react';
import { LogOut, User, HeartPulse, CheckCircle2, Calendar, AlertCircle, Printer, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface DischargePlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function DischargePlanningModal({ isOpen, onClose, patient }: DischargePlanningModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_discharge_planning_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      tglMasuk: '2026-09-24',
      estimasiTglPulang: new Date().toISOString().split('T')[0],
      kriteriaKesiapanPulang: {
        tandaVitalStabil: true,
        nyeriTerkendali: true,
        dapatMobilisasiMandiri: true,
        dapatMakanMinumOral: true,
        obatPulangTersediaDanDiedukasi: true,
        lukaOperasiBersih: true,
      },
      instruksiPerawatanRumah: '1. Istirahat tirah baring secukupnya di rumah selama 3-5 hari.\n2. Jaga balutan luka operasi tetap bersih dan kering, jangan terkena air saat mandi.\n3. Diet makanan lunak bertahap ke padat, tinggi protein (putih telur, ikan) dan perbanyak minum air 2-2.5 liter/hari.\n4. Minum obat pulang secara teratur sesuai aturan pakai hingga habis.',
      obatPulang: [
        {
          nama: 'Cefixime 200 mg Kapsul',
          aturan: '2 x 1 kapsul sesudah makan',
          keterangan: 'Antibiotik oral, diminum habis selama 5 hari',
        },
        {
          nama: 'Asam Mefenamat 500 mg Tab',
          aturan: '3 x 1 tablet sesudah makan (k/p)',
          keterangan: 'Pereda nyeri luka, diminum jika nyeri',
        },
        {
          nama: 'Curcuma Tablet',
          aturan: '3 x 1 tablet sesudah makan',
          keterangan: 'Suplemen pencernaan & nafsu makan',
        },
      ],
      tandaBahayaEmergency: 'Segera bawa kembali ke IGD 24 Jam apabila timbul: Demam tinggi > 38.5°C, muntah berulang terus-menerus, perdarahan atau nanah dari luka operasi, nyeri perut hebat mendadak, atau sesak napas.',
      jadwalKontrolPoli: 'Hari Rabu, 1 Oktober 2026 (Pukul 09.00 WIB) di Poliklinik Bedah Umum bersama dr. Budi Santoso, Sp.B',
      dokterDPJP: 'dr. Budi Santoso, Sp.B, FInaCS',
      edukatorNurse: 'Ns. Ratna Sari, S.Kep',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_discharge_planning_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Discharge Planning & Instruksi Pemulangan Pasien berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    dischargePlanningData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-emerald-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Perencanaan Pemulangan Pasien (Discharge Planning - RM.08)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-600/80 font-mono">Standar ARK KARS</span>
              </div>
              <p className="text-xs text-emerald-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Edukasi Rawat Mandiri di Rumah & Kontrol Ulang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Tanggal & Kriteria Kesiapan */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Tanggal Masuk Rawat Inap</label>
                <input
                  type="date"
                  value={formData.tglMasuk}
                  onChange={(e) => setFormData({ ...formData, tglMasuk: e.target.value })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Tanggal Rencana Pemulangan (KRS)</label>
                <input
                  type="date"
                  value={formData.estimasiTglPulang}
                  onChange={(e) => setFormData({ ...formData, estimasiTglPulang: e.target.value })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-emerald-700 dark:text-emerald-400"
                />
              </div>
            </div>

            <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2">
              <span className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase block mb-2">Checklist Kesiapan Pasien Pulang:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.tandaVitalStabil}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, tandaVitalStabil: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Tanda-tanda vital stabil & afebris</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.nyeriTerkendali}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, nyeriTerkendali: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Nyeri terkontrol dengan obat oral</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.dapatMobilisasiMandiri}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, dapatMobilisasiMandiri: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Mampu mobilisasi mandiri / dengan alat</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.dapatMakanMinumOral}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, dapatMakanMinumOral: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Asupan nutrisi & cairan oral baik</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.obatPulangTersediaDanDiedukasi}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, obatPulangTersediaDanDiedukasi: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Obat pulang disiapkan & diedukasi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kriteriaKesiapanPulang.lukaOperasiBersih}
                    onChange={(e) => setFormData({ ...formData, kriteriaKesiapanPulang: { ...formData.kriteriaKesiapanPulang, lukaOperasiBersih: e.target.checked } })}
                    className="rounded text-emerald-600"
                  />
                  <span>Luka operasi bersih tanpa tanda infeksi</span>
                </label>
              </div>
            </div>
          </div>

          {/* Instruksi Perawatan Rumah */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instruksi Perawatan Mandiri di Rumah & Diet</label>
            <textarea
              rows={3}
              value={formData.instruksiPerawatanRumah}
              onChange={(e) => setFormData({ ...formData, instruksiPerawatanRumah: e.target.value })}
              className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Resep Obat Pulang */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 border-b border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Daftar Resep Obat Pulang (Take-Home Medication)</h4>
            </div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                  <th className="p-2">Nama Obat</th>
                  <th className="p-2">Aturan Minum</th>
                  <th className="p-2">Keterangan Khusus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {formData.obatPulang.map((ob: any, i: number) => (
                  <tr key={i}>
                    <td className="p-2 font-bold">{ob.nama}</td>
                    <td className="p-2 font-semibold text-blue-700 dark:text-blue-300">{ob.aturan}</td>
                    <td className="p-2 text-slate-500">{ob.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tanda Bahaya & Kontrol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl">
              <label className="text-xs font-bold text-rose-900 dark:text-rose-300 block mb-1">Tanda Bahaya Medis (Segera ke IGD)</label>
              <textarea
                rows={3}
                value={formData.tandaBahayaEmergency}
                onChange={(e) => setFormData({ ...formData, tandaBahayaEmergency: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-800"
              />
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl">
              <label className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-1">Jadwal & Lokasi Kontrol Poliklinik</label>
              <textarea
                rows={3}
                value={formData.jadwalKontrolPoli}
                onChange={(e) => setFormData({ ...formData, jadwalKontrolPoli: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-800 font-bold"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Discharge_Planning_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar Discharge"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="discharge_planning"
            title="PERENCANAAN PEMULANGAN PASIEN"
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Discharge Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
