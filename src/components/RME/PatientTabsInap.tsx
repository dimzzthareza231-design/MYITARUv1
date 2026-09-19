import React, { useState } from 'react';
import { 
  FileSignature, 
  ShieldCheck, 
  Stethoscope, 
  ClipboardList, 
  AlertTriangle, 
  Activity, 
  Brain, 
  FlaskConical, 
  FileText,
  CheckCircle2,
  Clock,
  User,
  Plus,
  HeartPulse,
  Pill,
  Printer,
  Edit2,
  Trash2,
  Scale,
  Sparkles
} from 'lucide-react';
import { LaboratoryTab } from './LaboratoryTab';
import { RadiologyTab } from './RadiologyTab';
import PrintPDFButton from '../PrintPDFButton';
import { ResumeMedisTemplate } from './ResumeMedisTemplate';
import { toast } from 'react-hot-toast';

export function GeneralConsentTab({ patientData, setPatientData }: { patientData?: any; setPatientData?: (d: any) => void }) {
  const [signed, setSigned] = useState(true);
  const [signerName, setSignerName] = useState(patientData?.nama || 'Pasien Sendiri');
  const [relation, setRelation] = useState('Pasien Sendiri');
  const [approvalItems, setApprovalItems] = useState({
    generalTreatment: true,
    dataAccess: true,
    rulesAcknowledgment: true,
    emergencyCare: true,
    financialAgreement: true
  });

  const handleSaveConsent = () => {
    toast.success('Persetujuan Umum (General Consent) berhasil disimpan & divalidasi.');
  };

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Persetujuan Umum (General Consent)
              {signed && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Persetujuan pelepasan informasi, tata tertib, hak & pembiayaan pelayanan RS</p>
          </div>
        </div>

        <PrintPDFButton
          filename={`General_Consent_${patientData?.no_rm || 'Pasien'}`}
          label="Cetak Formulir"
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl shadow-sm"
          documentData={patientData}
          docType="general_consent"
          title="FORMULIR PERSETUJUAN UMUM (GENERAL CONSENT)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" /> Identitas Penanggung Jawab
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Nama Pemberi Persetujuan</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Hubungan dengan Pasien</label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Pasien Sendiri">Pasien Sendiri</option>
                <option value="Suami / Istri">Suami / Istri</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Anak Kandung">Anak Kandung</option>
                <option value="Wali Hukum">Wali Hukum</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Butir Persetujuan
          </h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={approvalItems.generalTreatment}
                onChange={(e) => setApprovalItems({ ...approvalItems, generalTreatment: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
              <span>Persetujuan pemeriksaan fisik, tanda vital, diagnostik umum & terapi dasar</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={approvalItems.dataAccess}
                onChange={(e) => setApprovalItems({ ...approvalItems, dataAccess: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
              <span>Persetujuan integrasi data RME ke platform SatuSehat & BPJS Kesehatan</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={approvalItems.rulesAcknowledgment}
                onChange={(e) => setApprovalItems({ ...approvalItems, rulesAcknowledgment: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
              <span>Kepatuhan terhadap tata tertib jam kunjung & larangan merokok di RS</span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={approvalItems.financialAgreement}
                onChange={(e) => setApprovalItems({ ...approvalItems, financialAgreement: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 mt-0.5"
              />
              <span>Klausul penjaminan biaya sesuai ketentuan {patientData?.penjamin || 'BPJS / Asuransi'}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-200">Status Validasi Dokumen Persetujuan</p>
            <p className="text-emerald-700 dark:text-emerald-400">
              Ditandatangani secara digital saat admisi pada {patientData?.created_at || 'Hari Ini'} oleh {signerName} ({relation}).
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveConsent}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
        >
          💾 Simpan & Perbarui Persetujuan
        </button>
      </div>
    </div>
  );
}

export function HakPasienTab({ patientData }: { patientData?: any }) {
  const [eduCompleted, setEduCompleted] = useState(true);

  const rights = [
    'Memperoleh informasi mengenai tata tertib dan peraturan yang berlaku di Rumah Sakit.',
    'Memperoleh layanan yang manusiawi, adil, jujur, dan tanpa diskriminasi.',
    'Memperoleh layanan kesehatan yang bermutu sesuai dengan standar profesi dan standar prosedur operasional.',
    'Memperoleh layanan yang efektif dan efisien sehingga pasien terhindar dari kerugian fisik dan materi.',
    'Memilih dokter, dokter gigi, dan kelas perawatan sesuai dengan keinginannya dan peraturan yang berlaku di RS.',
    'Meminta konsultasi tentang penyakit yang dideritanya kepada dokter lain yang mempunyai SIP baik di dalam maupun di luar RS.',
    'Mendapatkan privasi dan kerahasiaan penyakit yang diderita termasuk data-data medisnya.',
    'Mendapat informasi yang meliputi diagnosis dan tata cara tindakan medis, tujuan tindakan medis, alternatif tindakan, risiko dan komplikasi yang mungkin terjadi, dan prognosis.',
    'Memberikan persetujuan atau menolak sebagian atau seluruh tindakan yang akan diberikan oleh tenaga kesehatan.',
    'Didampingi keluarganya dalam keadaan kritis.'
  ];

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hak Pasien & Keluarga (UU No. 17/2023)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Edukasi hak dan kewajiban pasien selama masa perawatan</p>
          </div>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${eduCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          {eduCompleted ? '✓ Edukasi Telah Diberikan' : 'Belum Diberikan'}
        </span>
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-indigo-500" /> Ringkasan Hak Pasien Sesuai Standar Akreditasi KARS / STARKES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
          {rights.map((r, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-indigo-600 shrink-0">{i + 1}.</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-bold text-indigo-950 dark:text-indigo-200">Verifikasi Edukasi Hak Pasien</p>
          <p className="text-indigo-700 dark:text-indigo-400">Petugas edukator: Ns. Ayu Lestari, S.Kep • Penerima edukasi: {patientData?.nama || 'Pasien / Keluarga'}</p>
        </div>
        <button
          onClick={() => {
            setEduCompleted(true);
            toast.success('Pemberian edukasi hak pasien berhasil diverifikasi!');
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition-colors"
        >
          Konfirmasi Edukasi
        </button>
      </div>
    </div>
  );
}

export function AsesmenMedisTab({ patientData, setPatientData }: { patientData?: any; setPatientData?: (d: any) => void }) {
  const [keluhan, setKeluhan] = useState(patientData?.keluhan || 'Demam naik turun sejak 3 hari, disertai mual dan sakit kepala.');
  const [riwayatPenyakit, setRiwayatPenyakit] = useState('Tidak ada riwayat hipertensi atau diabetes melitus sebelumnya.');
  const [dxUtama, setDxUtama] = useState(patientData?.diagnosa || patientData?.problem_list?.[0]?.nama || 'Observasi Febris');
  const [icdCode, setIcdCode] = useState(patientData?.problem_list?.[0]?.kode_icd10 || 'R50.9');
  const [rencanaTerapi, setRencanaTerapi] = useState('IVFD Asering 20 tpm, Paracetamol drip 1 gr k/p, Cek Darah Lengkap & Serologi Dengue.');

  const handleSave = () => {
    if (setPatientData && patientData) {
      setPatientData({
        ...patientData,
        keluhan,
        diagnosa: dxUtama
      });
    }
    toast.success('Asesmen Medis Awal berhasil disimpan.');
  };

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Asesmen Awal Medis Terintegrasi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pengkajian klinis komprehensif oleh Dokter Penanggung Jawab Pelayanan (DPJP)</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          💾 Simpan Asesmen Medis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anamnesis */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" /> 1. Anamnesis (Keluhan & Riwayat)
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Keluhan Utama & RPS</label>
              <textarea
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Riwayat Penyakit Dahulu / Alergi</label>
              <input
                type="text"
                value={riwayatPenyakit}
                onChange={(e) => setRiwayatPenyakit(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Status Fisik & Tanda Vital */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-500" /> 2. Status Fisik & Tanda Vital Terkini
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">TD</span>
              <p className="font-bold text-slate-900 dark:text-white">{patientData?.vitals?.[0]?.bp || '120/80'}</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Nadi</span>
              <p className="font-bold text-emerald-600">{patientData?.vitals?.[0]?.hr || 80} x/m</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Suhu</span>
              <p className="font-bold text-amber-600">{patientData?.vitals?.[0]?.temp || 36.8} °C</p>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">SpO2</span>
              <p className="font-bold text-blue-600">{patientData?.vitals?.[0]?.spo2 || 99} %</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Keadaan Umum: Tampak sakit sedang, Kesadaran: Compos Mentis (GCS E4V5M6). Cor/Pulmo dalam batas normal, hepar/lien tidak teraba membesar.
          </p>
        </div>

        {/* Diagnosis & Rencana */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 md:col-span-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-blue-500" /> 3. Diagnosis Masuk & Rencana Asuhan Medis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="md:col-span-2">
              <label className="block text-slate-500 font-medium mb-1">Diagnosis Kerja Utama</label>
              <input
                type="text"
                value={dxUtama}
                onChange={(e) => setDxUtama(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Kode ICD-10</label>
              <input
                type="text"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-mono font-bold"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-slate-500 font-medium mb-1">Rencana Terapi, Tindakan & Monitoring</label>
              <textarea
                value={rencanaTerapi}
                onChange={(e) => setRencanaTerapi(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AsesmenKeperawatanTab({ patientData }: { patientData?: any }) {
  const [morseScore, setMorseScore] = useState(15);
  const [painScore, setPainScore] = useState(3);
  const [nutritionScore, setNutritionScore] = useState(0);

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Asesmen Awal Keperawatan Terpadu</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pengkajian risiko jatuh, skrining nyeri, status nutrisi & rencana asuhan keperawatan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morse Fall Scale */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wide text-amber-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Risiko Jatuh (Morse)
            </h3>
            <span className="font-bold text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              Skor: {morseScore}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Kategori: <strong>{morseScore >= 45 ? 'Risiko Tinggi' : morseScore >= 25 ? 'Risiko Sedang' : 'Risiko Rendah'}</strong>
          </p>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div>• Gelang identifikasi kuning dipasang</div>
            <div>• Pengaman tempat tidur terpasang</div>
          </div>
        </div>

        {/* Nyeri NRS */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wide text-rose-600 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4" /> Skrining Nyeri (NRS)
            </h3>
            <span className="font-bold text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
              Skor: {painScore}/10
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Intensitas: <strong>{painScore <= 3 ? 'Nyeri Ringan' : painScore <= 6 ? 'Nyeri Sedang' : 'Nyeri Berat'}</strong>
          </p>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div>• Lokasi: Kepala / Abdomen</div>
            <div>• Karakteristik: Tumpul / Berdenyut</div>
          </div>
        </div>

        {/* Skrining Nutrisi */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs uppercase tracking-wide text-emerald-600 flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Skrining Gizi (MST)
            </h3>
            <span className="font-bold text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              Skor: {nutritionScore}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Status: <strong>{nutritionScore >= 2 ? 'Berisiko Malnutrisi' : 'Tidak Berisiko'}</strong>
          </p>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div>• Penurunan BB 3 bln: Tidak ada</div>
            <div>• Asupan makan: Normal</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-200 dark:border-teal-800/60 space-y-2 text-xs">
        <h4 className="font-bold text-teal-900 dark:text-teal-200">Masalah & Rencana Asuhan Keperawatan (SDKI / SIKI)</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-teal-200 dark:border-teal-800/50">
            <span className="font-bold text-teal-700 dark:text-teal-300">1. Termoregulasi Tidak Efektif (D.0149)</span>
            <p className="text-[11px] text-slate-500 mt-1">Intervensi: Manajemen hipertermia, kompres hangat, monitor suhu tiap 4 jam.</p>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-teal-200 dark:border-teal-800/50">
            <span className="font-bold text-teal-700 dark:text-teal-300">2. Nyeri Akut (D.0077)</span>
            <p className="text-[11px] text-slate-500 mt-1">Intervensi: Teknik relaksasi napas dalam, kolaborasi analgetik sesuai order DPJP.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InformedConsentTab({ patientData, onOpenConsentModal }: { patientData?: any; onOpenConsentModal?: () => void }) {
  const consents = [
    {
      id: 'IC-001',
      tindakan: 'Pemasangan Kateter & Jalur Intravena (Infus)',
      dokter: 'dr. Budi Santoso, Sp.PD',
      pemberi: patientData?.nama || 'Pasien',
      tanggal: '30 Aug 2026 09:30',
      status: 'Disetujui'
    },
    {
      id: 'IC-002',
      tindakan: 'Pemeriksaan Diagnostik Radiologi dengan Kontras',
      dokter: 'dr. Sarah Wijaya, Sp.Rad',
      pemberi: patientData?.nama || 'Pasien',
      tanggal: '30 Aug 2026 11:00',
      status: 'Disetujui'
    }
  ];

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Persetujuan Tindakan Medis (Informed Consent)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Persetujuan khusus untuk tindakan invasif, anestesi & tindakan berisiko tinggi</p>
          </div>
        </div>

        {onOpenConsentModal && (
          <button
            onClick={onOpenConsentModal}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Persetujuan Tindakan Baru
          </button>
        )}
      </div>

      <div className="space-y-3">
        {consents.map((c) => (
          <div key={c.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{c.tindakan}</span>
                <span className="text-[10px] font-mono bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-bold px-2 py-0.5 rounded">
                  {c.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                DPJP: <strong>{c.dokter}</strong> • Pemberi Persetujuan: {c.pemberi} • {c.tanggal}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {c.status}
              </span>
              <PrintPDFButton
                filename={`Informed_Consent_${c.id}`}
                label="Cetak"
                className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LaporanOperasiTab({ patientData }: { patientData?: any }) {
  const isOperasi = patientData?.pelayanan_type === 'Operasi' || patientData?.tindakan_operasi;

  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Laporan Operasi & Pembedahan (OK)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Detail prosedur pembedahan, temuan intraoperatif, dan instruksi pasca-bedah</p>
          </div>
        </div>

        <PrintPDFButton
          filename={`Laporan_Operasi_${patientData?.no_rm || 'Pasien'}`}
          label="Cetak Laporan OK"
          className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl"
        />
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Nama Tindakan</span>
            <p className="font-bold text-slate-900 dark:text-white">{patientData?.tindakan_operasi || 'Apendektomi Laparoskopi'}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Dokter Operator</span>
            <p className="font-semibold text-slate-900 dark:text-white">{patientData?.dokter_operator || 'dr. Hendra Pratama, Sp.B'}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Dokter Anestesi</span>
            <p className="font-semibold text-slate-900 dark:text-white">{patientData?.dokter_anestesi || 'dr. Ratna Juwita, Sp.An'}</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Waktu Operasi</span>
            <p className="font-semibold text-slate-900 dark:text-white">09:00 - 10:45 WIB (105 mnt)</p>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
          <p><strong>Diagnosis Pre-Operasi:</strong> Appendicitis Acute (K35.8)</p>
          <p><strong>Diagnosis Pasca-Operasi:</strong> Appendicitis Suppurativa Tanpa Perforasi (K35.8)</p>
          <p><strong>Temuan Intra-Operatif:</strong> Appendix mengalami inflamasi hiperemis, panjang 8 cm, diameter 1.2 cm, eksudat seropurulen minimal.</p>
          <p><strong>Perdarahan:</strong> ± 30 cc, Transfusi: Tidak ada</p>
          <p><strong>Jaringan Dikirim ke PA:</strong> Ya (Spesimen Appendix)</p>
        </div>
      </div>
    </div>
  );
}

export function LaporanAnestesiTab({ patientData }: { patientData?: any }) {
  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Laporan & Pemantauan Anestesi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pengkajian pra-anestesi, pemantauan status fisik ASA, dan skor pemulihan (Aldrete)</p>
          </div>
        </div>

        <PrintPDFButton
          filename={`Laporan_Anestesi_${patientData?.no_rm || 'Pasien'}`}
          label="Cetak Anestesi"
          className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl"
        />
      </div>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Status Fisik ASA</span>
            <p className="font-bold text-purple-600 dark:text-purple-400">ASA II (Penyakit Sistemik Ringan)</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Jenis Anestesi</span>
            <p className="font-semibold text-slate-900 dark:text-white">General Anesthesia (Inhalasi + TIVA)</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Airway Management</span>
            <p className="font-semibold text-slate-900 dark:text-white">ETT No. 7.5 Cuff</p>
          </div>
          <div>
            <span className="text-slate-400 uppercase font-bold text-[10px]">Aldrete Score di PACU</span>
            <p className="font-bold text-emerald-600">9/10 (Siap Pindah Bangsal)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HasilPenunjangTab({ patientData }: { patientData: any }) {
  const [subTab, setSubTab] = useState<'lab' | 'rad'>('lab');
  return (
    <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
          <FlaskConical className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hasil Pemeriksaan Penunjang (LIS & RIS)</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Hasil Laboratorium Terpadu & Radiologi DICOM/PACS Terverifikasi</p>
        </div>
      </div>
      
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setSubTab('lab')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 ${
            subTab === 'lab'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" /> Laboratorium (LOINC)
        </button>
        <button
          onClick={() => setSubTab('rad')}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 ${
            subTab === 'rad'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" /> Radiologi & Imaging (DICOM)
        </button>
      </div>
      
      {subTab === 'lab' ? <LaboratoryTab patientData={patientData} /> : <RadiologyTab patientData={patientData} />}
    </div>
  );
}

export function DischargeSummaryTab({ patientData }: { patientData?: any }) {
  const resume = patientData?.resume_medis || {
    no_resume: `RES-${patientData?.no_rm || '001'}`,
    unit_pelayanan: patientData?.ruangan || patientData?.poli || 'Rawat Inap Bangsal',
    dokter_dpjp: patientData?.dokter_dpjp || 'dr. Budi Santoso, Sp.PD',
    diagnosis_primer: { kode_icd10: patientData?.problem_list?.[0]?.kode_icd10 || 'A90', nama: patientData?.diagnosa || 'Dengue Fever' },
    kondisi_pulang: 'Perbaikan Klinis / Sembuh'
  };

  const combinedData = {
    ...patientData,
    ...resume,
    isRawatInap: true,
    ruangan: patientData?.ruangan || 'Ruang Perawatan Rawat Inap',
    tipe_kunjungan: 'Rawat Inap'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <ResumeMedisTemplate data={combinedData} defaultMode="rawat_inap" />
    </div>
  );
}

