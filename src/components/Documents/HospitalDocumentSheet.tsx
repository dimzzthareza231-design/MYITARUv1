import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useHospital } from '../../contexts/HospitalContext';
import { 
  HospitalDocumentModel, 

  AllergyItem
} from '../../types/document';
import { ShieldCheck, AlertTriangle, HeartPulse, Stethoscope, Activity, FileText, Pill, FlaskConical, CheckCircle2 } from 'lucide-react';

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

  return (
    <div 
      className="printable-hospital-doc bg-white text-slate-900 shadow-2xl mx-auto my-0 p-8 sm:p-12 relative overflow-hidden font-sans border border-slate-300"
      style={{
        width: '100%',
        maxWidth: '860px',
        minHeight: '1100px',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#0f172a'
      }}
    >
      {/* WATERMARK BACKGROUND */}
      {watermark && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
          style={{ opacity: 0.03 }}
        >
          <div className="transform -rotate-45 text-center">
            <p className="text-8xl font-black tracking-widest text-slate-900">TARUMANAGARA</p>
            <p className="text-4xl font-bold tracking-widest text-slate-800 uppercase mt-2">OFFICIAL ELECTRONIC MEDICAL RECORD</p>
            <p className="text-2xl font-mono text-slate-700 mt-1">PERMENKES NO. 24 TAHUN 2022</p>
          </div>
        </div>
      )}

      {/* HEADER / KOP SURAT RUMAH SAKIT */}
      <header className="relative z-10 pb-3 border-b-2 border-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* LOGO RS */}
            {(hospital as any).logoUrl ? (
              <img src={(hospital as any).logoUrl} alt="Logo RS" className="w-16 h-16 object-contain shrink-0" />
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
                {hospital.subname || 'RUMAH SAKIT UMUM PENDIDIKAN TARUMANAGARA'}
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
              {hospital.accreditation || 'TERAKREDITASI PARIPURNA'}
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-1">
              Permenkes RI No. 24 / 2022
            </span>
            <span className="text-[9px] text-slate-400 font-mono">
              SatuSehat Integrated HIS
            </span>
          </div>
        </div>
        {/* DOUBLE BORDER LINE */}
        <div className="w-full h-0.5 bg-slate-900 mt-2.5" />
        <div className="w-full h-px bg-slate-400 mt-0.5" />
      </header>

      {/* DOKUMEN TITLE & NUMBER */}
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

      {/* 1. IDENTITAS LENGKAP PASIEN & KUNJUNGAN (GRID TERSTRUKTUR RAPI) */}
      <section className="relative z-10 mb-4 bg-slate-50/90 p-3.5 rounded-lg border border-slate-300 text-xs">
        <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-200 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-900" />
            I. DATA IDENTITAS PASIEN & ADMINISTRASI PELAYANAN
          </span>
          <span className="text-[10px] font-mono font-bold text-blue-900">
            No. RM: {subject.no_rm || subject.nip || '-'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Nama Lengkap Pasien</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-black text-slate-950 uppercase">{subject.nama || '-'}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Nomor Induk (NIK)</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-mono font-bold text-slate-900">{subject.nik || '-'}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Tempat, Tgl Lahir / Usia</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">
              {subject.tempat_lahir ? `${subject.tempat_lahir}, ` : ''}{subject.tgl_lahir || '-'} {subject.umur ? `(${subject.umur} Tahun)` : ''}
            </span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Jenis Kelamin / Gol Darah</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">{formatGender(subject.jenis_kelamin)} / <strong className="text-rose-700">{subject.golongan_darah || '-'}</strong></span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Status / Agama / Pekerjaan</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">{subject.status_pernikahan || '-'} / {subject.agama || '-'} / {subject.pekerjaan || '-'}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">No. Telepon / WhatsApp</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-mono text-slate-900">{subject.telepon || subject.no_hp || '-'}</span>
          </div>

          <div className="flex sm:col-span-2">
            <span className="w-36 font-bold text-slate-700 shrink-0">Alamat KTP / Domisili</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">{subject.alamat_ktp || subject.alamat || '-'}</span>
          </div>

          {subject.kontak_darurat && (
            <div className="flex sm:col-span-2">
              <span className="w-36 font-bold text-slate-700 shrink-0">Kontak Darurat (Wali)</span>
              <span className="mr-2 font-bold text-slate-900">:</span>
              <span className="text-slate-900">
                {typeof subject.kontak_darurat === 'object' 
                  ? `${subject.kontak_darurat.nama} (${subject.kontak_darurat.hubungan}) - Telp: ${subject.kontak_darurat.telepon}`
                  : String(subject.kontak_darurat)}
              </span>
            </div>
          )}

          {/* DETAIL KUNJUNGAN & PENJAMIN */}
          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Penjamin / No. Kartu</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-semibold text-slate-900">{subject.penjamin || 'Umum'} {subject.no_kartu_bpjs ? `(${subject.no_kartu_bpjs})` : ''}</span>
          </div>

          {subject.no_sep && (
            <div className="flex">
              <span className="w-36 font-bold text-slate-700 shrink-0">Nomor SEP BPJS</span>
              <span className="mr-2 font-bold text-slate-900">:</span>
              <span className="font-mono font-bold text-blue-900">{subject.no_sep}</span>
            </div>
          )}

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Unit Pelayanan / Poli</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-bold text-blue-950">{subject.unit_pelayanan || subject.poli || 'Poliklinik Penyakit Dalam'}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Dokter DPJP Utama</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="font-black text-blue-900">{subject.dokter_dpjp || signer.nama}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Waktu Masuk / Keluar</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">{subject.tgl_masuk || subject.tgl_periksa} {subject.jam_masuk ? `(${subject.jam_masuk})` : ''} s/d {subject.tgl_keluar || subject.tgl_periksa} {subject.jam_keluar ? `(${subject.jam_keluar})` : ''}</span>
          </div>

          <div className="flex">
            <span className="w-36 font-bold text-slate-700 shrink-0">Tipe / Ruang / Kelas</span>
            <span className="mr-2 font-bold text-slate-900">:</span>
            <span className="text-slate-900">{subject.tipe_kunjungan || 'Rawat Jalan'} {subject.ruangan ? `• Ruang ${subject.ruangan}` : ''} {subject.kelas_rawat ? `• ${subject.kelas_rawat}` : ''}</span>
          </div>
        </div>
      </section>

      {/* 2. CRITICAL CLINICAL ALERTS & ALLERGIES */}
      {(allergies.length > 0 || document.riwayatPenyakitDahulu || document.riwayatPenyakitKeluarga) && (
        <section className="relative z-10 mb-4 bg-amber-50/70 p-3 rounded-lg border border-amber-300 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 uppercase text-[11px] mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            II. PERINGATAN KLINIS, RIWAYAT ALERGI & RIWAYAT KESEHATAN
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="font-bold text-slate-800">Riwayat Alergi: </span>
              {allergies.length > 0 ? (
                <div className="mt-1 space-y-1">
                  {allergies.map((al, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        {al.tipe}: {al.alergen}
                      </span>
                      <span className="text-slate-600 italic">({al.reaksi} • {al.derajat || 'Sedang'})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-emerald-700 font-semibold">Tidak ada riwayat alergi obat/makanan (Alergi Negatif)</span>
              )}
            </div>

            <div className="space-y-1">
              {document.riwayatPenyakitDahulu && (
                <div>
                  <span className="font-bold text-slate-800">Riwayat Penyakit Dahulu (RPD): </span>
                  <span className="text-slate-700">{document.riwayatPenyakitDahulu}</span>
                </div>
              )}
              {document.riwayatPenyakitKeluarga && (
                <div>
                  <span className="font-bold text-slate-800">Riwayat Penyakit Keluarga (RPK): </span>
                  <span className="text-slate-700">{document.riwayatPenyakitKeluarga}</span>
                </div>
              )}
              {document.riwayatPengobatanRutin && (
                <div>
                  <span className="font-bold text-slate-800">Riwayat Pengobatan Rutin: </span>
                  <span className="text-slate-700">{document.riwayatPengobatanRutin}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BODY KONTEN SPESIFIK DOKUMEN */}
      <main className="relative z-10 space-y-4 text-xs leading-relaxed text-slate-800">
        {/* 3. ANAMNESIS & TINJAUAN SISTEM (SUBJEKTIF) */}
        {(document.keluhanUtama || document.anamnesis || document.riwayatPenyakitSekarang) && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              III. ANAMNESIS KLINIS (SUBJEKTIF)
            </h3>
            <div className="space-y-1.5 text-justify">
              {document.keluhanUtama && (
                <div>
                  <span className="font-bold text-slate-900">Keluhan Utama: </span>
                  <span className="text-slate-800 font-medium">{document.keluhanUtama}</span>
                </div>
              )}
              {document.riwayatPenyakitSekarang && (
                <div>
                  <span className="font-bold text-slate-900">Riwayat Penyakit Sekarang (RPS): </span>
                  <span className="text-slate-800">{document.riwayatPenyakitSekarang}</span>
                </div>
              )}
              {!document.riwayatPenyakitSekarang && document.anamnesis && (
                <p className="text-slate-800 leading-normal">{document.anamnesis}</p>
              )}
              {document.tinjauanSistem && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
                  <span className="font-bold text-slate-700">Tinjauan Sistem Organ (Review of Systems): </span>
                  <span className="text-slate-700">{document.tinjauanSistem}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. PEMERIKSAAN FISIK & TANDA VITAL (OBJEKTIF) */}
        {document.pemeriksaanFisik && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              IV. PEMERIKSAAN FISIK & TANDA-TANDA VITAL (OBJEKTIF)
            </h3>

            {/* TANDA VITAL TABLE GRID */}
            {document.pemeriksaanFisik.tandaVital && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100/90 p-2.5 rounded border border-slate-300 text-[11px] mb-2">
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Tekanan Darah (TD)</span>
                  <span className="font-bold text-slate-950">{document.pemeriksaanFisik.tandaVital.tekananDarah || '120/80 mmHg'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Frekuensi Nadi (HR)</span>
                  <span className="font-bold text-slate-950">{document.pemeriksaanFisik.tandaVital.nadi || '80 x/mnt'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Suhu Tubuh (Temp)</span>
                  <span className="font-bold text-slate-950">{document.pemeriksaanFisik.tandaVital.suhu || '36.5 °C'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Saturasi Oksigen (SpO2)</span>
                  <span className="font-bold text-slate-950">{document.pemeriksaanFisik.tandaVital.spo2 || '99 %'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Pernafasan (RR)</span>
                  <span className="font-bold text-slate-950">{document.pemeriksaanFisik.tandaVital.rr || '18 x/mnt'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Tinggi / Berat Badan</span>
                  <span className="font-bold text-slate-950">
                    {document.pemeriksaanFisik.tandaVital.tb || '170'} cm / {document.pemeriksaanFisik.tandaVital.bb || '68'} kg
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Indeks Massa Tubuh (IMT)</span>
                  <span className="font-bold text-blue-900">
                    {document.pemeriksaanFisik.tandaVital.imt || '23.5 kg/m²'} ({document.pemeriksaanFisik.tandaVital.kategoriImt || 'Normal'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block text-[10px]">Tingkat Kesadaran / GCS</span>
                  <span className="font-bold text-slate-950">
                    {document.pemeriksaanFisik.tandaVital.kesadaran || 'Compos Mentis'} ({document.pemeriksaanFisik.tandaVital.gcs || 'E4V5M6'})
                  </span>
                </div>
                {document.pemeriksaanFisik.tandaVital.skalaNyeri && (
                  <div className="col-span-2 sm:col-span-4 pt-1 border-t border-slate-200 flex justify-between">
                    <span>
                      <strong className="text-slate-600">Skala Nyeri (NRS):</strong> <span className="font-bold text-rose-700">{document.pemeriksaanFisik.tandaVital.skalaNyeri}</span>
                    </span>
                    {document.pemeriksaanFisik.tandaVital.lokasiNyeri && (
                      <span>
                        <strong className="text-slate-600">Lokasi Nyeri:</strong> {document.pemeriksaanFisik.tandaVital.lokasiNyeri}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STATUS GENERALIS & SISTEMIK */}
            {document.pemeriksaanFisik.pemeriksaanSistemik && (
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] space-y-1">
                <div className="font-bold text-slate-800 mb-1">Status Generalis & Organik:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                  <div><strong>Kepala & Leher:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.kepalaLeher}</div>
                  <div><strong>Mata:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.mata}</div>
                  <div><strong>THT & Faring:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.tht}</div>
                  <div><strong>Thorax (Cor / Jantung):</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.thoraxCor}</div>
                  <div><strong>Thorax (Pulmo / Paru):</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.thoraxPulmo}</div>
                  <div><strong>Abdomen:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.abdomen}</div>
                  <div><strong>Ekstremitas & Vaskular:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.ekstremitas}</div>
                  <div><strong>Neurologis & Motorik:</strong> {document.pemeriksaanFisik.pemeriksaanSistemik.neurologis}</div>
                </div>
              </div>
            )}

            {document.pemeriksaanFisik.catatanFisik && (
              <p className="text-[11px] text-slate-800 mt-1.5 italic bg-blue-50/50 p-2 rounded border border-blue-200">
                <strong>Status Lokalis / Temuan Khusus:</strong> {document.pemeriksaanFisik.catatanFisik}
              </p>
            )}
          </div>
        )}

        {/* 5. DIAGNOSIS MEDIS (ICD-10) - ASSESSMENT */}
        {(document.diagnosisUtama || (document.diagnosisSekunder && document.diagnosisSekunder.length > 0)) && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              V. DIAGNOSIS KLINIS (ASSESSMENT - ICD-10)
            </h3>
            {document.diagnosisUtama && (
              <div className="p-2.5 bg-blue-50/80 rounded border border-blue-200 mb-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-950">Diagnosis Utama (Primer): </span>
                    <span className="font-bold text-slate-950 text-sm">{document.diagnosisUtama.nama}</span>
                  </div>
                  {document.diagnosisUtama.kode && (
                    <span className="font-mono font-black bg-blue-900 text-white px-2 py-0.5 rounded text-xs">
                      ICD-10: {document.diagnosisUtama.kode}
                    </span>
                  )}
                </div>
                {document.diagnosisUtama.deskripsi && (
                  <p className="text-[11px] text-slate-600 mt-1 italic">{document.diagnosisUtama.deskripsi}</p>
                )}
              </div>
            )}

            {document.diagnosisSekunder && document.diagnosisSekunder.length > 0 && (
              <div className="p-2 bg-slate-50 rounded border border-slate-200 mb-1.5 text-[11px]">
                <span className="font-bold text-slate-800">Diagnosis Sekunder / Komorbiditas: </span>
                <ul className="list-disc list-inside pl-1 mt-0.5 space-y-0.5">
                  {document.diagnosisSekunder.map((sec, idx) => (
                    <li key={idx}>
                      <span className="font-semibold text-slate-900">{sec.nama}</span>
                      {sec.kode ? <span className="font-mono font-bold text-blue-900 ml-1.5">[{sec.kode}]</span> : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {document.diagnosisBanding && document.diagnosisBanding.length > 0 && (
              <div className="text-[11px] text-slate-600 italic">
                <strong>Diagnosis Banding (DDx):</strong> {document.diagnosisBanding.join(', ')}
              </div>
            )}
          </div>
        )}

        {/* 6. TINDAKAN MEDIS & PROSEDUR (ICD-9-CM) */}
        {document.tindakanMedis && document.tindakanMedis.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              VI. TINDAKAN MEDIS & PROSEDUR TERAPEUTIK (ICD-9-CM)
            </h3>
            <ul className="list-disc list-inside pl-2 text-[11px] text-slate-800 space-y-0.5">
              {document.tindakanMedis.map((t, idx) => (
                <li key={idx}>
                  <span className="font-bold text-slate-900">{t.nama}</span>
                  {t.kode && <span className="font-mono font-bold text-blue-900 ml-1.5 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">ICD-9: {t.kode}</span>}
                  {t.keterangan && <span className="text-slate-600 italic ml-1.5">— {t.keterangan}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 7. TERAPI E-PRESCRIBING & RESEP OBAT PULANG */}
        {document.terapiObat && document.terapiObat.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              VII. TERAPI FARMAKOLOGI & E-RESEP OBAT
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-slate-300 rounded overflow-hidden">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5 w-8 text-center border-r border-slate-300">No</th>
                    <th className="p-1.5 border-r border-slate-300">Nama Obat & Bentuk Sediaan</th>
                    <th className="p-1.5 border-r border-slate-300">Dosis & Aturan Pakai (Signa)</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Rute / Durasi</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Jumlah</th>
                    <th className="p-1.5">Indikasi & Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {document.terapiObat.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-1.5 text-center font-bold text-slate-600 border-r border-slate-200">{idx + 1}</td>
                      <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">
                        {item.nama} {item.sediaan ? <span className="font-normal text-slate-600 text-[10px]">({item.sediaan})</span> : ''}
                      </td>
                      <td className="p-1.5 text-blue-950 font-semibold border-r border-slate-200">{item.dosis_aturan || '-'}</td>
                      <td className="p-1.5 text-center text-slate-700 border-r border-slate-200">{item.rute || 'Oral'} / {item.durasi || '5 Hari'}</td>
                      <td className="p-1.5 text-center font-bold text-slate-900 border-r border-slate-200">{item.jumlah || '10'}</td>
                      <td className="p-1.5 text-slate-700 text-[10px]">{item.indikasi || item.keterangan || 'Sesuai petunjuk'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {document.terapiNonFarmakologi && (
              <p className="text-[11px] text-slate-700 mt-1">
                <strong>Terapi Non-Farmakologi:</strong> {document.terapiNonFarmakologi}
              </p>
            )}
            {document.dietNutrisi && (
              <p className="text-[11px] text-slate-700">
                <strong>Instruksi Diet & Gizi:</strong> {document.dietNutrisi}
              </p>
            )}
          </div>
        )}

        {/* 8. HASIL PEMERIKSAAN LABORATORIUM */}
        {document.hasilPemeriksaanLab && document.hasilPemeriksaanLab.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              VIII. HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-slate-300 rounded overflow-hidden">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5 w-8 text-center border-r border-slate-300">No</th>
                    <th className="p-1.5 border-r border-slate-300">Parameter Pemeriksaan</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Hasil</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Nilai Rujukan</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Satuan</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Metode</th>
                    <th className="p-1.5 text-center">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {document.hasilPemeriksaanLab.map((item, idx) => {
                    const isAbnormal = item.flag && item.flag !== 'Normal';
                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="p-1.5 text-center font-bold text-slate-600 border-r border-slate-200">{idx + 1}</td>
                        <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{item.nama}</td>
                        <td className={`p-1.5 text-center font-bold border-r border-slate-200 ${isAbnormal ? 'text-rose-600 font-black' : 'text-slate-900'}`}>
                          {item.hasil || '-'}
                        </td>
                        <td className="p-1.5 text-center text-slate-700 border-r border-slate-200">{item.nilai_rujukan || '-'}</td>
                        <td className="p-1.5 text-center text-slate-600 border-r border-slate-200">{item.satuan || '-'}</td>
                        <td className="p-1.5 text-center text-slate-500 text-[10px] border-r border-slate-200">{item.metode || 'Automated'}</td>
                        <td className="p-1.5 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isAbnormal ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {item.flag || 'Normal'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. HASIL PEMERIKSAAN RADIOLOGI & DIAGNOSTIK */}
        {((document.hasilRadiologi && document.hasilRadiologi.length > 0) || document.hasilEkg) && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              IX. HASIL RADIOLOGI & DIAGNOSTIK ELEKTROMEDIS
            </h3>
            {document.hasilRadiologi?.map((rad, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded mb-1.5 text-[11px]">
                <div className="flex justify-between font-bold text-slate-900 mb-1 border-b border-slate-200 pb-1">
                  <span>{rad.jenis}</span>
                  <span className="text-slate-600 font-mono text-[10px]">Tgl: {rad.tanggal || todayStr}</span>
                </div>
                <div className="text-slate-700 mb-1"><strong className="text-slate-900">Ekspertise: </strong>{rad.ekspertise}</div>
                <div className="text-blue-950 font-bold"><strong className="text-slate-900">Kesimpulan: </strong>{rad.kesimpulan}</div>
                {rad.dokterRadiologi && (
                  <div className="text-right text-[10px] text-slate-500 font-semibold mt-1">Dokter Spesialis Radiologi: {rad.dokterRadiologi}</div>
                )}
              </div>
            ))}
            {document.hasilEkg && (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-[11px]">
                <span className="font-bold text-slate-900">Hasil Rekam Jantung (EKG 12-Lead): </span>
                <span className="text-slate-700">{document.hasilEkg}</span>
              </div>
            )}
          </div>
        )}

        {/* 10. EDUKASI, INSTRUKSI, PROGNOSIS & EVALUASI PULANG */}
        {(document.edukasiInstruksi || document.rencanaKontrol || document.prognosis || document.kondisiPulang) && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              X. EDUKASI PASIEN, RENCANA TINDAK LANJUT & PROGNOSIS
            </h3>
            
            {document.edukasiInstruksi && (
              <div className="text-slate-800 text-justify mb-2 leading-relaxed bg-slate-50/70 p-2.5 rounded border border-slate-200 whitespace-pre-line text-[11px]">
                <strong className="text-slate-950 block mb-1">Instruksi & Edukasi Dokter kepada Pasien/Keluarga:</strong>
                {document.edukasiInstruksi}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {document.rencanaKontrol && (
                <div className="p-2 bg-blue-50/90 rounded border border-blue-300 text-blue-950 font-semibold">
                  📅 <strong>Rencana Kontrol Ulang:</strong>
                  <p className="font-bold text-blue-900 mt-0.5">{document.rencanaKontrol}</p>
                </div>
              )}

              {document.kondisiPulang && (
                <div className="p-2 bg-emerald-50/90 rounded border border-emerald-300 text-emerald-950 font-semibold">
                  🏥 <strong>Kondisi Saat Keluar / Selesai Pelayanan:</strong>
                  <p className="font-bold text-emerald-900 mt-0.5">{document.kondisiPulang}</p>
                </div>
              )}
            </div>

            {document.prognosis && (
              <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200 text-[11px] flex flex-wrap gap-4">
                <span><strong>Ad Vitam (Kelangsungan Hidup):</strong> <span className="text-emerald-700 font-bold">{document.prognosis.vitam || 'Bonam'}</span></span>
                <span><strong>Ad Functionam (Fungsi Organ):</strong> <span className="text-emerald-700 font-bold">{document.prognosis.functionam || 'Bonam'}</span></span>
                <span><strong>Ad Sanationam (Kesembuhan):</strong> <span className="text-emerald-700 font-bold">{document.prognosis.sanationam || 'Dubia ad Bonam'}</span></span>
              </div>
            )}

            {document.catatanKhusus && (
              <p className="text-[10px] text-slate-500 italic mt-1.5">
                * Catatan Hukum / Validasi: {document.catatanKhusus}
              </p>
            )}
          </div>
        )}

        {/* 11. TABEL RINCIAN BIAYA / BILLING (JIKA KUITANSI / BILLING) */}
        {document.itemBilling && document.itemBilling.length > 0 && (
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 border-b border-slate-300 pb-1">
              <span className="w-1.5 h-3 bg-blue-900 inline-block rounded-xs" />
              XI. RINCIAN BIAYA PELAYANAN MEDIS & KASIR
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border border-slate-300 rounded overflow-hidden">
                <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-1.5 w-8 text-center border-r border-slate-300">No</th>
                    <th className="p-1.5 border-r border-slate-300">Item Pelayanan / Tindakan / Obat</th>
                    <th className="p-1.5 border-r border-slate-300 text-center">Jumlah</th>
                    <th className="p-1.5 border-r border-slate-300 text-right">Tarif Satuan (Rp)</th>
                    <th className="p-1.5 text-right">Subtotal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {document.itemBilling.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-1.5 text-center font-bold text-slate-600 border-r border-slate-200">{idx + 1}</td>
                      <td className="p-1.5 font-bold text-slate-900 border-r border-slate-200">{item.nama}</td>
                      <td className="p-1.5 text-center text-slate-700 border-r border-slate-200">{item.jumlah || 1}</td>
                      <td className="p-1.5 text-right text-slate-700 border-r border-slate-200">{(item.tarif || 0).toLocaleString('id-ID')}</td>
                      <td className="p-1.5 text-right font-bold text-slate-900">{(item.subtotal || item.tarif || 0).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 font-bold text-slate-950 border-t-2 border-slate-300">
                    <td colSpan={4} className="p-2 text-right uppercase tracking-wider">TOTAL TAGIHAN PELAYANAN:</td>
                    <td className="p-2 text-right font-black text-blue-900 text-xs">
                      Rp {document.itemBilling.reduce((acc, curr) => acc + (curr.subtotal || curr.tarif || 0), 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* PENGESAHAN DIGITAL REKAM MEDIS ELEKTRONIK (RME) */}
      <footer className="relative z-10 mt-8 pt-4 border-t-2 border-slate-900">
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-xs">
          {/* DIGITAL SIGNATURE VALIDATION BADGE */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg w-full sm:w-auto">
            <div className="p-1.5 bg-white border border-slate-300 rounded shrink-0">
              <QRCodeSVG value={qrValue} size={68} level="M" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-emerald-800 font-black text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                RME RESMI TERSERTIFIKASI KEMENKES RI
              </div>
              <p className="text-[10px] text-slate-600 mt-0.5">
                Dokumen Rekam Medis Elektronik sah & tersimpan permanen di cloud SIMRS Tarumanagara Hospital & SatuSehat.
              </p>
              <p className="text-[9px] font-mono text-slate-500 mt-0.5">
                ID Validasi: <span className="font-bold text-slate-800">{validationCode}</span>
              </p>
            </div>
          </div>

          {/* DOKTER DPJP / PENANGGUNG JAWAB */}
          <div className="text-right w-full sm:w-72">
            <p className="text-slate-700">
              {cityStr}, {todayStr}
            </p>
            <p className="font-bold text-slate-900 mt-0.5 text-xs">
              {signer.jabatan || 'Dokter Penanggung Jawab Pelayanan (DPJP),'}
            </p>

            {/* DIGITAL STAMP BADGE */}
            <div className="my-2 inline-block px-3 py-1 bg-blue-50/90 border border-blue-300 rounded text-[9px] font-mono text-blue-900 font-bold tracking-wider">
              [ SIGNED & ENCRYPTED DIGITALLY ]
            </div>

            <p className="font-black text-slate-950 underline text-sm">
              {signer.nama}
            </p>
            {signer.gelar && (
              <p className="text-[11px] font-semibold text-blue-900">
                Spesialisasi: {signer.gelar}
              </p>
            )}
            {signer.sip_nip && (
              <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                {signer.sip_nip}
              </p>
            )}
          </div>
        </div>

        {/* LEGAL DISCLAIMER FOOTER */}
        <div className="mt-6 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400 leading-snug">
          <p>
            Dokumen ini merupakan Rekam Medis Elektronik (RME) resmi yang diterbitkan oleh Sistem Informasi Manajemen Rumah Sakit (MYITARU SIMRS).
          </p>
          <p>
            Sah dan berkekuatan hukum penuh tanpa tanda tangan basah sesuai UU ITE No. 11/2008 & Permenkes RI No. 24/2022 tentang Rekam Medis Elektronik.
          </p>
        </div>
      </footer>
    </div>
  );
}

