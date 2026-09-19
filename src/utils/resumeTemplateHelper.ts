// ═══════════════════════════════════════════════════════════════════════════
// MYITARU SIMRS — HELPER TEMPLATE RESUME MEDIS (RAWAT JALAN & RAWAT INAP)
// Sesuai Standar Template Resume Medis Pasien Permenkes RI No. 24 Tahun 2022
// ═══════════════════════════════════════════════════════════════════════════

export interface FormattedResumeMedis {
  isRawatInap: boolean;
  isRawatJalan: boolean;
  mode: 'rawat_jalan' | 'rawat_inap' | 'konsolidasi';

  // I. Identitas Pasien
  namaPasien: string;
  noRm: string;
  tglLahirUmur: string;
  jenisKelamin: string;
  alamat: string;
  penanggungBiaya: string;

  // II. Ringkasan Rawat Jalan (Poliklinik)
  tglKunjungan: string;
  poliklinik: string;
  keluhanUtama: string;
  pemeriksaanFisikAkhir: string;
  diagnosisRawatJalan: string;
  alasanAlihRawatInap: string;

  // III. Ringkasan Rawat Inap (Konsolidasi)
  tglMasukRs: string;
  tglKeluarRs: string;
  ruangRawatTerakhir: string;
  lamaRawatInap: string;
  diagnosisUtamaAkhir: string;
  kodeIcd10Utama: string;
  diagnosisSekunderKomorbid: string;
  kodeIcd10Sekunder: string;
  hasilPemeriksaanPenunjang: string;
  tindakanMedisOperasi: string;
  perjalananPenyakitEvolusi: string;
  kondisiSaatKeluarRs: string;

  // IV. Rencana Tindak Lanjut & Instruksi Pulang
  terapiObatPulang: string;
  instruksiDietEdukasi: string;
  jadwalKontrolKembali: string;

  // Pengesahan
  kotaRs: string;
  tglDikeluarkan: string;
  namaPasienKeluarga: string;
  namaDokterDpjp: string;
  sipDokter: string;
  qrValidationCode: string;
}

export function detectIsRawatInap(data: any): boolean {
  if (!data) return false;
  
  // Explicit flag
  if (data.isRawatInap !== undefined) return Boolean(data.isRawatInap);
  if (data.mode === 'rawat_inap') return true;
  if (data.mode === 'rawat_jalan') return false;

  const typeStr = String(
    data.tipe_kunjungan || 
    data.layanan || 
    data.jenis_pelayanan || 
    data.tipe || 
    data.status_rawat || 
    data.unit_pelayanan || 
    ''
  ).toLowerCase();

  // If explicitly outpatient / ambulatory / IGD non-ranap
  if (
    typeStr.includes('jalan') || 
    typeStr.includes('ralan') || 
    typeStr.includes('poliklinik') ||
    typeStr.includes('rawat jalan')
  ) {
    return false;
  }

  // If IGD ambulatory
  if ((typeStr.includes('gawat darurat') || typeStr.includes('igd')) && !typeStr.includes('inap') && !typeStr.includes('ranap')) {
    return false;
  }

  if (
    typeStr.includes('inap') || 
    typeStr.includes('ranap') || 
    typeStr.includes('bangsal') || 
    typeStr.includes('icu') || 
    typeStr.includes('hcu') || 
    typeStr.includes('kamar inap')
  ) {
    return true;
  }

  // Ruangan / bed assigned indicates inpatient care
  if (data.ruangan || data.kamar || data.no_bed || data.bed || data.bangsal) {
    const roomStr = String(data.ruangan || data.kamar || '').toLowerCase();
    if (
      !roomStr.includes('poli') && 
      !roomStr.includes('poliklinik') && 
      !roomStr.includes('ralan') &&
      !roomStr.includes('igd') &&
      !roomStr.includes('triase')
    ) {
      return true;
    }
  }

  // Check tgl_masuk vs tgl_keluar with multi-day stay
  if (data.lama_rawat && parseInt(String(data.lama_rawat)) > 0) {
    return true;
  }

  return false;
}

