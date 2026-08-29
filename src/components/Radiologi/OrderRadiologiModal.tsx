import React, { useState } from 'react';
import { RadiologiItem, ModalitasType, PrioritasType } from './types';
import { DAFTAR_TARIF_RADIOLOGI } from './data';
import { Modal } from '../Modal';
import { useToast } from '../../contexts/ToastContext';
import { ShieldAlert, Activity, User, FileText, CheckCircle2 } from 'lucide-react';

interface OrderRadiologiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newOrder: RadiologiItem) => void;
}

export function OrderRadiologiModal({ isOpen, onClose, onSave }: OrderRadiologiModalProps) {
  const toast = useToast();

  const [modalitas, setModalitas] = useState<ModalitasType>('X-Ray');
  const [selectedTindakanKode, setSelectedTindakanKode] = useState<string>(DAFTAR_TARIF_RADIOLOGI[0].kode_tarif);
  
  // Patient Demographics
  const [namaPasien, setNamaPasien] = useState('');
  const [noRm, setNoRm] = useState(`RM-2608-${Math.floor(Math.random() * 899 + 100)}`);
  const [umur, setUmur] = useState(45);
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [penjamin, setPenjamin] = useState('BPJS Kesehatan');
  
  // Clinical
  const [unitAsal, setUnitAsal] = useState('IGD (Emergency Room)');
  const [dokterPengirim, setDokterPengirim] = useState('dr. Budi Santoso, Sp.EM');
  const [diagnosaKerja, setDiagnosaKerja] = useState('');
  const [indikasiKlinis, setIndikasiKlinis] = useState('');
  const [prioritas, setPrioritas] = useState<PrioritasType>('Rutin / Elektif');
  const [posisiProyeksi, setPosisiProyeksi] = useState('AP / PA Standard');

  // Safety & Contrast Screening
  const [penggunaanKontras, setPenggunaanKontras] = useState(false);
  const [alergiKontras, setAlergiKontras] = useState(false);
  const [kreatinin, setKreatinin] = useState<number | undefined>(undefined);
  const [implanLogam, setImplanLogam] = useState(false);
  const [statusHamil, setStatusHamil] = useState(false);
  const [puasa, setPuasa] = useState(false);
  const [catatanScreening, setCatatanScreening] = useState('');

  // Filter tindakan based on modalitas
  const filteredTindakan = DAFTAR_TARIF_RADIOLOGI.filter(t => t.modalitas === modalitas);

  const selectedTindakanObj = DAFTAR_TARIF_RADIOLOGI.find(t => t.kode_tarif === selectedTindakanKode) || filteredTindakan[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPasien.trim()) {
      toast.error('Nama pasien wajib diisi');
      return;
    }
    if (!diagnosaKerja.trim()) {
      toast.error('Diagnosa kerja wajib diisi');
      return;
    }

    const orderIdNum = Math.floor(Math.random() * 899 + 100);
    const newId = `RAD-2026-08-${String(orderIdNum).padStart(3, '0')}`;
    const newOrderNo = `ORD-RAD-2608-${String(orderIdNum).padStart(3, '0')}`;

    const newOrder: RadiologiItem = {
      id: newId,
      no_order: newOrderNo,
      no_rm: noRm,
      nama_pasien: namaPasien,
      umur: Number(umur),
      jenis_kelamin: jenisKelamin,
      penjamin: penjamin,
      unit_asal: unitAsal,
      dokter_pengirim: dokterPengirim,
      indikasi_klinis: indikasiKlinis || `Permintaan pemeriksaan ${selectedTindakanObj.nama_tindakan} untuk evaluasi ${diagnosaKerja}`,
      diagnosa_kerja: diagnosaKerja,
      prioritas: prioritas,
      modalitas: modalitas,
      nama_pemeriksaan: selectedTindakanObj.nama_tindakan,
      posisi_proyeksi: posisiProyeksi,
      kode_icd9: selectedTindakanObj.kode_icd9,
      ruang_pemeriksaan: modalitas === 'CT-Scan' ? 'Ruang CT-Scan Gedung Radiologi Lt. 1' :
                         modalitas === 'MRI' ? 'Ruang MRI Shielded Room' :
                         modalitas === 'USG' ? 'Ruang USG Diagnostik 1' :
                         modalitas === 'Panoramic' ? 'Ruang Radiologi Dental & Maxillofacial' :
                         'Ruang Rontgen 1 (Utama)',
      tanggal_order: new Date().toISOString().split('T')[0],
      waktu_order: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')} WIB`,
      status: 'Menunggu Antrian',
      screening: {
        alergi_kontras: alergiKontras,
        penggunaan_kontras: penggunaanKontras,
        kreatinin_serum: kreatinin,
        implan_logam_pacemaker: implanLogam,
        status_hamil: statusHamil,
        puasa_persiapan: puasa,
        catatan_screening: catatanScreening
      },
      study_instance_uid: `1.2.840.113619.2.55.3.604688.${Date.now()}`,
      series_count: 1,
      image_count: 2,
      study_type_key: modalitas === 'X-Ray' ? 'thorax' : modalitas === 'CT-Scan' ? 'brain_ct' : modalitas === 'MRI' ? 'lumbar_mri' : modalitas === 'USG' ? 'usg_abdomen' : 'dental_pano'
    };

    onSave(newOrder);
    toast.success(`Order ${newOrder.id} (${newOrder.nama_pemeriksaan}) berhasil dibuat`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Permintaan Baru Pemeriksaan Radiologi (RIS Order)">
      <form onSubmit={handleSubmit} className="space-y-6 text-left max-h-[75vh] overflow-y-auto pr-1">
        {/* Section 1: Modalitas & Prosedur */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-pink-600 dark:text-pink-400">
            <Activity className="w-4 h-4" />
            <span>Pilihan Modalitas & Tindakan Radiologi</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['X-Ray', 'CT-Scan', 'MRI', 'USG', 'Panoramic', 'Mammografi'] as ModalitasType[]).map(m => (
              <button
                type="button"
                key={m}
                onClick={() => {
                  setModalitas(m);
                  const first = DAFTAR_TARIF_RADIOLOGI.find(t => t.modalitas === m);
                  if (first) setSelectedTindakanKode(first.kode_tarif);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                  modalitas === m
                    ? 'bg-pink-600 text-white border-pink-600 shadow'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Tindakan / Pemeriksaan
              </label>
              <select
                value={selectedTindakanKode}
                onChange={(e) => setSelectedTindakanKode(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500"
              >
                {filteredTindakan.map(t => (
                  <option key={t.kode_tarif} value={t.kode_tarif}>
                    {t.nama_tindakan} (ICD-9: {t.kode_icd9})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Posisi / Proyeksi
              </label>
              <input
                type="text"
                value={posisiProyeksi}
                onChange={(e) => setPosisiProyeksi(e.target.value)}
                placeholder="misal: AP / PA Erect, Lateral, Axial 2.5mm"
                className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Prioritas Klinis
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPrioritas('Rutin / Elektif')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                    prioritas === 'Rutin / Elektif'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Rutin / Elektif
                </button>
                <button
                  type="button"
                  onClick={() => setPrioritas('Cito / Emergency')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                    prioritas === 'Cito / Emergency'
                      ? 'bg-rose-600 text-white border-rose-600 shadow animate-pulse'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🚨 Cito / Emergency
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Estimasi Tarif (Tarif Klinik)
              </label>
              <div className="p-2.5 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg text-sm font-bold text-pink-700 dark:text-pink-300">
                Rp {selectedTindakanObj?.total_tarif?.toLocaleString('id-ID')}
                <span className="text-xs font-normal text-slate-500 ml-2">
                  (Plafon INA-CBG: Rp {selectedTindakanObj?.plafon_bpjs_inacbg?.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Data Pasien & Dokter Pengirim */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
            <User className="w-4 h-4" />
            <span>Data Identitas Pasien & Dokter Pengirim</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Nama Pasien *</label>
              <input
                type="text"
                required
                value={namaPasien}
                onChange={(e) => setNamaPasien(e.target.value)}
                placeholder="Nama lengkap pasien"
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">No. Rekam Medis (RM)</label>
              <input
                type="text"
                value={noRm}
                onChange={(e) => setNoRm(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Umur (Thn)</label>
                <input
                  type="number"
                  value={umur}
                  onChange={(e) => setUmur(Number(e.target.value))}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Jenis Kelamin</label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Penjamin Biaya</label>
              <select
                value={penjamin}
                onChange={(e) => setPenjamin(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                <option value="Umum / Mandiri">Umum / Mandiri</option>
                <option value="Asuransi Mandiri Inhealth">Asuransi Mandiri Inhealth</option>
                <option value="Asuransi Prudential">Asuransi Prudential</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Unit Asal Pengirim</label>
              <select
                value={unitAsal}
                onChange={(e) => setUnitAsal(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="IGD (Emergency Room)">IGD (Emergency Room)</option>
                <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                <option value="Poli Paru">Poli Paru</option>
                <option value="Poli Bedah Saraf">Poli Bedah Saraf</option>
                <option value="Poli Orthopedi">Poli Orthopedi</option>
                <option value="Poli Gigi & Mulut (Bedah Mulut)">Poli Gigi & Mulut</option>
                <option value="Bangsal Rawat Inap Dahlia">Bangsal Rawat Inap Dahlia</option>
                <option value="ICU (Intensive Care Unit)">ICU (Intensive Care Unit)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Dokter Pengirim (DPJP)</label>
              <input
                type="text"
                value={dokterPengirim}
                onChange={(e) => setDokterPengirim(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Diagnosa Kerja *</label>
              <input
                type="text"
                required
                value={diagnosaKerja}
                onChange={(e) => setDiagnosaKerja(e.target.value)}
                placeholder="misal: Suspect TB Paru Lesi Luas / HNP L4-L5"
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Indikasi Klinis / Keluhan</label>
              <input
                type="text"
                value={indikasiKlinis}
                onChange={(e) => setIndikasiKlinis(e.target.value)}
                placeholder="misal: Batuk 3 minggu, sesak napas, penurunan BB"
                className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Radiation Safety & Contrast Screening */}
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4" />
            <span>Screening Keselamatan Radiasi, Media Kontras & MRI Safety</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={penggunaanKontras}
                onChange={(e) => setPenggunaanKontras(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Menggunakan Media Kontras IV/Oral</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alergiKontras}
                onChange={(e) => setAlergiKontras(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
              <span className="font-semibold text-rose-700 dark:text-rose-400">Riwayat Alergi Kontras Iodine / Makanan Laut</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={implanLogam}
                onChange={(e) => setImplanLogam(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Implan Logam Feromagnetik / Pacemaker (MRI Warning)</span>
            </label>

            {jenisKelamin === 'P' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusHamil}
                  onChange={(e) => setStatusHamil(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span className="font-semibold text-rose-700 dark:text-rose-400">Sedang Hamil / Terduga Hamil (X-Ray Kontraindikasi)</span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={puasa}
                onChange={(e) => setPuasa(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Sudah Puasa Persiapan (Khusus USG/CT Kontras)</span>
            </label>
          </div>

          {penggunaanKontras && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-amber-800">
              <div>
                <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Kadar Kreatinin Serum Terakhir (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={kreatinin || ''}
                  onChange={(e) => setKreatinin(e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="misal: 0.95 (Normal: 0.7 - 1.2)"
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Catatan Persiapan Tambahan
                </label>
                <input
                  type="text"
                  value={catatanScreening}
                  onChange={(e) => setCatatanScreening(e.target.value)}
                  placeholder="misal: Terpasang IV Line 18G di tangan kanan"
                  className="w-full p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-pink-600/30 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Kirim Order ke Radiologi
          </button>
        </div>
      </form>
    </Modal>
  );
}
