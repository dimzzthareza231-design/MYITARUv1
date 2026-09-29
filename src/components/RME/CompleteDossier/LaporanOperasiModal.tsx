import React, { useState } from 'react';
import { Scissors, User, HeartPulse, FileText, CheckCircle2, Printer, Save, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface LaporanOperasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function LaporanOperasiModal({ isOpen, onClose, patient }: LaporanOperasiModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_laporan_operasi_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      namaOperasi: 'Apendiktomi Laparoskopi + Lavase Peritoneal',
      dokterOperator: 'dr. Budi Santoso, Sp.B, FInaCS',
      asistenOperator: 'dr. Anton Wijaya',
      dokterAnestesi: 'dr. Maya Indriani, Sp.An-TI, FIP',
      penataAnestesi: 'Ns. Joko Prasetyo, S.Kep',
      jenisAnestesi: 'General Anesthesia (GA) - Intubasi Endotrakeal',
      tglOperasi: new Date().toISOString().split('T')[0],
      jamMulai: '09:00',
      jamSelesai: '10:30',
      durasiMenit: 90,
      diagnosisPraBedah: 'Appendicitis Akuta Perforata + Peritonitis Lokal',
      diagnosisPascaBedah: 'Appendicitis Gangrenosa Perforata',
      indikasiOperasi: 'Nyeri perut kanan bawah akut, leukositosis (18.500), USG abdomen suggestive apendisitis akut perforasi.',
      desinfeksiKulit: 'Povidone Iodine 10% + Alkohol 70%',
      insisiKulit: '3 Port Laparoskopi (Umbilikus 10mm, Suprapubik 5mm, Fossa Iliaka Kiri 5mm)',
      temuanIntraoperatif: 'Ditemukan apendiks letak retrosekal, ukuran 8x1.5 cm, dinding nekrotik gangrenosa dengan perforasi di 1/3 distal. Eksudat purulen +/- 50 cc di cavum douglas.',
      tahapanUraianPembedahan: '1. Pasien posisi supine dalam GA, asepsis dan antisepsis medan operasi, pasang doek steril.\n2. Insisi infraumbilikus 10mm, insersi trocar dan buat pneumoperitoneum 12 mmHg.\n3. Eksplorasi rongga peritoneum: visualisasi apendiks gangrenosa di fossa iliaka kanan.\n4. Diseksi mesoapendiks dengan bipolar & hem-o-lok clip.\n5. Ligasi basis apendiks dengan double endoloop vicryl 0, transeksi apendiks.\n6. Apendiks dimasukkan ke dalam endobag dan diekstraksi via port umbilikus.\n7. Irigasi dan lavase cavum peritoneum dengan NaCl 0.9% hangat sampai jernih.\n8. Pemasangan drain peritoneal silikon 18 Fr di cavum douglas.\n9. Desufflasi, penjahitan fascia dengan Vicryl 2-0, kulit dengan Monocryl 4-0 subkutikuler.',
      jumlahPerdarahan: '± 40 ml (Minimal)',
      transfusiIntraoperatif: 'Tidak Ada',
      jaringanDikirimKePA: true,
      komplikasi: 'Tidak ada komplikasi intraoperatif',
      instruksiPascaBedah: '1. Awasi tanda vital per 15 menit selama di PACU (Aldrete Score >= 9).\n2. Puasa sampai bising usus aktif (+), kemudian bertahap minum air.\n3. IVFD RL : D5 0.45% = 2 : 2 (2000 ml/24 jam).\n4. Inj. Ceftriaxone 1 gr / 12 jam IV.\n5. Inj. Metronidazole 500 mg / 8 jam IV drip.\n6. Inj. Ketorolac 30 mg / 8 jam IV.\n7. Rawat luka laparoskopi dan pantau produksi drain tiap shift.',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_laporan_operasi_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Laporan Operasi & Catatan Anestesi berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    laporanOperasiData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-indigo-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Laporan Operasi & Anestesi Bedah Sentral (RM.07)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/80 font-mono">Permenkes 24/2022</span>
              </div>
              <p className="text-xs text-indigo-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Dokumentasi Lengkap Prosedur Pembedahan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Metadata Operasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Nama Tindakan Operasi</label>
              <input
                type="text"
                value={formData.namaOperasi}
                onChange={(e) => setFormData({ ...formData, namaOperasi: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Dokter Operator (Bedah)</label>
              <input
                type="text"
                value={formData.dokterOperator}
                onChange={(e) => setFormData({ ...formData, dokterOperator: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Dokter Anestesi & Jenis Pembiusan</label>
              <input
                type="text"
                value={formData.dokterAnestesi}
                onChange={(e) => setFormData({ ...formData, dokterAnestesi: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Diagnosis Pra-Bedah</label>
              <input
                type="text"
                value={formData.diagnosisPraBedah}
                onChange={(e) => setFormData({ ...formData, diagnosisPraBedah: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Diagnosis Pasca-Bedah</label>
              <input
                type="text"
                value={formData.diagnosisPascaBedah}
                onChange={(e) => setFormData({ ...formData, diagnosisPascaBedah: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-indigo-700 dark:text-indigo-400"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Mulai</label>
                <input
                  type="text"
                  value={formData.jamMulai}
                  onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-center font-mono"
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Selesai</label>
                <input
                  type="text"
                  value={formData.jamSelesai}
                  onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-center font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Temuan Intraoperatif</label>
            <textarea
              rows={2}
              value={formData.temuanIntraoperatif}
              onChange={(e) => setFormData({ ...formData, temuanIntraoperatif: e.target.value })}
              className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Tahapan & Uraian Lengkap Pembedahan</label>
            <textarea
              rows={6}
              value={formData.tahapanUraianPembedahan}
              onChange={(e) => setFormData({ ...formData, tahapanUraianPembedahan: e.target.value })}
              className="w-full p-2.5 text-xs font-mono border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Perdarahan & Jaringan PA</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.jumlahPerdarahan}
                  onChange={(e) => setFormData({ ...formData, jumlahPerdarahan: e.target.value })}
                  placeholder="Perdarahan (ml)"
                  className="w-1/2 p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
                <label className="w-1/2 flex items-center gap-2 p-2 text-xs border rounded-lg bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.jaringanDikirimKePA}
                    onChange={(e) => setFormData({ ...formData, jaringanDikirimKePA: e.target.checked })}
                    className="rounded text-purple-600"
                  />
                  <span className="font-bold text-purple-900 dark:text-purple-300">Kirim Spesimen PA</span>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Instruksi Pasca Bedah & PACU</label>
              <textarea
                rows={3}
                value={formData.instruksiPascaBedah}
                onChange={(e) => setFormData({ ...formData, instruksiPascaBedah: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Laporan_Operasi_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Laporan Operasi"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="laporan_operasi"
            title="LAPORAN OPERASI & CATATAN ANESTESI"
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Laporan Operasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