export function formatResumeMedisData(raw: any, forcedMode?: 'rawat_jalan' | 'rawat_inap' | 'konsolidasi'): FormattedResumeMedis {
  const data = raw || {};
  const resume = data.resume_medis || data.resume || {};
  const patientRef = data.patient_ref || {};

  const isRanapDetected = detectIsRawatInap(data) || detectIsRawatInap(resume);
  const mode = forcedMode || (isRanapDetected ? 'rawat_inap' : 'rawat_jalan');
  const isRawatInap = mode === 'rawat_inap' || mode === 'konsolidasi';
  const isRawatJalan = mode === 'rawat_jalan' || mode === 'konsolidasi';

  // 1. Identitas Pasien
  const namaPasien = data.nama_pasien || data.nama || resume.nama_pasien || 'Tn. Pasien';
  const noRm = data.no_rm || resume.no_rm || 'RM-001';
  
  const tglLahir = data.tgl_lahir || data.tanggal_lahir || patientRef.tanggal_lahir || '12 Mei 1985';
  const rawUmur = data.umur || resume.umur || patientRef.umur || 39;
  const tglLahirUmur = `${tglLahir} / ${rawUmur} Tahun`;

  let jk = data.jenis_kelamin || resume.jenis_kelamin || patientRef.jenis_kelamin || 'L';
  if (jk === 'L' || jk.toLowerCase() === 'laki-laki') jk = 'Laki-laki';
  else if (jk === 'P' || jk.toLowerCase() === 'perempuan') jk = 'Perempuan';

  const alamat = data.alamat || data.alamat_ktp || resume.alamat || patientRef.alamat || 'Jl. Raya TB Simatupang No. 1, Jakarta Selatan';
  const penanggungBiaya = data.penjamin || resume.penjamin || patientRef.penjamin || 'BPJS Kesehatan';

  // 2. Ringkasan Rawat Jalan
  const tglKunjungan = data.tgl_kunjungan || data.tgl_periksa || data.tanggal || resume.tgl_masuk || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const poliklinik = data.poliklinik || data.poli || resume.unit_pelayanan || data.unit_pelayanan || 'Poli Penyakit Dalam';
  
  const keluhanUtama = resume.keluhan_utama || data.keluhan_utama || data.keluhan || data.subjektif || 'Pasien datang untuk kontrol klinis dan pemeriksaan rutin.';
  
  // Pemeriksaan fisik akhir
  const vitals = resume.tanda_vital || data.tanda_vital || data.vitalSigns || {};
  const td = vitals.td || vitals.tekananDarah || vitals.bp || '120/80 mmHg';
  const nadi = vitals.nadi || vitals.hr || '80 x/mnt';
  const suhu = vitals.suhu || vitals.temp || '36.5 °C';
  const rr = vitals.rr || '18 x/mnt';
  const spo2 = vitals.spo2 || '99 %';
  const gcs = vitals.gcs || 'Compos Mentis (E4V5M6)';
  
  const physicalNotes = resume.pemeriksaan_fisik || data.pemeriksaan_fisik || data.objektif || 'Cor: S1-S2 murni reguler. Pulmo: suara nafas vesikuler (+/+), wheezing (-/-), rhonki (-/-). Abdomen: supel, BU (+) normal. Ekstremitas: akral hangat, CRT < 2 detik.';
  const pemeriksaanFisikAkhir = `Tanda vital: TD: ${td}, Nadi: ${nadi}, Suhu: ${suhu}, Pernapasan: ${rr}, SpO2: ${spo2}, Kesadaran: ${gcs}. Temuan Klinis: ${physicalNotes}`;

  // Diagnosis Rawat Jalan
  const diagPrimer = resume.diagnosis_primer || data.diagnosis_utama || (typeof data.diagnosis === 'object' ? data.diagnosis : { nama: data.diagnosis || data.diagnosa || 'Hipertensi Primer', kode_icd10: data.kode_icd10 || 'I10' });
  const diagnosisRawatJalan = `${diagPrimer.nama || 'Penyakit Dalam'} [ICD-10: ${diagPrimer.kode_icd10 || 'I10'}]`;

  // Alasan Alih Rawat (Inap)
  const alasanAlihRawatInap = data.alasan_alih_rawat || resume.alasan_alih_rawat || (
    isRanapDetected 
      ? 'Indikasi medis memerlukan pemantauan ketat hemodinamik, hidrasi intravena, dan evaluasi berkala' 
      : 'Tidak Ada / Pasien Berobat Jalan Murni'
  );

  // 3. Ringkasan Rawat Inap (Konsolidasi)
  const tglMasukRs = data.tgl_masuk || resume.tgl_masuk || data.tanggal_masuk || '18 September 2026';
  const tglKeluarRs = data.tgl_keluar || resume.tgl_keluar || data.tanggal_keluar || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const ruangRawatTerakhir = data.ruangan || data.kamar || resume.unit_pelayanan || 'Bangsal Teratai (Kamar 302)';
  const lamaRawatInap = String(data.lama_rawat || resume.lama_rawat || '3');

  const diagnosisUtamaAkhir = diagPrimer.nama || data.diagnosa || 'Dengue Fever / Demam Berdarah Dengue';
  const kodeIcd10Utama = diagPrimer.kode_icd10 || data.kode_icd10 || 'A90';

  let diagnosisSekunderKomorbid = 'Tidak Ada Diagnosis Sekunder';
  let kodeIcd10Sekunder = '-';
  if (Array.isArray(resume.diagnosis_sekunder) && resume.diagnosis_sekunder.length > 0) {
    diagnosisSekunderKomorbid = resume.diagnosis_sekunder.map((d: any) => d.nama).join(', ');
    kodeIcd10Sekunder = resume.diagnosis_sekunder.map((d: any) => d.kode_icd10 || '-').join(', ');
  } else if (Array.isArray(data.diagnosis_sekunder) && data.diagnosis_sekunder.length > 0) {
    diagnosisSekunderKomorbid = data.diagnosis_sekunder.map((d: any) => (typeof d === 'string' ? d : d.nama)).join(', ');
    kodeIcd10Sekunder = data.diagnosis_sekunder.map((d: any) => (typeof d === 'string' ? (d.match(/^[A-Z][0-9.]+/)?.[0] || '-') : d.kode || d.kode_icd10 || '-')).join(', ');
  }

  // Hasil Pemeriksaan Penunjang
  let hasilPemeriksaanPenunjang = 'Laboratorium Darah Lengkap: Hb 14.1 g/dL, Leukosit 7.200/µL, Trombosit 215.000/µL, GDS 110 mg/dL. Rontgen Thorax: Cor dan pulmo tidak tampak kelainan aktif. EKG: Sinus Rhythm 80 bpm.';
  if (resume.pemeriksaan_penunjang) {
    if (typeof resume.pemeriksaan_penunjang === 'string') {
      hasilPemeriksaanPenunjang = resume.pemeriksaan_penunjang;
    } else {
      const parts: string[] = [];
      if (resume.pemeriksaan_penunjang.lab) parts.push(`Laboratorium: ${resume.pemeriksaan_penunjang.lab}`);
      if (resume.pemeriksaan_penunjang.radiologi) parts.push(`Radiologi: ${resume.pemeriksaan_penunjang.radiologi}`);
      if (resume.pemeriksaan_penunjang.ekg) parts.push(`EKG: ${resume.pemeriksaan_penunjang.ekg}`);
      if (parts.length > 0) hasilPemeriksaanPenunjang = parts.join(' | ');
    }
  } else if (data.hasil_penunjang) {
    hasilPemeriksaanPenunjang = typeof data.hasil_penunjang === 'string' 
      ? data.hasil_penunjang 
      : `Lab: ${data.hasil_penunjang.lab || 'Normal'} | Radiologi: ${data.hasil_penunjang.radiologi || 'Normal'}`;
  }

  // Tindakan Medis / Operasi
  let tindakanMedisOperasi = 'Tidak Ada (Tindakan Konservatif & Pemantauan Rawat Inap)';
  if (Array.isArray(resume.tindakan_prosedur) && resume.tindakan_prosedur.length > 0) {
    tindakanMedisOperasi = resume.tindakan_prosedur.map((t: any) => `${t.nama} [ICD-9 CM: ${t.kode_icd9 || '-'}]`).join('; ');
  } else if (Array.isArray(data.tindakan_medis) && data.tindakan_medis.length > 0) {
    tindakanMedisOperasi = data.tindakan_medis.map((t: any) => `${t.nama} [ICD-9 CM: ${t.kode || '-'}]`).join('; ');
  } else if (data.tindakan) {
    tindakanMedisOperasi = String(data.tindakan);
  }

  // Perjalanan Penyakit / Evolusi
  const perjalananPenyakitEvolusi = resume.riwayat_penyakit_sekarang || data.perjalanan_penyakit || (
    `Hari ke-1: Pasien masuk rawat dengan keluhan akut, hemodinamik dipantau, terapi rehidrasi intravena dan simtomatik dimulai. ` +
    `Hari ke-2: Demam mereda, keluhan mual/pusing berkurang, asupan makan dan minum per oral membaik. ` +
    `Hari ke-3: Tanda vital stabil, hasil laboratorium serial menunjukkan perbaikan signifikan, pasien mobilisasi mandiri tanpa keluhan dan diizinkan pulang.`
  );

  // Kondisi Saat Keluar RS
  const kondisiSaatKeluarRs = data.kondisi_pulang || resume.kondisi_pulang || 'Membaik';

  // 4. Rencana Tindak Lanjut & Instruksi Pulang
  let terapiObatPulang = '1. Paracetamol 500 mg: 3x1 tablet (sesudah makan bila demam/nyeri)\n2. Multivitamin & Mineral: 1x1 tablet sehari (pagi sesudah makan, selama 10 hari)\n3. Amoxicillin 500 mg: 3x1 tablet sehari (tiap 8 jam dihabiskan, selama 5 hari)';
  if (Array.isArray(resume.obat_pulang) && resume.obat_pulang.length > 0) {
    terapiObatPulang = resume.obat_pulang.map((o: any, idx: number) => 
      `${idx + 1}. ${o.nama_obat || o.nama} (${o.dosis || '-'}): ${o.aturan_pakai || o.frekuensi || '3x1 sehari'} - ${o.jumlah || '10 tab'}`
    ).join('\n');
  } else if (Array.isArray(data.terapi_obat) && data.terapi_obat.length > 0) {
    terapiObatPulang = data.terapi_obat.map((o: any, idx: number) => 
      `${idx + 1}. ${o.nama || o.obat} (${o.sediaan || 'Tablet'}): ${o.dosis_aturan || '3x1'} - ${o.durasi || '5 Hari'}`
    ).join('\n');
  }

  const instruksiDietEdukasi = resume.instruksi_edukasi || data.edukasi_instruksi || data.edukasi || (
    'Istirahat yang cukup di rumah minimal 3 hari. Hindari aktivitas fisik berat. ' +
    'Jaga pola makan gizi seimbang, cukupi asupan cairan 2-2.5 liter per hari, dan patuhi jadwal minum obat. ' +
    'Segera kembali ke IGD jika timbul tanda bahaya: sesak napas berat, muntah terus-menerus, perdarahan spontan, atau penurunan kesadaran.'
  );

  const jadwalKontrolKembali = resume.jadwal_kontrol || data.jadwal_kontrol || (
    `Hari/Tanggal: Senin, 28 September 2026 ke Poliklinik: ${poliklinik}`
  );

  // Pengesahan
  const kotaRs = data.kota || 'Jakarta Selatan';
  const tglDikeluarkan = tglKeluarRs || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const namaPasienKeluarga = namaPasien;
  const namaDokterDpjp = data.dokter_dpjp || resume.dokter_dpjp || data.dokter || 'dr. Budi Santoso, Sp.PD';
  const sipDokter = data.sip || resume.sip || '503/SIP-DS/DKK/2023';
  const qrValidationCode = `RME-RES-${noRm}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    isRawatInap,
    isRawatJalan,
    mode,
    namaPasien,
    noRm,
    tglLahirUmur,
    jenisKelamin: jk,
    alamat,
    penanggungBiaya,
    tglKunjungan,
    poliklinik,
    keluhanUtama,
    pemeriksaanFisikAkhir,
    diagnosisRawatJalan,
    alasanAlihRawatInap,
    tglMasukRs,
    tglKeluarRs,
    ruangRawatTerakhir,
    lamaRawatInap,
    diagnosisUtamaAkhir,
    kodeIcd10Utama,
    diagnosisSekunderKomorbid,
    kodeIcd10Sekunder,
    hasilPemeriksaanPenunjang,
    tindakanMedisOperasi,
    perjalananPenyakitEvolusi,
    kondisiSaatKeluarRs,
    terapiObatPulang,
    instruksiDietEdukasi,
    jadwalKontrolKembali,
    kotaRs,
    tglDikeluarkan,
    namaPasienKeluarga,
    namaDokterDpjp,
    sipDokter,
    qrValidationCode
  };
}
