import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useHospital } from '../../contexts/HospitalContext';
import { 
  HospitalDocumentModel, 
  AllergyItem,
  TableItemRow
} from '../../types/document';
import { formatResumeMedisData } from '../../utils/resumeTemplateHelper';
import { 
  ShieldCheck, AlertTriangle, Stethoscope, Pill, 
  FlaskConical, CheckCircle2, DollarSign, 
  Hospital, Award, Clock, ArrowRight, User, Sparkles
} from 'lucide-react';

interface HospitalDocumentSheetProps {
  document: HospitalDocumentModel;
  watermark?: boolean;
}

export function HospitalDocumentSheet({ document, watermark = true }: HospitalDocumentSheetProps) {
  const { hospitalSettings } = useHospital();
  const hospital = document.hospitalInfo || hospitalSettings;
  const { subject, signer } = document;
  const todayStr = signer.tanggal || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const hospitalInitials = hospital.name
    .split(' ')
    .filter((word: string) => word.length > 0)
    .map((word: string) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const cityStr = signer.kota || hospital.city || 'Jakarta Selatan';

  const formatGender = (g?: string) => {
    if (!g) return '-';
    if (g === 'L' || g.toLowerCase() === 'laki-laki' || g.toLowerCase() === 'l') return 'Laki-laki (L)';
    if (g === 'P' || g.toLowerCase() === 'perempuan' || g.toLowerCase() === 'p') return 'Perempuan (P)';
    return g;
  };

  const validationCode = signer.digitalValidationCode || `VERIF-${document.nomorDokumen || '2026-MED'}-${Math.floor(1000 + Math.random() * 9000)}`;
  const qrValue = signer.qrData || `https://myitaru-simrs.id/verify-document?doc=${encodeURIComponent(document.nomorDokumen)}&signer=${encodeURIComponent(signer.nama)}&val=${validationCode}`;

  // Process Allergy list
  const allergies: AllergyItem[] = Array.isArray(document.riwayatAlergi) 
    ? document.riwayatAlergi 
    : typeof document.riwayatAlergi === 'string'
      ? [{ tipe: 'Umum', alergen: document.riwayatAlergi, reaksi: 'Reaksi alergi', derajat: 'Sedang' }]
      : [];

  // Helper: Header / Kop Surat Klinik
  const renderHeader = (customBadge?: string, customSub?: string) => (
    <header className="relative z-10 pb-3 border-b-2 border-slate-900 mb-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {(hospital as any).logoUrl ? (
            <img src={(hospital as any).logoUrl} alt="Logo Klinik" className="w-16 h-16 object-contain shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col items-center justify-center text-white font-black text-xl tracking-tighter shadow-md border border-blue-800 shrink-0">
              <span className="text-cyan-400 text-lg leading-none">{hospitalInitials}</span>
              <span className="text-[8px] font-mono tracking-widest text-slate-300 uppercase mt-0.5">HOSPITAL</span>
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase leading-none">
              {hospital.name}
            </h1>
            <p className="text-xs font-bold text-blue-900 tracking-wider uppercase mt-1">
              {customSub || hospital.subname || 'KLINIK UTAMA & RUMAH SAKIT PENDIDIKAN TARUMANAGARA'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
              {hospital.address}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Telp: <span className="font-semibold text-slate-700">{hospital.phone}</span> | Email: <span className="font-semibold text-slate-700">{hospital.email}</span> | Web: <span className="font-semibold text-slate-700">{hospital.website}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded">
            {customBadge || hospital.accreditation || 'TERAKREDITASI PARIPURNA'}
          </span>
          <span className="text-[9px] font-mono text-slate-500 mt-1">
            Permenkes RI No. 24 / 2022
          </span>
          <span className="text-[9px] text-slate-400 font-mono">
            SatuSehat Integrated HIS
          </span>
        </div>
      </div>
      <div className="w-full h-0.5 bg-slate-900 mt-2.5" />
      <div className="w-full h-px bg-slate-400 mt-0.5" />
    </header>
  );

  // Helper: Footer & Legal Certification
  const renderFooter = (customRole?: string, signerName?: string, signerSip?: string) => (
    <footer className="relative z-10 mt-8 pt-4 border-t-2 border-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
        {/* DIGITAL SIGNATURE VALIDATION BADGE */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg w-full sm:w-auto">
          <div className="p-1.5 bg-white border border-slate-300 rounded shrink-0">
            <QRCodeSVG value={qrValue} size={64} level="M" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-emerald-800 font-black text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              DOKUMEN RESMI TERSERTIFIKASI KEMENKES RI
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Dokumen elektronik sah & tersimpan permanen di cloud SIMRS MYITARU & SatuSehat.
            </p>
            <p className="text-[9px] font-mono text-slate-500 mt-0.5">
              ID Validasi: <span className="font-bold text-slate-800">{validationCode}</span>
            </p>
          </div>
        </div>

        {/* DOKTER / PENANGGUNG JAWAB */}
        <div className="text-right w-full sm:w-72">
          <p className="text-slate-700">
            {cityStr}, {todayStr}
          </p>
          <p className="font-bold text-slate-900 mt-0.5 text-xs">
            {customRole || signer.jabatan || 'Dokter Penanggung Jawab Pelayanan (DPJP),'}
          </p>

          <div className="my-2 inline-block px-3 py-1 bg-blue-50/90 border border-blue-300 rounded text-[9px] font-mono text-blue-900 font-bold tracking-wider">
            [ SIGNED & ENCRYPTED DIGITALLY ]
          </div>

          <p className="font-black text-slate-950 underline text-sm">
            {signerName || signer.nama}
          </p>
          {signer.gelar && (
            <p className="text-[11px] font-semibold text-blue-900">
              Spesialisasi: {signer.gelar}
            </p>
          )}
          {(signerSip || signer.sip_nip) && (
            <p className="text-[10px] font-mono text-slate-600 mt-0.5">
              {signerSip || signer.sip_nip}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400 leading-snug">
        <p>
          Dokumen ini merupakan Rekam Medis Elektronik (RME) resmi yang diterbitkan oleh Sistem Informasi Manajemen Rumah Sakit (MYITARU SIMRS).
        </p>
        <p>
          Sah dan berkekuatan hukum penuh tanpa tanda tangan basah sesuai UU ITE No. 11/2008 & Permenkes RI No. 24/2022 tentang Rekam Medis Elektronik.
        </p>
      </div>
    </footer>
  );

  // Helper Watermark Wrapper
  const renderWatermark = () => watermark ? (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
      style={{ opacity: 0.03 }}
    >
      <div className="transform -rotate-45 text-center">
        <p className="text-8xl font-black tracking-widest text-slate-900">KLINIK TARUMANAGARA</p>
        <p className="text-4xl font-bold tracking-widest text-slate-800 uppercase mt-2">OFFICIAL ELECTRONIC MEDICAL RECORD</p>
        <p className="text-2xl font-mono text-slate-700 mt-1">PERMENKES NO. 24 TAHUN 2022</p>
      </div>
    </div>
  ) : null;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '860px',
    minHeight: '1100px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#0f172a'
  };

  // =========================================================================
  // 1. DEDICATED TEMPLATE: RESUME MEDIS (RAWAT JALAN / RAWAT INAP)
  // Sesuai Standar Template Permenkes No. 24/2022
  // =========================================================================
  if (document.type === 'resume_medis') {
    const rawData = document.rawRecord || {
      ...document.subject,
      nama_pasien: document.subject?.nama,
      no_rm: document.subject?.no_rm,
      penjamin: document.subject?.penjamin,
      ...document
    };
    const resume = formatResumeMedisData(rawData);

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader()}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-0.5">
            {resume.isRawatInap ? 'RESUME MEDIS PASIEN PULANG (DISCHARGE SUMMARY)' : 'RESUME MEDIS RAWAT JALAN (POLIKLINIK)'}
          </h2>
          <p className="text-[11px] font-semibold text-slate-600 mt-0.5 uppercase tracking-wide">
            STANDAR BAKU REKAM MEDIS ELEKTRONIK (PERMENKES NO. 24 TAHUN 2022)
          </p>
          <div className="flex justify-center items-center gap-4 text-[11px] font-mono text-slate-700 mt-1">
            <span>No. Dokumen: <strong className="text-slate-950 font-bold">{document.nomorDokumen}</strong></span>
            <span>•</span>
            <span>Tgl Resume: <strong className="text-slate-950 font-bold">{resume.tglDikeluarkan}</strong></span>
          </div>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed">
          {/* I. Identitas Pasien */}
          <section className="bg-slate-50/90 p-3.5 rounded-lg border border-slate-300">
            <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-900" />
                I. IDENTITAS PASIEN
              </span>
              <span className="text-[10px] font-mono font-bold text-blue-900">
                No. RM: {resume.noRm}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Nama Lengkap Pasien</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-black text-slate-950 uppercase">{resume.namaPasien}</span></div>
              <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Nomor Rekam Medis</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-mono font-bold text-slate-900">{resume.noRm}</span></div>
              <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Tgl Lahir / Usia</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{resume.tglLahirUmur}</span></div>
              <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Jenis Kelamin</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{formatGender(resume.jenisKelamin)}</span></div>
              <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700 shrink-0">Alamat Tempat Tinggal</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{resume.alamat}</span></div>
              <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Penanggung Biaya</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-semibold text-slate-900">{resume.penanggungBiaya}</span></div>
            </div>
          </section>

          {/* II. Ringkasan Pelayanan */}
          <section className="bg-white p-3.5 rounded-lg border border-slate-300 space-y-3">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1 border-b border-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              {resume.isRawatInap ? 'II. RINGKASAN RAWAT INAP (KONSOLIDASI)' : 'II. RINGKASAN RAWAT JALAN (POLIKLINIK)'}
            </h3>

            {resume.isRawatInap ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-900">
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Tgl Masuk RS:</span><span className="font-bold">{resume.tglMasukRs}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Tgl Keluar RS:</span><span className="font-bold">{resume.tglKeluarRs}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Ruang Rawat Terakhir:</span><span className="font-bold">{resume.ruangRawatTerakhir}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Lama Rawat:</span><span className="font-bold">{resume.lamaRawatInap}</span></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-900">
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Tgl Kunjungan:</span><span className="font-bold">{resume.tglKunjungan}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700 block text-[10px]">Poliklinik Tujuan:</span><span className="font-bold">{resume.poliklinik}</span></div>
              </div>
            )}

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Keluhan Utama & Anamnesis:</span>
              <p className="p-2.5 bg-slate-50/70 rounded border border-slate-200 text-slate-900">{resume.keluhanUtama}</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Pemeriksaan Fisik Akhir:</span>
              <p className="p-2.5 bg-slate-50/70 rounded border border-slate-200 text-slate-900 font-mono text-[11px]">{resume.pemeriksaanFisikAkhir}</p>
            </div>

            {/* Diagnosis */}
            <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200 space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 block">Diagnosis Utama Akhir:</span>
                  <p className="text-sm font-black text-blue-950">{resume.diagnosisUtamaAkhir || resume.diagnosisRawatJalan}</p>
                </div>
                {resume.kodeIcd10Utama && (
                  <span className="px-2 py-0.5 bg-blue-900 text-white font-mono font-bold text-xs rounded">
                    ICD-10: {resume.kodeIcd10Utama}
                  </span>
                )}
              </div>
              {resume.diagnosisSekunderKomorbid && (
                <div className="pt-1.5 border-t border-blue-200/70 text-[11px]">
                  <span className="font-bold text-slate-700">Diagnosis Sekunder / Komorbid: </span>
                  <span className="text-slate-900">{resume.diagnosisSekunderKomorbid}</span>
                  {resume.kodeIcd10Sekunder && <span className="ml-1 text-slate-600 font-mono">({resume.kodeIcd10Sekunder})</span>}
                </div>
              )}
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Hasil Pemeriksaan Penunjang (Lab, Radiologi, EKG):</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-[11px]">{resume.hasilPemeriksaanPenunjang}</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Tindakan Medis / Prosedur Terapi:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-[11px]">{resume.tindakanMedisOperasi}</p>
            </div>
          </section>

          {/* III. Rencana Tindak Lanjut & Instruksi Pulang */}
          <section className="bg-slate-50/90 p-3.5 rounded-lg border border-slate-300 space-y-2.5">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1 border-b border-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-emerald-800 inline-block rounded-xs" />
              III. RENCANA TINDAK LANJUT & INSTRUKSI PULANG
            </h3>
            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Terapi Obat Pulang (E-Prescribing):</span>
              <p className="p-2 bg-white rounded border border-slate-200 text-slate-900 font-mono text-[11px] whitespace-pre-line">{resume.terapiObatPulang}</p>
            </div>
            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Instruksi Diet & Edukasi Perawatan:</span>
              <p className="p-2 bg-white rounded border border-slate-200 text-slate-800 text-[11px] whitespace-pre-line">{resume.instruksiDietEdukasi}</p>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-950">
              <span className="font-bold block text-[11px]">Jadwal Kontrol Kembali:</span>
              <p className="font-bold text-xs mt-0.5">{resume.jadwalKontrolKembali}</p>
            </div>
          </section>

          {/* Pengesahan Dua Pihak (Pasien & DPJP) */}
          <div className="mt-8 pt-4 border-t-2 border-slate-900">
            <div className="text-right text-xs mb-4">
              <p className="text-slate-700">{resume.kotaRs}, {resume.tglDikeluarkan}</p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center text-xs sm:text-[13px]">
              <div className="flex flex-col items-center">
                <p className="font-bold text-slate-800 mb-14">Pasien / Keluarga Pasien</p>
                <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[200px]">( {resume.namaPasienKeluarga} )</p>
                <p className="text-[11px] text-slate-500 mt-1">Tanda Tangan & Nama Jelas</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-bold text-slate-800 mb-14">Dokter Penanggung Jawab Pelayanan (DPJP)</p>
                <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[200px]">( {resume.namaDokterDpjp} )</p>
                <p className="text-[11px] text-slate-500 mt-1">SIP: {resume.sipDokter}</p>
              </div>
            </div>
          </div>
        </main>

        <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 italic">
          Dokumen ini merupakan Resume Medis resmi sesuai Permenkes No. 24 Tahun 2022.
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. DEDICATED TEMPLATE: SURAT KETERANGAN ISTIRAHAT SAKIT (DOKTER)
  // =========================================================================
  if (document.type === 'surat_keterangan_sakit') {
    const sData = document.suratSakit || {
      lamaHari: 3,
      terhitungMulai: subject.tgl_periksa || todayStr,
      terhitungSampai: todayStr,
      anjuranMedis: 'Tirah baring (bed rest) cukup, hindari aktivitas fisik berat, minum obat teratur.',
      pekerjaan: subject.pekerjaan || '-'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SURAT KETERANGAN MEDIS RESMI', 'INSTALASI PELAYANAN MEDIK & RAWAT JALAN')}

        <div className="relative z-10 text-center my-6">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            SURAT KETERANGAN ISTIRAHAT SAKIT
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Nomor: <strong className="text-slate-950">{document.nomorDokumen}</strong>
          </p>
        </div>

        <main className="relative z-10 space-y-6 text-sm leading-relaxed text-slate-800">
          <p className="text-justify">
            Yang bertanda tangan di bawah ini, Dokter Pemeriksa pada <strong>{hospital.name}</strong>, menerangkan dengan sesungguhnya bahwa:
          </p>

          {/* Data Pasien */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-300 space-y-2 text-xs">
            <div className="flex"><span className="w-40 font-bold text-slate-700">Nama Lengkap Pasien</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Nomor Rekam Medis (RM)</span><span className="mr-2">:</span><span className="font-mono font-bold text-slate-900">{subject.no_rm || '-'}</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Nomor Induk (NIK)</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Tempat, Tgl Lahir / Usia</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tempat_lahir ? `${subject.tempat_lahir}, ` : ''}{subject.tgl_lahir} ({subject.umur || '-'} Tahun)</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Jenis Kelamin</span><span className="mr-2">:</span><span className="text-slate-900">{formatGender(subject.jenis_kelamin)}</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Pekerjaan / Instansi</span><span className="mr-2">:</span><span className="text-slate-900">{sData.pekerjaan || subject.pekerjaan || '-'}</span></div>
            <div className="flex"><span className="w-40 font-bold text-slate-700">Alamat Lengkap</span><span className="mr-2">:</span><span className="text-slate-900">{subject.alamat_ktp || subject.alamat || '-'}</span></div>
          </div>

          <p className="text-justify leading-relaxed">
            Berdasarkan hasil pemeriksaan klinis yang telah dilakukan secara teliti pada hari ini di <strong>{subject.unit_pelayanan || 'Poliklinik Spesialis'}</strong>, pasien tersebut dinyatakan dalam keadaan <strong>SAKIT</strong> dan memerlukan istirahat medis selama:
          </p>

          <div className="text-center p-4 bg-blue-50/90 border-2 border-blue-900 rounded-xl my-4">
            <p className="text-2xl font-black text-blue-950 uppercase">
              {sData.lamaHari} ({sData.lamaHari === 1 ? 'Satu' : sData.lamaHari === 2 ? 'Dua' : sData.lamaHari === 3 ? 'Tiga' : sData.lamaHari === 4 ? 'Empat' : sData.lamaHari === 5 ? 'Lima' : sData.lamaHari === 7 ? 'Tujuh' : sData.lamaHari}) Hari
            </p>
            <p className="text-xs font-bold text-blue-900 mt-1">
              Terhitung mulai tanggal <span className="underline">{sData.terhitungMulai}</span> s/d <span className="underline">{sData.terhitungSampai}</span>
            </p>
          </div>

          {document.diagnosisUtama && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-0.5">Diagnosa Klinis:</span>
              <p className="font-semibold text-slate-900">{document.diagnosisUtama.nama} {document.diagnosisUtama.kode ? `(ICD-10: ${document.diagnosisUtama.kode})` : ''}</p>
            </div>
          )}

          <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-950">
            <span className="font-bold block mb-0.5">Anjuran & Instruksi Medis:</span>
            <p className="leading-relaxed">{sData.anjuranMedis || document.edukasiInstruksi}</p>
          </div>

          <p className="text-xs text-slate-600 italic">
            Demikian surat keterangan ini diberikan dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya dan sesuai ketentuan yang berlaku.
          </p>
        </main>

        {renderFooter('Dokter Pemeriksa,', signer.nama, signer.sip_nip)}
      </div>
    );
  }

  // =========================================================================
  // 3. DEDICATED TEMPLATE: SURAT KETERANGAN KESEHATAN JASMANI
  // =========================================================================
  if (document.type === 'surat_keterangan_sehat') {
    const sData = document.suratSehat || {
      keperluan: 'Persyaratan Administrasi Pekerjaan / Melamar Pekerjaan',
      visusMataOD: '6/6',
      visusMataOS: '6/6',
      butaWarna: 'Normal (Tidak Buta Warna)',
      pendengaran: 'Normal (Bilateral)',
      gigiMulut: 'Kebersihan Baik, Karies Negatif',
      skriningNarkoba: 'Negatif (Bebas Narkoba / Napza)',
      kesimpulanFisik: 'SEHAT JASMANI / FIT UNTUK BEKERJA',
      masaBerlaku: '1 (Satu) Bulan sejak diterbitkan'
    };
    const vit = document.pemeriksaanFisik?.tandaVital;

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SURAT KETERANGAN SEHAT JASMANI', 'INSTALASI MEDICAL CHECK UP & PEMERIKSAAN KESEHATAN')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            SURAT KETERANGAN KESEHATAN JASMANI
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Nomor: <strong className="text-slate-950">{document.nomorDokumen}</strong>
          </p>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          <p>
            Dokter Pemeriksa pada <strong>{hospital.name}</strong> menerangkan bahwa telah memeriksa fisik secara teliti terhadap:
          </p>

          {/* Data Pemohon */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700">Nama Lengkap</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. RM / NIK</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.no_rm || '-'} / {subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tempat, Tgl Lahir / Usia</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tempat_lahir ? `${subject.tempat_lahir}, ` : ''}{subject.tgl_lahir} ({subject.umur || '-'} Thn)</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Jenis Kelamin / Gol Darah</span><span className="mr-2">:</span><span className="text-slate-900">{formatGender(subject.jenis_kelamin)} / <strong className="text-rose-700">{subject.golongan_darah || '-'}</strong></span></div>
            <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700">Alamat Tempat Tinggal</span><span className="mr-2">:</span><span className="text-slate-900">{subject.alamat_ktp || subject.alamat || '-'}</span></div>
          </div>

          {/* Tabel Pengukuran Fisik & Tanda Vital */}
          <div className="bg-white p-3 rounded-lg border border-slate-300 space-y-2">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              A. HASIL PENGUKURAN FISIK & TANDA VITAL
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Tinggi / Berat Badan</span>
                <span className="font-bold text-slate-900">{vit?.tb || '170'} cm / {vit?.bb || '68'} kg</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">IMT & Kategori</span>
                <span className="font-bold text-slate-900">{vit?.imt || '23.5'} ({vit?.kategoriImt || 'Normal'})</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Tekanan Darah</span>
                <span className="font-bold text-slate-900">{vit?.tekananDarah || '120/80 mmHg'}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">Nadi / RR / Suhu</span>
                <span className="font-bold text-slate-900">{vit?.nadi || '80'} / {vit?.rr || '18'} / {vit?.suhu || '36.5°C'}</span>
              </div>
            </div>
          </div>

          {/* Pemeriksaan Organ & Sensorik */}
          <div className="bg-white p-3 rounded-lg border border-slate-300 space-y-2">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              B. PEMERIKSAAN FUNGSI SENSORIK & ORGAN
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700">Tajam Penglihatan (Visus)</span><span>OD: {sData.visusMataOD || '6/6'} | OS: {sData.visusMataOS || '6/6'}</span></div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700">Tes Buta Warna (Ishihara)</span><span className="font-bold text-emerald-800">{sData.butaWarna || 'Normal'}</span></div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700">Pendengaran & THT</span><span>{sData.pendengaran || 'Normal (Bilateral)'}</span></div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-200"><span className="font-bold text-slate-700">Kesehatan Gigi & Mulut</span><span>{sData.gigiMulut || 'Baik'}</span></div>
              <div className="flex justify-between p-1.5 bg-slate-50 rounded border border-slate-200 sm:col-span-2"><span className="font-bold text-slate-700">Skrining Bebas Narkoba / Napza</span><span className="font-bold text-emerald-800">{sData.skriningNarkoba || 'Negatif (Bebas Narkoba)'}</span></div>
            </div>
          </div>

          {/* Kesimpulan */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-800 rounded-xl text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">KESIMPULAN PEMERIKSAAN MEDIS:</span>
            <p className="text-base font-black text-emerald-950 mt-1 uppercase">
              {sData.kesimpulanFisik || 'SEHAT JASMANI / TIDAK DITEMUKAN KELAINAN FISIK BERMAKNA'}
            </p>
            <p className="text-xs text-emerald-800 mt-1">
              Surat keterangan ini diterbitkan untuk keperluan: <strong>{sData.keperluan}</strong>
            </p>
            <p className="text-[10px] font-mono text-emerald-700 mt-1">
              Masa Berlaku: {sData.masaBerlaku}
            </p>
          </div>
        </main>

        {renderFooter('Dokter Pemeriksa MCU,', signer.nama, signer.sip_nip)}
      </div>
    );
  }

  // =========================================================================
  // 4. DEDICATED TEMPLATE: SURAT RUJUKAN PASIEN (FKTL)
  // =========================================================================
  if (document.type === 'surat_rujukan') {
    const rData = document.suratRujukan || {
      faskesTujuan: 'RSUP Nasional Dr. Cipto Mangunkusumo (RSCM)',
      poliTujuan: 'Poliklinik Spesialis Saraf (Neurologi)',
      dokterTujuan: 'Dokter Spesialis Saraf Konsultan',
      alasanRujukan: 'Mohon evaluasi dan tata laksana diagnostik lanjutan VNG / MRI Kepala.',
      terapiTindakanDiberikan: 'Manuver Epley 1x, Betahistine 24mg 2x1 tab, Mecobalamin 500mcg 3x1.',
      fasilitasTransportasi: 'Kendaraan Pribadi / Ambulans Standar',
      pendamping: 'Keluarga Pasien'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('SURAT RUJUKAN RESMI FASILITAS KESEHATAN', 'PELAYANAN RUJUKAN ANTAR FASILITAS KESEHATAN (FKTP / FKTL)')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            SURAT RUJUKAN FASILITAS PELAYANAN KESEHATAN
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Nomor Rujukan: <strong className="text-slate-950">{document.nomorDokumen}</strong>
          </p>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          {/* Faskes Tujuan */}
          <div className="p-3 bg-blue-50/90 border border-blue-300 rounded-lg">
            <span className="font-bold text-blue-900 text-[11px] block">Kepada Yth. Teman Sejawat:</span>
            <p className="text-sm font-black text-blue-950">{rData.dokterTujuan || 'Dokter Spesialis Konsulen'}</p>
            <p className="text-xs font-bold text-blue-900">{rData.poliTujuan} — <span className="underline">{rData.faskesTujuan}</span></p>
          </div>

          <p>
            Mohon pemeriksaan dan tata laksana lanjutan terhadap pasien dengan data klinis sebagai berikut:
          </p>

          {/* Data Pasien */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700">Nama Pasien</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. RM / NIK</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.no_rm || '-'} / {subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tgl Lahir / Usia</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tgl_lahir} ({subject.umur || '-'} Tahun) / {formatGender(subject.jenis_kelamin)}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Penjamin / No. BPJS</span><span className="mr-2">:</span><span className="font-bold text-slate-900">{subject.penjamin || 'Umum'} {subject.no_kartu_bpjs ? `(${subject.no_kartu_bpjs})` : ''}</span></div>
            <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700">Alamat Tempat Tinggal</span><span className="mr-2">:</span><span className="text-slate-900">{subject.alamat_ktp || subject.alamat || '-'}</span></div>
          </div>

          {/* Ringkasan Klinis */}
          <div className="bg-white p-3 rounded-lg border border-slate-300 space-y-2">
            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">1. Anamnesis & Keluhan:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">{document.anamnesis || document.keluhanUtama}</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">2. Tanda Vital & Pemeriksaan Fisik:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 font-mono text-[11px]">
                TD: {document.pemeriksaanFisik?.tandaVital?.tekananDarah || '120/80 mmHg'}, Nadi: {document.pemeriksaanFisik?.tandaVital?.nadi || '80 bpm'}, RR: {document.pemeriksaanFisik?.tandaVital?.rr || '18 x/m'}, Suhu: {document.pemeriksaanFisik?.tandaVital?.suhu || '36.5°C'}. {document.pemeriksaanFisik?.catatanFisik || ''}
              </p>
            </div>

            <div className="p-2.5 bg-blue-50 rounded border border-blue-200">
              <span className="text-[10px] font-bold text-blue-900 uppercase block">3. Diagnosis Kerja:</span>
              <p className="font-black text-blue-950 text-sm">{document.diagnosisUtama?.nama} {document.diagnosisUtama?.kode ? `(ICD-10: ${document.diagnosisUtama?.kode})` : ''}</p>
            </div>

            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">4. Terapi / Tindakan yang Telah Diberikan di Faskes Asal:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">{rData.terapiTindakanDiberikan}</p>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-950">
              <span className="font-bold block text-[11px]">5. Alasan Rujukan:</span>
              <p className="font-semibold text-xs mt-0.5">{rData.alasanRujukan}</p>
            </div>
          </div>

          <p className="text-[11px] text-slate-600">
            Atas kesediaan teman sejawat merawat dan memberikan penanganan terbaik kepada pasien ini, kami sampaikan terima kasih sebesar-besarnya.
          </p>
        </main>

        {renderFooter('Dokter DPJP Pengirim,', signer.nama, signer.sip_nip)}
      </div>
    );
  }

  // =========================================================================
  // 5. DEDICATED TEMPLATE: RESEP ELEKTRONIK & SALINAN RESEP DOKTER
  // =========================================================================
  if (document.type === 'resep_obat') {
    const rData = document.resepData || {
      iterasi: 'Iter 1x',
      telaahApoteker: {
        kesesuaianDosis: true,
        duplikasiObat: false,
        interaksiObatAman: true,
        alergiAman: true,
        namaApoteker: 'apt. Nurul Aini, S.Farm',
        sipaApoteker: 'SIPA: 19890412/SIPA-3174/2023'
      },
      instruksiKhususApotek: 'Simpan di tempat kering dan sejuk (< 30°C).'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('LEMBAR RESEP ELEKTRONIK (E-PRESCRIPTION)', 'INSTALASI FARMASI & PELAYANAN OBAT KLINIK')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            LEMBAR RESEP ELEKTRONIK (E-PRESCRIPTION)
          </h2>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-600 mt-1">
            <span>No. Resep: <strong className="text-slate-950">{document.nomorDokumen}</strong></span>
            <span>•</span>
            <span>Tgl Resep: <strong className="text-slate-950">{subject.tgl_periksa || todayStr}</strong></span>
            <span>•</span>
            <span className="font-bold text-blue-900">{rData.iterasi}</span>
          </div>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          {/* Header Identitas Dokter & Pasien */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Dokter Penulis Resep:</span>
              <p className="font-black text-slate-950 text-sm">{subject.dokter_dpjp || signer.nama}</p>
              <p className="text-[11px] text-blue-900 font-bold">{subject.unit_pelayanan || 'Poliklinik Spesialis'}</p>
              <p className="text-[10px] font-mono text-slate-600 mt-0.5">{signer.sip_nip || 'SIP: 503/SIP-DS/DKS/2022'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Data Pasien Penerima:</span>
              <p className="font-black text-slate-950 text-sm uppercase">{subject.nama}</p>
              <p className="text-[11px] text-slate-700">No. RM: <strong>{subject.no_rm}</strong> | Usia: {subject.umur || '-'} Thn | BB: {document.pemeriksaanFisik?.tandaVital?.bb || '68'} kg</p>
              <p className="text-[10px] text-slate-600">Penjamin: {subject.penjamin || 'Umum'}</p>
            </div>
          </div>

          {/* Safety Alert Alergi Obat */}
          {allergies.length > 0 && (
            <div className="p-2.5 bg-rose-50 border-2 border-rose-400 rounded-lg flex items-center gap-2 text-rose-950">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-black text-[11px] block">PERINGATAN ALERGI OBAT PASIEN:</span>
                <p className="text-[11px] font-bold">
                  {allergies.map(a => `${a.alergen} (${a.reaksi})`).join('; ')}
                </p>
              </div>
            </div>
          )}

          {/* Daftar Resep Obat R/ Klasik */}
          <div className="bg-white p-4 rounded-xl border-2 border-slate-900 space-y-3">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1.5 border-b border-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-900" />
                DAFTAR FORMULA RESEP OBAT (R/)
              </span>
              <span className="text-[10px] font-mono text-slate-500">Standar Permenkes 72/2016</span>
            </h3>

            {document.terapiObat && document.terapiObat.length > 0 ? (
              <div className="space-y-3">
                {document.terapiObat.map((med, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/80 rounded-lg border border-slate-200 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-serif font-black text-blue-950 italic">R/</span>
                      <div>
                        <p className="text-xs font-black text-slate-950 uppercase">{med.nama}</p>
                        <p className="text-[11px] font-bold text-blue-900 mt-0.5">
                          Signa: <span className="font-mono">{med.aturan_pakai || med.dosis || '3 x 1 tablet sehari sesudah makan'}</span>
                        </p>
                        {med.keterangan && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">Catatan: {med.keterangan}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-black text-slate-900 px-2 py-0.5 bg-white border border-slate-300 rounded">
                        No. {med.jumlah || 'X'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 italic py-4">Tidak ada formula resep obat khusus.</p>
            )}

            {document.dietNutrisi && (
              <div className="pt-2 border-t border-slate-200 text-[11px]">
                <span className="font-bold text-slate-700">Petunjuk Diet / Non-Farmakologi: </span>
                <span className="text-slate-900">{document.dietNutrisi}</span>
              </div>
            )}
          </div>

          {/* Telaah Resep Farmasi */}
          <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-lg">
            <span className="text-[10px] font-black text-emerald-950 uppercase block mb-1">
              TELAAH RESEP FARMASI (SKRINING FORMAL SESUAI STANDAR AKREDITASI):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-emerald-900 font-semibold">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Kesesuaian Dosis: Valid</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Duplikasi Obat: Negatif</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Interaksi Obat: Aman</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Bebas Alergi: Terkonfirmasi</span>
            </div>
            <p className="text-[9px] text-emerald-800 mt-1 font-mono">
              Apoteker Penelaah: {rData.telaahApoteker?.namaApoteker || 'apt. Nurul Aini, S.Farm'} ({rData.telaahApoteker?.sipaApoteker || 'SIPA AKTIF'})
            </p>
          </div>
        </main>

        <div className="mt-8 pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Petugas Farmasi / Apoteker</p>
            <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {rData.telaahApoteker?.namaApoteker || 'apt. Nurul Aini, S.Farm'} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Paraf & Stempel Farmasi</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Dokter Penulis Resep (DPJP)</p>
            <p className="font-black text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {signer.nama} )</p>
            <p className="text-[10px] text-slate-500 mt-1">SIP: {signer.sip_nip || '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. DEDICATED TEMPLATE: HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK
  // =========================================================================
  if (document.type === 'hasil_laboratorium') {
    const lMeta = document.labMetadata || {
      noLab: document.nomorDokumen,
      tglSampling: `${todayStr}, 08:30 WIB`,
      tglSelesai: `${todayStr}, 10:15 WIB`,
      dokterSpPk: 'dr. H. Hendra, MARS, Sp.PK',
      analisLab: 'Siti Rahmawati, A.Md.AK',
      catatanKlinis: 'Spesimen serum jernih, kontrol kualitas harian (IQC) valid.'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('HASIL LABORATORIUM PATOLOGI KLINIK', 'INSTALASI LABORATORIUM KLINIK & PATOLOGI')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK
          </h2>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-600 mt-1">
            <span>No. Lab: <strong className="text-slate-950">{lMeta.noLab}</strong></span>
            <span>•</span>
            <span>Tgl Selesai: <strong className="text-slate-950">{lMeta.tglSelesai}</strong></span>
          </div>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          {/* Metadata Lab & Pasien */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700">Nama Pasien</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. RM / NIK</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.no_rm || '-'} / {subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tgl Lahir / Usia</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tgl_lahir} ({subject.umur || '-'} Thn) / {formatGender(subject.jenis_kelamin)}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Dokter Pengirim</span><span className="mr-2">:</span><span className="font-bold text-blue-900">{subject.dokter_dpjp || signer.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Ruangan / Unit</span><span className="mr-2">:</span><span className="text-slate-900">{subject.unit_pelayanan || 'Poliklinik'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Waktu Sampling</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{lMeta.tglSampling}</span></div>
          </div>

          {/* Tabel Parameter Lab Lengkap */}
          <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 w-8 text-center border-r border-slate-300">No</th>
                  <th className="p-2 border-r border-slate-300">Parameter Pemeriksaan</th>
                  <th className="p-2 border-r border-slate-300 text-center font-black">Hasil</th>
                  <th className="p-2 border-r border-slate-300 text-center">Nilai Rujukan</th>
                  <th className="p-2 border-r border-slate-300 text-center">Satuan</th>
                  <th className="p-2 border-r border-slate-300 text-center">Metode</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(document.hasilPemeriksaanLab || []).map((row, idx) => {
                  const isAbnormal = row.flag && row.flag !== 'Normal' && row.flag !== '-';
                  return (
                    <tr key={idx} className={isAbnormal ? 'bg-amber-50/70 font-semibold' : (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50')}>
                      <td className="p-1.5 text-center text-slate-600 border-r border-slate-200">{idx + 1}</td>
                      <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{row.nama}</td>
                      <td className={`p-1.5 text-center font-black border-r border-slate-200 ${isAbnormal ? 'text-rose-700 text-xs' : 'text-slate-950'}`}>
                        {row.hasil}
                      </td>
                      <td className="p-1.5 text-center text-slate-700 border-r border-slate-200">{row.nilai_rujukan || '-'}</td>
                      <td className="p-1.5 text-center text-slate-600 border-r border-slate-200">{row.satuan || '-'}</td>
                      <td className="p-1.5 text-center text-[10px] text-slate-500 border-r border-slate-200">{row.metode || 'Automated Analyser'}</td>
                      <td className="p-1.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isAbnormal ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {row.flag || 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-1">
            <span className="font-bold text-slate-700 block">Catatan Klinis Laboratorium:</span>
            <p className="text-slate-800">{lMeta.catatanKlinis}</p>
          </div>
        </main>

        <div className="mt-8 pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Analis Laboratorium</p>
            <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {lMeta.analisLab} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Pranata Lab Kesehatan</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Dokter Penanggung Jawab Lab</p>
            <p className="font-black text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {lMeta.dokterSpPk} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Spesialis Patologi Klinik (Sp.PK)</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. DEDICATED TEMPLATE: HASIL DIAGNOSTIK RADIOLOGI & IMAGING
  // =========================================================================
  if (document.type === 'hasil_radiologi') {
    const rMeta = document.radiologiMetadata || {
      noFoto: document.nomorDokumen,
      proyeksi: 'Postero-Anterior (PA) & Lateral',
      pesawatRontgen: 'Digital Radiography (DR) 500mA',
      dokterSpRad: 'dr. Hendra Wijaya, Sp.Rad (K)'
    };
    const radItem = document.hasilRadiologi?.[0] || {
      jenis: 'Rontgen Foto Thorax AP/PA',
      tanggal: todayStr,
      ekspertise: 'Cor: Bentuk dan ukuran normal, CTR < 50%. Pulmo: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat atau massa. Sinus kostofrenikus kanan dan kiri tajam.',
      kesimpulan: 'Foto Thorax dalam batas normal. Tidak tampak kelainan kardiopulmoner aktif.',
      dokterRadiologi: 'dr. Hendra Wijaya, Sp.Rad (K)'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('LEMBAR HASIL DIAGNOSTIK RADIOLOGI', 'INSTALASI RADIOLOGI & PENCITRAAN DIAGNOSTIK')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            LEMBAR EKSPERTISE DIAGNOSTIK RADIOLOGI
          </h2>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-600 mt-1">
            <span>No. Foto / Reg: <strong className="text-slate-950">{rMeta.noFoto}</strong></span>
            <span>•</span>
            <span>Tgl Pemeriksaan: <strong className="text-slate-950">{radItem.tanggal || todayStr}</strong></span>
          </div>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          {/* Metadata Pasien */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700">Nama Pasien</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. RM / NIK</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.no_rm || '-'} / {subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tgl Lahir / Usia</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tgl_lahir} ({subject.umur || '-'} Thn) / {formatGender(subject.jenis_kelamin)}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Dokter Pengirim</span><span className="mr-2">:</span><span className="font-bold text-blue-900">{subject.dokter_dpjp || signer.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Pemeriksaan / Proyeksi</span><span className="mr-2">:</span><span className="font-bold text-slate-900">{radItem.jenis} ({rMeta.proyeksi})</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Pesawat / Modalitas</span><span className="mr-2">:</span><span className="text-slate-900">{rMeta.pesawatRontgen}</span></div>
          </div>

          {/* Ekspertise Rinci */}
          <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-3">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1.5 border-b border-slate-300">
              URAIAN EKSPERTISE HASIL RADIOLOGI:
            </h3>
            <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 font-sans leading-relaxed text-slate-900 whitespace-pre-line">
              {radItem.ekspertise}
            </div>

            {/* Kesimpulan Radiologis */}
            <div className="p-3.5 bg-blue-50/90 border-2 border-blue-900 rounded-lg">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 block">
                KESIMPULAN RADIOLOGIS (IMPRESSION):
              </span>
              <p className="text-sm font-black text-blue-950 mt-1">
                {radItem.kesimpulan}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Ekspertise dibaca secara digital dari citra DICOM beresolusi tinggi yang terkalibrasi.
          </p>
        </main>

        {renderFooter('Dokter Spesialis Radiologi,', rMeta.dokterSpRad || radItem.dokterRadiologi || 'dr. Hendra Wijaya, Sp.Rad (K)', 'SIP: 503/SIP-RAD/DKS/2021')}
      </div>
    );
  }

  // =========================================================================
  // 8. DEDICATED TEMPLATE: KUITANSI PEMBAYARAN & RINCIAN BIAYA (BILLING)
  // =========================================================================
  if (document.type === 'kuitansi_billing' || (document as any).type === 'billing') {
    const bSum = document.billingSummary || {
      noKuitansi: document.nomorDokumen,
      kasir: 'Dewi Lestari, S.E (Kasir Utama)',
      metodeBayar: 'QRIS / Transfer Bank / EDC',
      totalTarif: (document.itemBilling || []).reduce((acc, curr) => acc + (curr.subtotal || curr.tarif || 0), 0),
      diskonPenjamin: 0,
      totalDibayar: (document.itemBilling || []).reduce((acc, curr) => acc + (curr.subtotal || curr.tarif || 0), 0),
      terbilang: 'Tiga Ratus Delapan Puluh Ribu Rupiah',
      statusLunas: true,
      tanggalBayar: `${todayStr}, 11:30 WIB`
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        {renderHeader('KUITANSI PEMBAYARAN RESMI', 'BAGIAN KEUANGAN & KASIR PELAYANAN PASIEN')}

        <div className="relative z-10 text-center my-4">
          <h2 className="text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-1">
            KUITANSI PEMBAYARAN & RINCIAN BIAYA PELAYANAN
          </h2>
          <div className="flex justify-center items-center gap-4 text-xs font-mono text-slate-600 mt-1">
            <span>No. Kuitansi: <strong className="text-slate-950">{bSum.noKuitansi}</strong></span>
            <span>•</span>
            <span>Tgl Bayar: <strong className="text-slate-950">{bSum.tanggalBayar}</strong></span>
          </div>
        </div>

        <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
          {/* Data Pasien */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700">Telah Terima Dari</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{subject.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. RM / NIK</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{subject.no_rm || '-'} / {subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Penjamin Pasien</span><span className="mr-2">:</span><span className="font-bold text-slate-900">{subject.penjamin || 'Umum'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Unit / Dokter DPJP</span><span className="mr-2">:</span><span className="text-slate-900">{subject.unit_pelayanan || 'Poliklinik'} / {subject.dokter_dpjp || signer.nama}</span></div>
          </div>

          {/* Tabel Rincian Biaya */}
          <div className="bg-white rounded-lg border border-slate-300 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 w-8 text-center border-r border-slate-300">No</th>
                  <th className="p-2 border-r border-slate-300">Uraian Komponen Pelayanan / Tindakan / Obat</th>
                  <th className="p-2 border-r border-slate-300 text-center">Vol</th>
                  <th className="p-2 border-r border-slate-300 text-right">Tarif Satuan (Rp)</th>
                  <th className="p-2 text-right">Subtotal (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(document.itemBilling || []).map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-1.5 text-center text-slate-600 border-r border-slate-200">{idx + 1}</td>
                    <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{item.nama}</td>
                    <td className="p-1.5 text-center text-slate-700 border-r border-slate-200">{item.jumlah || 1}</td>
                    <td className="p-1.5 text-right text-slate-700 border-r border-slate-200">{(item.tarif || 0).toLocaleString('id-ID')}</td>
                    <td className="p-1.5 text-right font-bold text-slate-900">{(item.subtotal || item.tarif || 0).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-300">
                  <td colSpan={4} className="p-2 text-right">TOTAL TARIF PELAYANAN:</td>
                  <td className="p-2 text-right font-bold">Rp {bSum.totalTarif.toLocaleString('id-ID')}</td>
                </tr>
                {bSum.diskonPenjamin > 0 && (
                  <tr className="bg-slate-50 text-emerald-800 font-bold">
                    <td colSpan={4} className="p-1.5 text-right">TANGGUNGAN PENJAMIN / BPJS KESEHATAN:</td>
                    <td className="p-1.5 text-right">- Rp {bSum.diskonPenjamin.toLocaleString('id-ID')}</td>
                  </tr>
                )}
                <tr className="bg-blue-900 text-white font-black text-xs">
                  <td colSpan={4} className="p-2 text-right uppercase tracking-wider">TOTAL YANG HARUS DIBAYAR:</td>
                  <td className="p-2 text-right text-sm">Rp {bSum.totalDibayar.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terbilang & Cap Lunas */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Jumlah Uang Terbilang:</span>
              <p className="text-xs font-black text-slate-900 italic">" {bSum.terbilang} "</p>
              <p className="text-[10px] text-slate-600 mt-1">Metode Pembayaran: <strong>{bSum.metodeBayar}</strong></p>
            </div>
            <div className="px-4 py-2 border-2 border-emerald-600 bg-emerald-50 rounded-lg text-center shrink-0">
              <span className="text-sm font-black text-emerald-800 tracking-widest uppercase block">L U N A S</span>
              <span className="text-[9px] text-emerald-700 font-mono">{bSum.tanggalBayar}</span>
            </div>
          </div>
        </main>

        <div className="mt-8 pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Pembayar / Pasien / Keluarga</p>
            <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {subject.nama} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Tanda Tangan Pembayar</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Petugas Kasir & Keuangan</p>
            <p className="font-black text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {bSum.kasir} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Stempel & Tanda Tangan Kasir</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9. DEDICATED TEMPLATE: SEP BPJS KESEHATAN (SURAT ELIGIBILITAS PESERTA)
  // =========================================================================
  if (document.type === 'sep_bpjs') {
    const sBpjs = document.sepData || {
      noSep: document.nomorDokumen,
      tglSep: todayStr,
      noKartu: subject.no_kartu_bpjs || '0001234567890',
      peserta: subject.nama,
      noRujukan: '0115B0010826P000123',
      faskesPerujuk: 'Puskesmas Cilandak Timur (0115B001)',
      diagnosaAwal: `${document.diagnosisUtama?.kode || 'R42'} - ${document.diagnosisUtama?.nama || 'Dizziness and Giddiness'}`,
      catatanPeserta: 'Pelayanan rawat jalan rujukan tingkat pertama.',
      hakKelas: 'Kelas 1 (Satu)',
      jenisPelayanan: 'Rawat Jalan Poliklinik'
    };

    return (
      <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
        {renderWatermark()}
        
        {/* Header BPJS */}
        <header className="pb-3 border-b-2 border-emerald-800 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center font-black text-xl">
              BPJS
            </div>
            <div>
              <h1 className="text-lg font-black text-emerald-950 uppercase">BPJS KESEHATAN</h1>
              <p className="text-xs font-bold text-emerald-800">SURAT ELIGIBILITAS PESERTA (SEP) — V-CLAIM 2.0</p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900">{hospital.name}</p>
            <p className="text-[10px] text-slate-500">Kode Faskes: 0115R002</p>
          </div>
        </header>

        <main className="space-y-4 text-xs leading-relaxed text-slate-800">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. SEP</span><span className="mr-2">:</span><span className="font-mono font-black text-slate-950 text-sm">{sBpjs.noSep}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tgl. SEP</span><span className="mr-2">:</span><span className="font-bold text-slate-900">{sBpjs.tglSep}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. Kartu BPJS</span><span className="mr-2">:</span><span className="font-mono font-bold text-slate-900">{sBpjs.noKartu}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Peserta</span><span className="mr-2">:</span><span className="font-black text-slate-950 uppercase">{sBpjs.peserta}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Tgl. Lahir / JK</span><span className="mr-2">:</span><span className="text-slate-900">{subject.tgl_lahir} / {formatGender(subject.jenis_kelamin)}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. Rekam Medis</span><span className="mr-2">:</span><span className="font-mono font-bold text-slate-900">{subject.no_rm}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Poli / Sub-Spesialis</span><span className="mr-2">:</span><span className="font-bold text-emerald-900">{subject.unit_pelayanan || 'Poliklinik Spesialis'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Dokter DPJP</span><span className="mr-2">:</span><span className="font-bold text-slate-900">{subject.dokter_dpjp || signer.nama}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">Faskes Perujuk</span><span className="mr-2">:</span><span className="text-slate-900">{sBpjs.faskesPerujuk}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700">No. Kunjungan / Rujukan</span><span className="mr-2">:</span><span className="font-mono text-slate-900">{sBpjs.noRujukan}</span></div>
            <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700">Diagnosa Awal</span><span className="mr-2">:</span><span className="font-bold text-slate-950">{sBpjs.diagnosaAwal}</span></div>
            <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700">Catatan Peserta</span><span className="mr-2">:</span><span className="text-slate-700 italic">{sBpjs.catatanPeserta}</span></div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 text-justify">
            * Saya menyetujui BPJS Kesehatan menggunakan informasi medis pelayanan ini untuk keperluan penjaminan biaya dan evaluasi mutu pelayanan. SEP ini bukan bukti pembayaran biaya di luar tanggungan BPJS Kesehatan.
          </div>
        </main>

        <div className="mt-8 pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Pasien / Keluarga Pasien</p>
            <p className="font-bold text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( {sBpjs.peserta} )</p>
            <p className="text-[10px] text-slate-500 mt-1">Tanda Tangan Peserta BPJS</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-slate-800 mb-14">Petugas BPJS Kesehatan / RS</p>
            <p className="font-black text-slate-950 border-b border-slate-900 pb-0.5 min-w-[180px]">( Petugas Verifikator SEP )</p>
            <p className="text-[10px] text-slate-500 mt-1">Tanda Tangan & Cap Petugas</p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 10. DEFAULT / DOKUMEN REKAM MEDIS BERSIH (TANPA PENCAMPURAN DOKUMEN)
  // Digunakan untuk dokumen EMR klinis umum, asesmen khusus, dll.
  // =========================================================================
  return (
    <div className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300" style={containerStyle}>
      {renderWatermark()}
      {renderHeader()}

      <div className="relative z-10 text-center my-4">
        <h2 className="text-base sm:text-lg font-black text-slate-950 tracking-wide uppercase border-b-2 border-slate-900 inline-block pb-0.5">
          {document.judulDokumen}
        </h2>
        {document.subJudul && (
          <p className="text-[11px] font-semibold text-slate-600 mt-0.5 uppercase tracking-wide">{document.subJudul}</p>
        )}
        <div className="flex justify-center items-center gap-4 text-[11px] font-mono text-slate-700 mt-1">
          <span>No. Dokumen: <strong className="text-slate-950 font-bold">{document.nomorDokumen}</strong></span>
          <span>•</span>
          <span>Tgl Pelayanan: <strong className="text-slate-950 font-bold">{subject.tgl_periksa || subject.tgl_masuk || todayStr}</strong></span>
        </div>
      </div>

      <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
        {/* I. Data Identitas Pasien */}
        <section className="bg-slate-50/90 p-3.5 rounded-lg border border-slate-300">
          <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-900" />
              I. IDENTITAS PASIEN & INFORMASI KUNJUNGAN
            </span>
            <span className="text-[10px] font-mono font-bold text-blue-900">
              No. RM: {subject.no_rm || subject.nip || '-'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Nama Lengkap Pasien</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-black text-slate-950 uppercase">{subject.nama || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Nomor Induk (NIK)</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-mono font-bold text-slate-900">{subject.nik || '-'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Tempat, Tgl Lahir / Usia</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{subject.tempat_lahir ? `${subject.tempat_lahir}, ` : ''}{subject.tgl_lahir || '-'} {subject.umur ? `(${subject.umur} Thn)` : ''}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Jenis Kelamin / Gol Darah</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{formatGender(subject.jenis_kelamin)} / <strong className="text-rose-700">{subject.golongan_darah || '-'}</strong></span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Unit / Poli Pelayanan</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-bold text-blue-950">{subject.unit_pelayanan || subject.poli || 'Poliklinik'}</span></div>
            <div className="flex"><span className="w-36 font-bold text-slate-700 shrink-0">Dokter DPJP</span><span className="mr-2 font-bold text-slate-900">:</span><span className="font-bold text-slate-900">{subject.dokter_dpjp || signer.nama}</span></div>
            <div className="flex sm:col-span-2"><span className="w-36 font-bold text-slate-700 shrink-0">Alamat Lengkap</span><span className="mr-2 font-bold text-slate-900">:</span><span className="text-slate-900">{subject.alamat_ktp || subject.alamat || '-'}</span></div>
          </div>
        </section>

        {/* II. Anamnesis */}
        {(document.anamnesis || document.keluhanUtama) && (
          <section className="bg-white p-3.5 rounded-lg border border-slate-300 space-y-2">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1 border-b border-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              II. ANAMNESIS & RIWAYAT PENYAKIT (SUBJEKTIF)
            </h3>
            <div>
              <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Keluhan Utama:</span>
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-900">{document.keluhanUtama || document.anamnesis}</p>
            </div>
            {document.riwayatPenyakitSekarang && (
              <div>
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Riwayat Penyakit Sekarang:</span>
                <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 leading-relaxed">{document.riwayatPenyakitSekarang}</p>
              </div>
            )}
          </section>
        )}

        {/* III. Pemeriksaan Fisik */}
        {document.pemeriksaanFisik && (
          <section className="bg-white p-3.5 rounded-lg border border-slate-300 space-y-2">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1 border-b border-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              III. PEMERIKSAAN FISIK & TANDA VITAL (OBJEKTIF)
            </h3>
            {document.pemeriksaanFisik.tandaVital && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] text-slate-500 font-bold block">Tekanan Darah</span><span className="font-bold text-slate-900">{document.pemeriksaanFisik.tandaVital.tekananDarah || '-'}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] text-slate-500 font-bold block">Frekuensi Nadi</span><span className="font-bold text-slate-900">{document.pemeriksaanFisik.tandaVital.nadi || '-'}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] text-slate-500 font-bold block">Frekuensi Nafas</span><span className="font-bold text-slate-900">{document.pemeriksaanFisik.tandaVital.rr || '-'}</span></div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200"><span className="text-[10px] text-slate-500 font-bold block">Suhu Tubuh</span><span className="font-bold text-slate-900">{document.pemeriksaanFisik.tandaVital.suhu || '-'}</span></div>
              </div>
            )}
            {document.pemeriksaanFisik.catatanFisik && (
              <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-800 text-[11px] font-mono">{document.pemeriksaanFisik.catatanFisik}</p>
            )}
          </section>
        )}

        {/* IV. Diagnosis (Assessment) */}
        {document.diagnosisUtama && (
          <section className="p-3.5 bg-blue-50/80 rounded-lg border border-blue-200 space-y-1.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 block">IV. DIAGNOSIS UTAMA (ASSESSMENT):</span>
                <p className="text-sm font-black text-blue-950">{document.diagnosisUtama.nama}</p>
              </div>
              {document.diagnosisUtama.kode && (
                <span className="px-2 py-0.5 bg-blue-900 text-white font-mono font-bold text-xs rounded">
                  ICD-10: {document.diagnosisUtama.kode}
                </span>
              )}
            </div>
            {document.diagnosisSekunder && document.diagnosisSekunder.length > 0 && (
              <div className="pt-1.5 border-t border-blue-200/70 text-[11px]">
                <span className="font-bold text-slate-700">Diagnosis Sekunder: </span>
                <span className="text-slate-900">{document.diagnosisSekunder.map(d => `${d.nama} (${d.kode || '-'})`).join('; ')}</span>
              </div>
            )}
          </section>
        )}

        {/* V. Tata Laksana & Edukasi */}
        {(document.terapiObat || document.tindakanMedis || document.edukasiInstruksi) && (
          <section className="bg-slate-50/90 p-3.5 rounded-lg border border-slate-300 space-y-2">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider pb-1 border-b border-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-emerald-800 inline-block rounded-xs" />
              V. TATA LAKSANA & EDUKASI (PLAN)
            </h3>
            {document.tindakanMedis && document.tindakanMedis.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Tindakan Medis:</span>
                <p className="p-2 bg-white rounded border border-slate-200 text-slate-900">{document.tindakanMedis.map(t => t.nama).join('; ')}</p>
              </div>
            )}
            {document.terapiObat && document.terapiObat.length > 0 && (
              <div>
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Terapi Farmakologi:</span>
                <p className="p-2 bg-white rounded border border-slate-200 text-slate-900 font-mono text-[11px]">{document.terapiObat.map(o => `${o.nama} (${o.aturan_pakai || o.dosis || '-'})`).join('; ')}</p>
              </div>
            )}
            {document.edukasiInstruksi && (
              <div>
                <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Instruksi & Edukasi Pasien:</span>
                <p className="p-2 bg-white rounded border border-slate-200 text-slate-800 text-[11px] leading-relaxed whitespace-pre-line">{document.edukasiInstruksi}</p>
              </div>
            )}
          </section>
        )}
      </main>

      {renderFooter()}
    </div>
  );
}
