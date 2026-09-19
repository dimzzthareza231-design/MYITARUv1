import React, { useState } from 'react';
import { formatResumeMedisData, FormattedResumeMedis } from '../../utils/resumeTemplateHelper';
import { Printer, Copy, Check, FileText, ArrowRightLeft, Stethoscope, BedDouble } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface ResumeMedisTemplateProps {
  data?: any;
  forcedMode?: 'rawat_jalan' | 'rawat_inap' | 'konsolidasi';
  defaultMode?: 'auto' | 'rawat_jalan' | 'rawat_inap' | 'konsolidasi';
  hideControls?: boolean;
  className?: string;
  onPrint?: () => void;
}

export function ResumeMedisTemplate({
  data,
  forcedMode,
  defaultMode,
  hideControls = false,
  className = '',
  onPrint
}: ResumeMedisTemplateProps) {
  const toast = useToast();
  const [selectedMode, setSelectedMode] = useState<'rawat_jalan' | 'rawat_inap' | 'konsolidasi' | 'auto'>(defaultMode || 'auto');
  const [copied, setCopied] = useState(false);

  // Compute formatted resume data based on selected mode or forcedMode
  const effectiveMode = forcedMode || (selectedMode === 'auto' ? undefined : selectedMode);
  const resume: FormattedResumeMedis = formatResumeMedisData(data, effectiveMode);

  const handleCopy = () => {
    const text = `
RESUME MEDIS PASIEN (${resume.isRawatInap ? 'RAWAT INAP' : 'RAWAT JALAN'})

I. IDENTITAS PASIEN
Nama Pasien : ${resume.namaPasien}
No. Rekam Medis : ${resume.noRm}
Tanggal Lahir / Umur : ${resume.tglLahirUmur}
Jenis Kelamin : ${resume.jenisKelamin}
Alamat : ${resume.alamat}
Penanggung Biaya : ${resume.penanggungBiaya}

${resume.isRawatJalan ? `II. RINGKASAN RAWAT JALAN (POLIKLINIK)
Tanggal Kunjungan : ${resume.tglKunjungan}
Poliklinik : ${resume.poliklinik}
Keluhan Utama (Anamnesis) : ${resume.keluhanUtama}
Pemeriksaan Fisik Akhir : ${resume.pemeriksaanFisikAkhir}
Diagnosis Rawat Jalan : ${resume.diagnosisRawatJalan}
Alasan Alih Rawat (Inap) : ${resume.alasanAlihRawatInap}
` : ''}
${resume.isRawatInap ? `III. RINGKASAN RAWAT INAP (KONSOLIDASI)
Tanggal Masuk RS : ${resume.tglMasukRs} | Tanggal Keluar RS : ${resume.tglKeluarRs}
Ruang Rawat Terakhir : ${resume.ruangRawatTerakhir} | Lama Rawat Inap : ${resume.lamaRawatInap} Hari
Diagnosis Utama (Akhir) : ${resume.diagnosisUtamaAkhir} | Kode ICD-10 : ${resume.kodeIcd10Utama}
Diagnosis Sekunder / Komorbid : ${resume.diagnosisSekunderKomorbid} | Kode ICD-10 : ${resume.kodeIcd10Sekunder}
Hasil Pemeriksaan Penunjang : ${resume.hasilPemeriksaanPenunjang}
Tindakan Medis / Operasi : ${resume.tindakanMedisOperasi}
Perjalanan Penyakit / Evolusi : ${resume.perjalananPenyakitEvolusi}
Kondisi Saat Keluar RS : ${resume.kondisiSaatKeluarRs}
` : ''}
IV. RENCANA TINDAK LANJUT & INSTRUKSI PULANG
Terapi Obat Pulang : 
${resume.terapiObatPulang}
Instruksi / Diet / Edukasi : ${resume.instruksiDietEdukasi}
Jadwal Kontrol Kembali : ${resume.jadwalKontrolKembali}

${resume.kotaRs}, ${resume.tglDikeluarkan}
Pasien / Keluarga Pasien : ( ${resume.namaPasienKeluarga} )
Dokter DPJP : ( ${resume.namaDokterDpjp} ) - SIP: ${resume.sipDokter}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Resume Medis berhasil disalin ke clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* TOOLBAR KONTROL TAMPILAN RESUME */}
      {!hideControls && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pilih Format Resume:</span>
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSelectedMode('auto')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedMode === 'auto'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
                title="Deteksi otomatis berdasarkan jenis kunjungan/ruangan pasien"
              >
                Auto ({resume.isRawatInap ? 'Rawat Inap' : 'Rawat Jalan'})
              </button>
              <button
                onClick={() => setSelectedMode('rawat_jalan')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                  selectedMode === 'rawat_jalan'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Rawat Jalan (Poli)
              </button>
              <button
                onClick={() => setSelectedMode('rawat_inap')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                  selectedMode === 'rawat_inap'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <BedDouble className="w-3.5 h-3.5" />
                Rawat Inap (Bangsal)
              </button>
              <button
                onClick={() => setSelectedMode('konsolidasi')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-all ${
                  selectedMode === 'konsolidasi'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Konsolidasi (Keduanya)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : 'Salin Teks'}
            </button>
            <button
              onClick={onPrint || (() => window.print())}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Dokumen
            </button>
          </div>
        </div>
      )}

      {/* LEMBAR DOKUMEN RESUME MEDIS PASIEN (SESUAI TEMPLATE RESMI) */}
      <div 
        className="resume-medis-sheet bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-300 max-w-4xl mx-auto font-sans leading-relaxed text-[13px]"
        style={{ color: '#0f172a' }}
      >
        {/* JUDUL UTAMA */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-950 uppercase border-b-2 border-slate-900 inline-block pb-1">
            RESUME MEDIS PASIEN
          </h1>
          <p className="text-xs text-slate-600 font-bold uppercase tracking-widest mt-1">
            {resume.isRawatInap && !resume.isRawatJalan 
              ? 'RINGKASAN PELAYANAN RAWAT INAP (DISCHARGE SUMMARY)' 
              : !resume.isRawatInap && resume.isRawatJalan 
                ? 'RINGKASAN PELAYANAN RAWAT JALAN (POLIKLINIK)' 
                : 'RINGKASAN PELAYANAN TERPADU RAWAT JALAN & RAWAT INAP'}
          </p>
        </div>

        {/* I. IDENTITAS PASIEN */}
        <div className="mb-6">
          <div 
            className="px-3.5 py-1.5 font-black text-white text-xs sm:text-sm tracking-wider uppercase mb-3 rounded-xs"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            I. IDENTITAS PASIEN
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-[13px]">
            {/* Kolom Kiri */}
            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">Nama Pasien</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-semibold text-slate-900 uppercase">{resume.namaPasien}</span>
              </div>
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">Tanggal Lahir / Umur</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900">{resume.tglLahirUmur}</span>
              </div>
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">Alamat</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.alamat}</span>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">No. Rekam Medis</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-mono font-bold text-slate-900">{resume.noRm}</span>
              </div>
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">Jenis Kelamin</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900">{resume.jenisKelamin}</span>
              </div>
              <div className="flex">
                <span className="w-36 sm:w-40 font-bold text-slate-700 shrink-0">Penanggung Biaya</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-semibold text-slate-900">{resume.penanggungBiaya}</span>
              </div>
            </div>
          </div>
        </div>

        {/* II. RINGKASAN RAWAT JALAN (POLIKLINIK) - DITAMPILKAN JIKA PASIEN SEDANG RAWAT JALAN ATAU KONSOLIDASI */}
        {resume.isRawatJalan && (
          <div className="mb-6">
            <div 
              className="px-3.5 py-1.5 font-black text-white text-xs sm:text-sm tracking-wider uppercase mb-3 rounded-xs"
              style={{ backgroundColor: '#1e3a8a' }}
            >
              II. RINGKASAN RAWAT JALAN (POLIKLINIK)
            </div>

            <div className="space-y-2.5 text-xs sm:text-[13px]">
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Tanggal Kunjungan</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900">{resume.tglKunjungan}</span>
              </div>
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Poliklinik</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-semibold text-slate-900">{resume.poliklinik}</span>
              </div>
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Keluhan Utama (Anamnesis)</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.keluhanUtama}</span>
              </div>
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Pemeriksaan Fisik Akhir</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.pemeriksaanFisikAkhir}</span>
              </div>
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Diagnosis Rawat Jalan</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-slate-900">{resume.diagnosisRawatJalan}</span>
              </div>
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Alasan Alih Rawat (Inap)</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.alasanAlihRawatInap}</span>
              </div>
            </div>
          </div>
        )}

        {/* III. RINGKASAN RAWAT INAP (KONSOLIDASI) - DITAMPILKAN JIKA PASIEN SEDANG RAWAT INAP ATAU KONSOLIDASI */}
        {resume.isRawatInap && (
          <div className="mb-6">
            <div 
              className="px-3.5 py-1.5 font-black text-white text-xs sm:text-sm tracking-wider uppercase mb-3 rounded-xs"
              style={{ backgroundColor: '#1e3a8a' }}
            >
              III. RINGKASAN RAWAT INAP (KONSOLIDASI)
            </div>

            <div className="space-y-2.5 text-xs sm:text-[13px]">
              {/* Tanggal Masuk & Keluar RS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex">
                  <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Tanggal Masuk RS</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="text-slate-900">{resume.tglMasukRs}</span>
                </div>
                <div className="flex">
                  <span className="w-44 sm:w-48 font-bold text-slate-700 shrink-0">Tanggal Keluar RS</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="text-slate-900">{resume.tglKeluarRs}</span>
                </div>
              </div>

              {/* Ruang Rawat & Lama Rawat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex">
                  <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Ruang Rawat Terakhir</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="text-slate-900">{resume.ruangRawatTerakhir}</span>
                </div>
                <div className="flex">
                  <span className="w-44 sm:w-48 font-bold text-slate-700 shrink-0">Lama Rawat Inap</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="font-semibold text-slate-900">{resume.lamaRawatInap} Hari</span>
                </div>
              </div>

              {/* Diagnosis Utama & Kode ICD-10 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex">
                  <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Diagnosis Utama (Akhir)</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="font-bold text-slate-900">{resume.diagnosisUtamaAkhir}</span>
                </div>
                <div className="flex">
                  <span className="w-44 sm:w-48 font-bold text-slate-700 shrink-0">Kode ICD-10</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {resume.kodeIcd10Utama}
                  </span>
                </div>
              </div>

              {/* Diagnosis Sekunder & Kode ICD-10 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="flex">
                  <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Diagnosis Sekunder / Komorbid</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="text-slate-900">{resume.diagnosisSekunderKomorbid}</span>
                </div>
                <div className="flex">
                  <span className="w-44 sm:w-48 font-bold text-slate-700 shrink-0">Kode ICD-10</span>
                  <span className="mr-2 font-bold">:</span>
                  <span className="font-mono text-slate-700">
                    {resume.kodeIcd10Sekunder}
                  </span>
                </div>
              </div>

              {/* Hasil Pemeriksaan Penunjang */}
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Hasil Pemeriksaan Penunjang</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.hasilPemeriksaanPenunjang}</span>
              </div>

              {/* Tindakan Medis / Operasi */}
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Tindakan Medis / Operasi</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.tindakanMedisOperasi}</span>
              </div>

              {/* Perjalanan Penyakit / Evolusi */}
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Perjalanan Penyakit / Evolusi</span>
                <span className="mr-2 font-bold">:</span>
                <span className="text-slate-900 leading-snug">{resume.perjalananPenyakitEvolusi}</span>
              </div>

              {/* Kondisi Saat Keluar RS */}
              <div className="flex">
                <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Kondisi Saat Keluar RS</span>
                <span className="mr-2 font-bold">:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                  {resume.kondisiSaatKeluarRs}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* IV. RENCANA TINDAK LANJUT & INSTRUKSI PULANG */}
        <div className="mb-8">
          <div 
            className="px-3.5 py-1.5 font-black text-white text-xs sm:text-sm tracking-wider uppercase mb-3 rounded-xs"
            style={{ backgroundColor: '#1e3a8a' }}
          >
            IV. RENCANA TINDAK LANJUT & INSTRUKSI PULANG
          </div>

          <div className="space-y-3 text-xs sm:text-[13px]">
            {/* Terapi Obat Pulang */}
            <div className="flex items-start">
              <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Terapi Obat Pulang</span>
              <span className="mr-2 font-bold">:</span>
              <div className="text-slate-900 whitespace-pre-line leading-relaxed font-medium bg-slate-50/80 p-2.5 rounded border border-slate-200 w-full">
                {resume.terapiObatPulang}
              </div>
            </div>

            {/* Instruksi / Diet / Edukasi */}
            <div className="flex">
              <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Instruksi / Diet / Edukasi</span>
              <span className="mr-2 font-bold">:</span>
              <span className="text-slate-900 leading-snug">{resume.instruksiDietEdukasi}</span>
            </div>

            {/* Jadwal Kontrol Kembali */}
            <div className="flex">
              <span className="w-48 sm:w-56 font-bold text-slate-700 shrink-0">Jadwal Kontrol Kembali</span>
              <span className="mr-2 font-bold">:</span>
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {resume.jadwalKontrolKembali}
              </span>
            </div>
          </div>
        </div>

        {/* TANDA TANGAN & PENGESAHAN DOKTER & PASIEN */}
        <div className="pt-4 border-t border-slate-200 mt-8">
          <div className="text-right text-xs text-slate-600 mb-4">
            <span>{resume.kotaRs}</span>, <span>{resume.tglDikeluarkan}</span>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center text-xs sm:text-[13px]">
            {/* Pasien / Keluarga */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-slate-800 mb-16">Pasien / Keluarga Pasien</p>
              <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[200px]">
                ( {resume.namaPasienKeluarga} )
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Tanda Tangan & Nama Jelas</p>
            </div>

            {/* Dokter DPJP */}
            <div className="flex flex-col items-center">
              <p className="font-bold text-slate-800 mb-16">Dokter Penanggung Jawab Pelayanan (DPJP)</p>
              <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[200px]">
                ( {resume.namaDokterDpjp} )
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tanda Tangan & Nama Jelas / SIP: {resume.sipDokter}
              </p>
            </div>
          </div>
        </div>

        {/* DISCLAIMER / VALIDASI HUKUM RESUME MEDIS */}
        <div className="mt-12 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 italic">
          This is for informational purposes only. For medical advice or diagnosis, consult a professional. AI responses may include mistakes.
        </div>
      </div>
    </div>
  );
}
