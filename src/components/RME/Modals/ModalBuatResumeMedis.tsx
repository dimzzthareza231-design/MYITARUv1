import React, { useState } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { FileText, CheckCircle2, X, Stethoscope, Sparkles } from 'lucide-react';
import { ICD10_DATABASE, ICD9_DATABASE } from '../Data/icdData';

interface ModalBuatResumeMedisProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: any;
  onSuccess?: () => void;
}

export function ModalBuatResumeMedis({ isOpen, onClose, patient, onSuccess }: ModalBuatResumeMedisProps) {
  const { pasien, dokter, updatePasien } = useHospital();
  const toast = useToast();

  const [selectedPatientId, setSelectedPatientId] = useState(patient?.id || (pasien && pasien.length > 0 ? pasien[0].id : ''));
  const targetPatient = (pasien || []).find(p => p.id === selectedPatientId) || patient;

  const [dpjp, setDpjp] = useState(dokter && dokter.length > 0 ? dokter[0].nama : 'dr. Andi Pratama, Sp.PD');
  const [unit, setUnit] = useState('Poli Rawat Jalan');
  const [tglMasuk, setTglMasuk] = useState(new Date().toISOString().split('T')[0]);
  const [tglPulang, setTglPulang] = useState(new Date().toISOString().split('T')[0]);
  
  // Clinical
  const [keluhanUtama, setKeluhanUtama] = useState(targetPatient?.keluhan_utama || 'Pasien kontrol berkala dengan keluhan lemas dan pusing sejak 3 hari.');
  const [tandaVital, setTandaVital] = useState('TD: 120/80 mmHg, Nadi: 82x/mnt, RR: 18x/mnt, Suhu: 36.6°C, SpO2: 98%');
  const [pemeriksaanFisik, setPemeriksaanFisik] = useState('Keadaan umum sedang, compos mentis. Cor: S1/S2 reguler murni. Pulmo: vesikuler, wheezing (-), ronki (-). Abdomen: supel, bising usus normal.');
  
  const [diagnosaUtama, setDiagnosaUtama] = useState('[I10] Hipertensi Primer');
  const [diagnosaSekunder, setDiagnosaSekunder] = useState('[E11.9] Diabetes Melitus Tipe 2 Tanpa Komplikasi');
  const [tindakan, setTindakan] = useState('[89.52] Elektrokardiogram (EKG 12-Lead)');
  const [terapi, setTerapi] = useState('Amlodipine 10mg 1x1 tab pagi, Metformin 500mg 3x1 tab sesudah makan');
  const [kondisiPulang, setKondisiPulang] = useState('Membaik (Boleh Pulang)');
  const [anjuran, setAnjuran] = useState('Hindari makanan tinggi natrium dan gula, olahraga aerobik ringan 30 menit sehari');
  const [tglKontrol, setTglKontrol] = useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatient) {
      toast.error('Pilih pasien terlebih dahulu!');
      return;
    }

    const newResume = {
      no_resume: `RES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      no_rm: targetPatient.no_rm,
      nama_pasien: targetPatient.nama,
      tgl_lahir: targetPatient.tgl_lahir,
      jenis_kelamin: targetPatient.jenis_kelamin,
      dpjp,
      unit_pelayanan: unit,
      tgl_masuk: tglMasuk,
      tgl_keluar: tglPulang,
      keluhan_utama: keluhanUtama,
      pemeriksaan_fisik: `${tandaVital}\n${pemeriksaanFisik}`,
      diagnosa_utama: diagnosaUtama,
      diagnosa_sekunder: diagnosaSekunder,
      tindakan_prosedur: tindakan,
      terapi_pulang: terapi,
      kondisi_pulang: kondisiPulang,
      anjuran_rencana: anjuran,
      tgl_kontrol_kembali: tglKontrol,
      tte_dokter: true,
      tte_timestamp: new Date().toISOString()
    };

    try {
      await updatePasien(targetPatient.id, {
        resume_medis: newResume,
        diagnosa_primer: diagnosaUtama
      });

      toast.success(`Resume Medis PMK 24/2022 untuk ${targetPatient.nama} berhasil diterbitkan dan di-TTE!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error('Gagal menerbitkan resume medis.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="font-bold text-base">Buat Resume Medis Pasien (PMK 24/2022)</h3>
              <p className="text-[11px] text-blue-100">Ringkasan pelayanan keluar & kepatuhan indikator mutu nasional</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* PASIEN & DPJP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Pasien *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
              >
                {(pasien || []).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.no_rm} — {p.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Dokter DPJP Penanggung Jawab *
              </label>
              <select
                value={dpjp}
                onChange={(e) => setDpjp(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                {(dokter || []).map(d => (
                  <option key={d.id} value={d.nama}>
                    {d.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* UNIT & TANGGAL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Pelayanan</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="Poli Rawat Jalan">Poli Rawat Jalan</option>
                <option value="Rawat Inap Bangsal">Rawat Inap Bangsal</option>
                <option value="Instalasi Gawat Darurat (IGD)">Instalasi Gawat Darurat (IGD)</option>
                <option value="Kamar Operasi (Bedah)">Kamar Operasi (Bedah)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tgl Masuk / Rawat</label>
              <input
                type="date"
                value={tglMasuk}
                onChange={(e) => setTglMasuk(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tgl Keluar / Pulang</label>
              <input
                type="date"
                value={tglPulang}
                onChange={(e) => setTglPulang(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* KELUHAN & PEMERIKSAAN FISIK */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Ringkasan Riwayat Penyakit & Anamnesa
            </label>
            <textarea
              rows={2}
              value={keluhanUtama}
              onChange={(e) => setKeluhanUtama(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tanda-Tanda Vital</label>
              <input
                type="text"
                value={tandaVital}
                onChange={(e) => setTandaVital(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pemeriksaan Fisik Penting</label>
              <input
                type="text"
                value={pemeriksaanFisik}
                onChange={(e) => setPemeriksaanFisik(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {/* DIAGNOSIS ICD-10 & ICD-9 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-blue-600 dark:text-blue-400 block mb-1">Diagnosis Utama (ICD-10) *</label>
              <input
                type="text"
                required
                value={diagnosaUtama}
                onChange={(e) => setDiagnosaUtama(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Diagnosis Sekunder / Komorbid</label>
              <input
                type="text"
                value={diagnosaSekunder}
                onChange={(e) => setDiagnosaSekunder(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Tindakan / Prosedur (ICD-9-CM)</label>
              <input
                type="text"
                value={tindakan}
                onChange={(e) => setTindakan(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Kondisi Saat Pulang</label>
              <select
                value={kondisiPulang}
                onChange={(e) => setKondisiPulang(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                <option value="Membaik (Boleh Pulang)">Membaik (Boleh Pulang)</option>
                <option value="Sembuh Total">Sembuh Total</option>
                <option value="Rujuk ke Faskes Lanjutan">Rujuk ke Faskes Lanjutan</option>
                <option value="Pulang Atas Permintaan Sendiri (APS)">Pulang Atas Permintaan Sendiri (APS)</option>
                <option value="Meninggal Dunia">Meninggal Dunia</option>
              </select>
            </div>
          </div>

          {/* TERAPI & ANJURAN */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Terapi Pulang & Obat Lanjutan</label>
            <textarea
              rows={2}
              value={terapi}
              onChange={(e) => setTerapi(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Anjuran / Edukasi Pasien</label>
              <input
                type="text"
                value={anjuran}
                onChange={(e) => setAnjuran(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tanggal Kontrol Kembali</label>
              <input
                type="date"
                value={tglKontrol}
                onChange={(e) => setTglKontrol(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Resume Medis & TTE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
