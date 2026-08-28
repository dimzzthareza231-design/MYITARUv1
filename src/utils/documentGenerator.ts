import { 
  HospitalDocumentModel, 
  DocumentType, 
  DEFAULT_HOSPITAL_INFO,
  TableItemRow 
} from '../types/document';
import { SEMUA_DOKTER, MASTER_POLIKLINIK } from '../data/seedData';

/**
 * Helper to find matching doctor and specialty based on unit/poli
 */
export function getDoctorForPoli(poliOrUnit?: string, fallbackDoctor?: string): { doctor: string; gelar: string; sip: string; unit: string; spesialisasi: string } {
  const defaultPoli = 'Poliklinik Penyakit Dalam';
  const targetUnit = (poliOrUnit || '').trim();

  // If specific fallback doctor is provided and not default, check if we can match
  if (fallbackDoctor && fallbackDoctor !== 'dr. Amelia Putri, Sp.N') {
    const matchedDoc = SEMUA_DOKTER.find(d => d.nama.toLowerCase().includes(fallbackDoctor.toLowerCase()) || fallbackDoctor.toLowerCase().includes(d.nama.toLowerCase()));
    if (matchedDoc) {
      return {
        doctor: matchedDoc.nama,
        gelar: matchedDoc.spesialis || 'Spesialis',
        sip: matchedDoc.sip || `SIP: 445/DS/${matchedDoc.id}/2025`,
        unit: matchedDoc.poli,
        spesialisasi: matchedDoc.spesialis
      };
    }
  }

  // Find doctor based on poli/unit name or keywords
  if (targetUnit) {
    const cleanUnit = targetUnit.toLowerCase();
    const matchedDoc = SEMUA_DOKTER.find(d => {
      const pName = d.poli.toLowerCase();
      const pCode = d.poli_id.toLowerCase();
      const pPlacement = (d.penempatan || '').toLowerCase();
      return cleanUnit.includes(pName) || pName.includes(cleanUnit) || cleanUnit.includes(pCode) || cleanUnit.includes(pPlacement);
    });

    if (matchedDoc) {
      return {
        doctor: matchedDoc.nama,
        gelar: matchedDoc.spesialis || 'Spesialis',
        sip: matchedDoc.sip || `SIP: 445/DS/${matchedDoc.id}/2025`,
        unit: matchedDoc.poli,
        spesialisasi: matchedDoc.spesialis
      };
    }

    // Match keywords like 'saraf', 'bedah', 'anak', 'kandungan', 'jantung', 'mata', 'gigi', 'tht', 'kulit', 'paru', 'jiwa', 'urologi', 'orthopedi', 'internis', 'igd', 'umum', 'lab', 'radiologi'
    const keywordMap: Record<string, string> = {
      'saraf': 'POL-08',
      'neurologi': 'POL-08',
      'anak': 'POL-04',
      'pediatri': 'POL-04',
      'obgyn': 'POL-03',
      'kandungan': 'POL-03',
      'kebidanan': 'POL-03',
      'bedah': 'POL-05',
      'jantung': 'POL-07',
      'kardiologi': 'POL-07',
      'mata': 'POL-06',
      'oftalmologi': 'POL-06',
      'tht': 'POL-09',
      'kulit': 'POL-10',
      'dermatologi': 'POL-10',
      'paru': 'POL-11',
      'pulmonologi': 'POL-11',
      'jiwa': 'POL-12',
      'psikiatri': 'POL-12',
      'urologi': 'POL-13',
      'orthopedi': 'POL-14',
      'tulang': 'POL-14',
      'gigi': 'POL-15',
      'internis': 'POL-16',
      'dalam': 'POL-16',
      'onkologi': 'POL-17',
      'geriatri': 'POL-18',
      'endokrin': 'POL-19',
      'igd': 'POL-02',
      'darurat': 'POL-02',
      'emergency': 'POL-02',
      'umum': 'POL-01',
      'mcu': 'POL-24'
    };

    for (const [kw, poliId] of Object.entries(keywordMap)) {
      if (cleanUnit.includes(kw)) {
        const doc = SEMUA_DOKTER.find(d => d.poli_id === poliId);
        if (doc) {
          return {
            doctor: doc.nama,
            gelar: doc.spesialis || 'Spesialis',
            sip: doc.sip || `SIP: 445/DS/${doc.id}/2025`,
            unit: doc.poli,
            spesialisasi: doc.spesialis
          };
        }
      }
    }
  }

  // Default fallback to first doctor in Internis/Penyakit Dalam
  const defaultDoc = SEMUA_DOKTER.find(d => d.poli_id === 'POL-16') || SEMUA_DOKTER[0];
  return {
    doctor: fallbackDoctor || defaultDoc.nama,
    gelar: defaultDoc.spesialis || 'Sp.PD (Penyakit Dalam)',
    sip: defaultDoc.sip || 'SIP: 445/DS/101/2025',
    unit: targetUnit || defaultDoc.poli,
    spesialisasi: defaultDoc.spesialis
  };
}

/**
 * Creates a comprehensive HospitalDocumentModel from any object/record in the HIS
 */
export function generateHospitalDocument(
  data: Record<string, any> = {},
  docType: DocumentType = 'resume_medis',
  customTitle?: string
): HospitalDocumentModel {
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const yearStr = today.getFullYear();
  const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][today.getMonth()];

  // Extract or generate Document Number
  const docNumber = data.no_resume || data.no_dokumen || data.no_sep || data.nomor_surat || 
    `RS/RME/${yearStr}/${monthRoman}/${String(data.no_rm || data.id || '452-99-10').replace(/[^a-zA-Z0-9-]/g, '')}`;

  // Subject/Patient Demographics
  const subjectName = data.nama_pasien || data.nama || data.pasien_nama || data.nama_pegawai || 'Budi Santoso, S.Kom';
  const noRm = data.no_rm || data.norm || (data.nip ? undefined : 'RM-2608-0194');
  const nip = data.nip || data.no_induk || (data.no_rm ? undefined : '198812122022011002');
  const nik = data.nik || data.no_ktp || '3174011212880005';
  const gender = data.jenis_kelamin || data.jk || data.gender || 'L';
  const birthPlace = data.tempat_lahir || data.tmp_lahir || 'Jakarta';
  const birthDate = data.tanggal_lahir || data.tgl_lahir || data.ttl || '12 Desember 1988';
  const age = data.umur || data.usia || '37';
  const bloodType = data.golongan_darah || data.gol_darah || 'O (Rh+)';
  const maritalStatus = data.status_pernikahan || data.status_nikah || 'Menikah';
  const religion = data.agama || 'Islam';
  const education = data.pendidikan || 'S1 Teknik Informatika';
  const occupation = data.pekerjaan || 'Karyawan Swasta';
  const addressKtp = data.alamat_ktp || data.alamat || 'Jl. Raya TB Simatupang No. 88 RT 004/RW 005, Cilandak, Jakarta Selatan 12550';
  const addressDomisili = data.alamat_domisili || addressKtp;
  const phone = data.telepon || data.no_hp || data.kontak || '0812-8899-2345';
  
  // Emergency Contact
  const emergencyContact = data.kontak_darurat || {
    nama: data.nama_wali || 'Siti Rahmawati (Istri)',
    hubungan: 'Istri / Keluarga Terdekat',
    telepon: '0813-7744-9911'
  };

  // Resolve Unit & Matching Doctor in that Clinic/Poli
  const inputUnit = data.unit_pelayanan || data.poli || data.poli_nama || data.divisi || data.departemen || data.layanan || '';
  const inputDoctor = data.dokter_dpjp || data.dokter || data.dpjp || data.atasan;
  const resolvedDoctorInfo = getDoctorForPoli(inputUnit, inputDoctor);

  const unit = inputUnit || resolvedDoctorInfo.unit;
  const doctor = inputDoctor || resolvedDoctorInfo.doctor;
  const doctorSpecialty = data.spesialisasi_dpjp || data.spesialisasi || resolvedDoctorInfo.spesialisasi;
  const doctorSip = data.sip || data.nip_dokter || resolvedDoctorInfo.sip;

  const guarantor = data.penjamin || data.asuransi || data.tipe_pembayaran || 'BPJS Kesehatan (JKN-PBI)';
  const bpjsCardNo = data.no_kartu_bpjs || data.no_kartu || '0001889234551';
  const sepNumber = data.no_sep || `0194R0010826V00${Math.floor(1000 + Math.random() * 9000)}`;
  const examDate = data.tanggal || data.tgl_periksa || data.tgl_masuk || dateFormatted;
  const visitType = data.tipe_kunjungan || data.jenis_kunjungan || (data.ruangan ? 'Rawat Inap' : 'Rawat Jalan (Poli Spesialis)');

  // Title logic
  let title = customTitle;
  if (!title) {
    switch (docType) {
      case 'resume_medis':
        title = 'RINGKASAN REKAM MEDIS ELEKTRONIK (RESUME MEDIS RAWAT JALAN & INAP)';
        break;
      case 'surat_keterangan_sakit':
        title = 'SURAT KETERANGAN DOKTER (SURAT ISTIRAHAT SAKIT)';
        break;
      case 'surat_keterangan_sehat':
        title = 'SURAT KETERANGAN KESEHATAN JASMANI & BEBAS NARKOBA';
        break;
      case 'surat_rujukan':
        title = 'SURAT RUJUKAN PASIEN ANTAR FASILITAS PELAYANAN KESEHATAN (FKTL)';
        break;
      case 'hasil_laboratorium':
        title = 'LEMBAR HASIL PEMERIKSAAN LABORATORIUM PATOLOGI KLINIK';
        break;
      case 'hasil_radiologi':
        title = 'LEMBAR HASIL DIAGNOSTIK RADIOLOGI & PENCITRAAN MEDIS';
        break;
      case 'kuitansi_billing':
        title = 'RINCIAN BIAYA PELAYANAN MEDIS & KUITANSI PEMBAYARAN';
        break;
      case 'profil_sdm':
        title = 'BIODATA RESMI & SURAT KETERANGAN KEPEGAWAIAN RUMAH SAKIT';
        break;
      case 'laporan_insiden':
        title = 'LAPORAN INVESTIGASI INSIDEN KESELAMATAN PASIEN (IKP)';
        break;
      case 'sep_bpjs':
        title = 'SURAT ELEGIBILITAS PESERTA (SEP) BPJS KESEHATAN RI';
        break;
      default:
        title = 'LEMBAR REKAM MEDIS ELEKTRONIK RESMI RUMAH SAKIT';
    }
  }

  // Riwayat Alergi (Clinical Alerts)
  let riwayatAlergi = data.alergi || data.riwayat_alergi || (data.allergies ? data.allergies.map((a: any) => ({
    tipe: a.tipe || 'Umum',
    alergen: a.allergen || a.nama || '',
    reaksi: a.reaction || a.reaksi || '',
    derajat: a.severity || a.derajat || 'Sedang'
  })) : null);

  if (!riwayatAlergi || (Array.isArray(riwayatAlergi) && riwayatAlergi.length === 0)) {
    riwayatAlergi = [
      { tipe: 'Obat', alergen: 'Amoxicillin / Golongan Penisilin', reaksi: 'Urtikaria & Gatal-gatal pada kulit', derajat: 'Sedang' },
      { tipe: 'Makanan', alergen: 'Udang / Seafood', reaksi: 'Bibir bengkak ringan', derajat: 'Ringan' }
    ];
  }

  const riwayatPenyakitDahulu = data.rpd || data.riwayat_penyakit_dahulu || 'Hipertensi Grade I sejak 2 tahun yang lalu, Gastritis Kronis.';
  const riwayatPenyakitKeluarga = data.rpk || data.riwayat_penyakit_keluarga || 'Ayah memiliki riwayat Hipertensi dan Penyakit Jantung Koroner; Ibu menderita DM Tipe 2.';
  const riwayatPengobatanRutin = data.riwayat_pengobatan || 'Amlodipine 5 mg (1x sehari malam), Antasida DOEN tablet kunyah prn.';

  // Anamnesis / Clinical Narrative
  const keluhanUtama = data.keluhan_utama || data.keluhan || data.subjektif || 'Pusing berputar mendadak (vertigo) dan nyeri tengkuk sejak 2 hari yang lalu.';
  const riwayatPenyakitSekarang = data.rps || data.riwayat_penyakit_sekarang ||
    `Pasien datang mengeluhkan pusing berputar yang memberat terutama saat perubahan posisi kepala mendadak (menoleh ke kanan atau bangun tidur). Keluhan disertai mual, keringat dingin, dan sensasi melayang. Tidak ada riwayat penurunan kesadaran, muntah proyektil, kejang, kelemahan anggota gerak sesisi, ataupun gangguan pendengaran berdenging (tinnitus). Nafsu makan menurun karena mual.`;
  
  const tinjauanSistem = data.tinjauan_sistem || 'Mata: Pandangan kabur saat serangan (-), THT: Gangguan pendengaran (-), Cardiorespirasi: Sesak nafas (-), Nyeri dada (-), Gastrointestinal: Mual (+), Muntah (-), Pola BAK/BAB normal.';
  const anamnesis = `${keluhanUtama} \n\nRiwayat Penyakit Sekarang: ${riwayatPenyakitSekarang}`;

  // Vital Signs Calculation & Formatting
  const rawBb = parseFloat(String(data.bb || data.tanda_vital?.bb || '68'));
  const rawTb = parseFloat(String(data.tb || data.tanda_vital?.tb || '170'));
  let imtValue = '23.5';
  let imtCategory = 'Normal / Normoweight';
  if (rawBb > 0 && rawTb > 0) {
    const tbMeter = rawTb / 100;
    const calc = rawBb / (tbMeter * tbMeter);
    imtValue = calc.toFixed(1);
    if (calc < 18.5) imtCategory = 'Underweight (Kurang BB)';
    else if (calc < 25) imtCategory = 'Normal / Ideal';
    else if (calc < 30) imtCategory = 'Overweight (Kelebihan BB)';
    else imtCategory = 'Obesitas';
  }

  const tandaVital = {
    tekananDarah: data.tekanan_darah || data.tanda_vital?.tekananDarah || data.tanda_vital?.bp || data.tanda_vital?.td || '130/85 mmHg',
    nadi: data.nadi || data.tanda_vital?.nadi || data.tanda_vital?.hr || '82 x/mnt (Reguler, isi cukup)',
    suhu: data.suhu || data.tanda_vital?.suhu || data.tanda_vital?.temp || '36.7 °C (Aksila)',
    rr: data.rr || data.tanda_vital?.rr || '18 x/mnt (Pola torakoabdominal)',
    spo2: data.spo2 || data.tanda_vital?.spo2 || '99 % pada udara ruangan',
    bb: `${rawBb}`,
    tb: `${rawTb}`,
    imt: `${imtValue} kg/m²`,
    kategoriImt: imtCategory,
    lingkarPerut: data.lingkar_perut || '82 cm',
    kesadaran: data.kesadaran || 'Compos Mentis (Sadar Penuh)',
    gcs: data.gcs || 'E4 V5 M6 (Total: 15)',
    skalaNyeri: data.skala_nyeri || data.tanda_vital?.skala_nyeri || '3 / 10 (NRS - Nyeri Ringan)',
    lokasiNyeri: data.lokasi_nyeri || data.tanda_vital?.lokasi_nyeri || 'Area oksipital dan leher belakang'
  };

  // Pemeriksaan Fisik Sistemik
  const pemeriksaanSistemik = {
    kepalaLeher: data.kepala_leher || 'Normocephalic, tidak ada deformitas/jejas. JVP 5-2 cmH2O (normal), tidak teraba pembesaran kelenjar getah bening (KGB) maupun tiroid.',
    mata: data.mata || 'Konjungtiva anemis (-/-), Sklera ikterik (-/-), Pupil isokor diameter 3mm/3mm, Refleks cahaya langsung (+/+), Refleks konsensual (+/+). Nistagmus horizontal (+) saat manuver Dix-Hallpike.',
    tht: data.tht || 'Liang telinga lapang, membran timpani intak berkilau, refleks cahaya cone of light (+/+), serumen (-/-). Hidung dan tenggorokan: Faring hiperemis (-), tonsil T1/T1 tenang.',
    thoraxCor: data.thorax_cor || 'Inspeksi: Ictus cordis tidak tampak. Palpasi: Ictus cordis teraba di ICS V linea midclavicularis sinistra. Perkusi: Batas jantung dalam batas normal. Auskultasi: Bunyi Jantung I-II murni reguler, gallop (-), murmur (-).',
    thoraxPulmo: data.thorax_pulmo || 'Inspeksi: Simetris statis & dinamis, tidak ada retraksi interkostal. Palpasi: Fremitus taktil simetris kanan = kiri. Perkusi: Sonor di seluruh lapang paru. Auskultasi: Suara nafas vesikuler (+/+), Ronkhi (-/-), Wheezing (-/-).',
    abdomen: data.abdomen || 'Inspeksi: Perut datar, venektasi (-). Auskultasi: Bising usus (+) normal 12x/menit. Perkusi: Timpani seluruh regio, pekak hepar normal, shifting dullness (-). Palpasi: Supel, nyeri tekan epigastrium (-), hepar dan lien tidak teraba membesar.',
    ekstremitas: data.ekstremitas || 'Akral hangat di 4 ekstremitas, Capillary Refill Time (CRT) < 2 detik, pitting edema pretibial (-/-), turgor kulit baik elastis.',
    neurologis: data.neurologis || 'Motorik: 5/5/5/5 di keempat ekstremitas, tonus normal. Sensorik: Eksteroseptif & proprioseptif dalam batas normal. Tes Romberg: goyang dengan mata tertutup (+). Tes Disdiadokokinesis: normal. Tes Tumit-Lutut: normal.',
    statusLokalis: data.status_lokalis || 'Pemeriksaan Posisi Dix-Hallpike: Memunculkan nistagmus torsional ke arah kanan dengan periode latensi 3 detik dan durasi < 30 detik (fatigue +).'
  };

  // Diagnosis
  const problemUtama = Array.isArray(data.problem_list) && data.problem_list.length > 0 ? data.problem_list[0] : null;
  const diagnosisUtama = {
    kode: data.kode_icd10 || data.diagnosis_utama?.kode_icd10 || problemUtama?.kode_icd10 || data.diagnosis_utama_kode || (typeof data.diagnosis === 'string' ? 'H81.1' : (data.diagnosis?.kode || 'H81.1')),
    nama: data.diagnosis_utama?.nama || problemUtama?.nama || (typeof data.diagnosis_utama === 'string' ? data.diagnosis_utama : (typeof data.diagnosis === 'string' ? data.diagnosis : (data.diagnosis?.nama || 'Benign Paroxysmal Positional Vertigo (BPPV) / Vertigo Posisional Paroksismal Jinak'))),
    deskripsi: data.diagnosis_utama?.deskripsi || 'Sesuai dengan kriteria klinis anamnesis dan pemeriksaan fisik.'
  };

  const diagnosisSekunder = data.diagnosis_sekunder?.length ? data.diagnosis_sekunder.map((s: any) => 
    typeof s === 'string' ? { nama: s, kode: s.match(/^[A-Z][0-9.]+/)?.[0] || 'I10' } : { kode: s.kode || s.kode_icd10 || 'I10', nama: s.nama || s.desc }
  ) : (data.problem_list?.length > 1 ? data.problem_list.slice(1).map((s: any) => ({ kode: s.kode_icd10 || 'I10', nama: s.nama })) : [
    { kode: 'I10', nama: 'Essential (Primary) Hypertension / Hipertensi Primer' },
    { kode: 'K29.7', nama: 'Gastritis, unspecified / Dispepsia Fungsional' }
  ]);

  const diagnosisBanding = data.diagnosis_banding || [
    'Vestibular Neuritis / Labirintitis Akut',
    'Penyakit Meniere (Meniere Disease)',
    'Vertebrobasilar Insufficiency (Transient Ischemic Attack)'
  ];

  // Tindakan Medis ICD-9-CM
  const tindakanMedis = data.tindakan_medis || [
    { kode: '95.41', nama: 'Audiometry & Vestibular Function Test', keterangan: 'Evaluasi fungsi vestibuler dan kanal telinga dalam' },
    { kode: '93.89', nama: 'Epley Canalith Repositioning Maneuver (Kanal Kanan)', keterangan: 'Reposisi otolit kristal kanalis semisirkularis posterior' },
    { kode: '89.07', nama: 'Konsultasi & Edukasi Gaya Hidup Dokter Spesialis', keterangan: 'Penjelasan latihan Brandt-Daroff dan pencegahan serangan ulang' }
  ];

  // Terapi / Prescription Table
  let terapiObat: TableItemRow[] = [];
  if (Array.isArray(data.terapi_obat) && data.terapi_obat.length > 0) {
    terapiObat = data.terapi_obat.map((o: any, idx: number) => ({
      no: idx + 1,
      nama: o.nama || o.obat || o.item || `Obat ${idx + 1}`,
      sediaan: o.sediaan || 'Tablet',
      dosis_aturan: o.dosis || o.signa || o.aturan_pakai || '3 x 1 tablet sehari (Sesudah Makan)',
      rute: o.rute || 'Oral',
      durasi: o.durasi || '5 Hari',
      jumlah: o.jumlah || o.qty || '15 Tab',
      indikasi: o.indikasi || 'Anti-vertigo & vasodilator labirin',
      keterangan: o.keterangan || o.catatan || 'Minum secara teratur sesudah makan'
    }));
  } else if (Array.isArray(data.resep) && data.resep.length > 0) {
    terapiObat = data.resep.map((o: any, idx: number) => ({
      no: idx + 1,
      nama: o.nama || o.obat || `Obat ${idx + 1}`,
      sediaan: o.sediaan || 'Tablet / Kapsul',
      dosis_aturan: o.aturan_pakai || o.dosis || '1 x 1 tablet sehari',
      rute: 'Oral',
      durasi: '5 Hari',
      jumlah: o.qty || 10,
      indikasi: 'Pengobatan simtomatik',
      keterangan: o.keterangan || 'Sesudah Makan'
    }));
  } else if (Array.isArray(data.medications) && data.medications.length > 0) {
    terapiObat = data.medications.map((o: any, idx: number) => ({
      no: idx + 1,
      nama: o.name || o.nama || `Obat ${idx + 1}`,
      sediaan: o.dose?.split('-')?.[1]?.trim() || o.sediaan || 'Tablet / Kapsul',
      dosis_aturan: o.frequency || o.aturan_pakai || o.dosis || '1 x 1 tablet sehari',
      rute: o.dose?.split('-')?.[1]?.trim() || 'Oral',
      durasi: '5 Hari',
      jumlah: o.qty || 10,
      indikasi: o.indikasi || 'Pengobatan simtomatik',
      keterangan: o.keterangan || 'Sesudah Makan'
    }));
  } else {
    // Default complete realistic prescription
    terapiObat = [
      { 
        no: 1, 
        nama: 'Betahistine Dihydrochloride 24 mg', 
        sediaan: 'Tablet',
        dosis_aturan: '2 x 1 tablet sehari (Tiap 12 Jam)', 
        rute: 'Oral',
        durasi: '7 Hari',
        jumlah: '14 Tablet',
        indikasi: 'Mengurangi frekuensi dan intensitas vertigo perifer',
        keterangan: 'Diminum teratur sesudah makan pagi & malam' 
      },
      { 
        no: 2, 
        nama: 'Dimenhydrinate 50 mg', 
        sediaan: 'Tablet',
        dosis_aturan: '1 x 1 tablet sehari (PRN jika mual/pusing berat)', 
        rute: 'Oral',
        durasi: '3 Hari',
        jumlah: '5 Tablet',
        indikasi: 'Antiemetik & sedatif vestibular akut',
        keterangan: 'Hanya jika mual hebat; dapat menyebabkan kantuk' 
      },
      { 
        no: 3, 
        nama: 'Mecobalamin 500 mcg', 
        sediaan: 'Kapsul',
        dosis_aturan: '3 x 1 kapsul sehari', 
        rute: 'Oral',
        durasi: '10 Hari',
        jumlah: '30 Kapsul',
        indikasi: 'Neuroprotektor dan suplemen serabut saraf',
        keterangan: 'Diminum sesudah makan' 
      },
      { 
        no: 4, 
        nama: 'Amlodipine Besylate 5 mg', 
        sediaan: 'Tablet',
        dosis_aturan: '1 x 1 tablet sehari pada malam hari (Pukul 20:00)', 
        rute: 'Oral',
        durasi: '30 Hari',
        jumlah: '30 Tablet',
        indikasi: 'Kontrol tekanan darah rutin (Antihipertensi)',
        keterangan: 'Lanjutkan terapi rutin hipertensi' 
      }
    ];
  }

  // Lab Results with reference ranges and flags
  let hasilPemeriksaanLab: TableItemRow[] = [];
  if (Array.isArray(data.hasil_lab) && data.hasil_lab.length > 0) {
    hasilPemeriksaanLab = data.hasil_lab;
  } else {
    hasilPemeriksaanLab = [
      { no: 1, nama: 'Hemoglobin (Hb)', hasil: '14.5', nilai_rujukan: '13.2 - 17.3', satuan: 'g/dL', flag: 'Normal', metode: 'Colorimetric' },
      { no: 2, nama: 'Hematokrit (Ht)', hasil: '43.2', nilai_rujukan: '40.0 - 52.0', satuan: '%', flag: 'Normal', metode: 'Automated Analyzer' },
      { no: 3, nama: 'Leukosit Total', hasil: '7.450', nilai_rujukan: '4.500 - 10.500', satuan: '/µL', flag: 'Normal', metode: 'Flow Cytometry' },
      { no: 4, nama: 'Trombosit', hasil: '254.000', nilai_rujukan: '150.000 - 450.000', satuan: '/µL', flag: 'Normal', metode: 'Impedance' },
      { no: 5, nama: 'Gula Darah Sewaktu (GDS)', hasil: '108', nilai_rujukan: '< 140', satuan: 'mg/dL', flag: 'Normal', metode: 'Hexokinase' },
      { no: 6, nama: 'Ureum Darah', hasil: '26.4', nilai_rujukan: '15.0 - 45.0', satuan: 'mg/dL', flag: 'Normal', metode: 'Enzymatic GLDH' },
      { no: 7, nama: 'Kreatinin Serum', hasil: '0.92', nilai_rujukan: '0.70 - 1.30', satuan: 'mg/dL', flag: 'Normal', metode: 'Jaffe Modified' },
      { no: 8, nama: 'Kolesterol Total', hasil: '194', nilai_rujukan: '< 200', satuan: 'mg/dL', flag: 'Normal', metode: 'CHOD-PAP' },
      { no: 9, nama: 'Elektrolit Natrium (Na+)', hasil: '141', nilai_rujukan: '135 - 147', satuan: 'mmol/L', flag: 'Normal', metode: 'ISE Direct' },
      { no: 10, nama: 'Elektrolit Kalium (K+)', hasil: '4.1', nilai_rujukan: '3.5 - 5.1', satuan: 'mmol/L', flag: 'Normal', metode: 'ISE Direct' }
    ];
  }

  // Radiologi & Pemeriksaan Imaging
  const hasilRadiologi = data.hasil_radiologi || [
    {
      jenis: 'Rontgen Foto Thorax AP/PA',
      tanggal: examDate,
      ekspertise: 'Cor: Bentuk dan ukuran normal, CTR < 50%. Pulmo: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat/konsolidasi aktif maupun massa. Sinus kostofrenikus kanan dan kiri tajam. Diafragma kanan dan kiri licin dan simetris. Tulang kosta dan klavikula intak.',
      kesimpulan: 'Foto Thorax dalam batas normal (Cor dan Pulmo tidak tampak kelainan radiologis aktif).',
      dokterRadiologi: 'dr. Hendra Wijaya, Sp.Rad (K)'
    }
  ];

  // Billing Items
  let itemBilling: TableItemRow[] = [];
  if (Array.isArray(data.item_billing) && data.item_billing.length > 0) {
    itemBilling = data.item_billing;
  } else if (docType === 'kuitansi_billing' || data.total_tagihan) {
    itemBilling = [
      { no: 1, nama: 'Jasa Konsultasi & Pemeriksaan Dokter Spesialis Saraf / Sp.N', jumlah: 1, tarif: 300000, subtotal: 300000 },
      { no: 2, nama: 'Tindakan Diagnostik Vertigo & Manuver Reposisi Kanalith (Epley)', jumlah: 1, tarif: 250000, subtotal: 250000 },
      { no: 3, nama: 'Paket Pemeriksaan Laboratorium Darah Rutin + Fungsi Ginjal + Elektrolit', jumlah: 1, tarif: 380000, subtotal: 380000 },
      { no: 4, nama: 'Pemeriksaan Radiologi Foto Thorax Digital DR', jumlah: 1, tarif: 220000, subtotal: 220000 },
      { no: 5, nama: 'Farmasi & Obat Resep Pulang (Betahistine, Mecobalamin, Amlodipine)', jumlah: 1, tarif: 195000, subtotal: 195000 },
      { no: 6, nama: 'Biaya Administrasi & Sertifikasi Rekam Medis Elektronik (RME)', jumlah: 1, tarif: 35000, subtotal: 35000 }
    ];
  }

  // Education / Instructions
  const edukasiInstruksi = data.edukasi || data.instruksi || data.rencana || data.plan ||
    `1. Edukasi Patofisiologi: Telah dijelaskan kepada pasien dan keluarga mengenai penyebab vertigo (otolit terlepas di telinga dalam) dan prosedur manuver yang telah dilakukan.\n` +
    `2. Pembatasan Aktivitas Fisik: Hindari menggerakkan kepala secara mendadak atau menunduk/menengadah ekstrem selama 48 jam ke depan. Disarankan tidur dengan posisi kepala sedikit lebih tinggi (2 bantal).\n` +
    `3. Kepatuhan Pengobatan: Minum obat Betahistine secara teratur 2x sehari dan lanjutkan konsumsi obat hipertensi rutin.\n` +
    `4. Latihan Mandiri: Setelah 48 jam, bila masih ada rasa pusing ringan dapat melakukan senam Brandt-Daroff 3 set per hari di rumah.\n` +
    `5. Tanda Bahaya (Emergency Signs): Segera ke IGD RS Tarumanagara jika timbul kelemahan pada wajah/lengan/kaki, bicara pelo, pandangan ganda mendadak, atau muntah terus-menerus.`;

  const rencanaKontrol = data.jadwal_kontrol || data.rencana_kontrol || `Senin, 31 Agustus 2026 di ${unit} (Pukul 09:30 - 12:00 WIB, dengan ${doctor})`;

  // Prognosis
  const prognosis = data.prognosis || {
    vitam: 'Bonam (Baik)',
    functionam: 'Bonam (Baik)',
    sanationam: 'Dubia ad Bonam (Cenderung Baik)'
  };

  return {
    id: String(data.id || Date.now()),
    type: docType,
    nomorDokumen: docNumber,
    judulDokumen: title,
    subJudul: data.subjudul || 'MYITARU INTEGRATED HOSPITAL INFORMATION SYSTEM — ELECTRONIC MEDICAL RECORD',
    hospitalInfo: DEFAULT_HOSPITAL_INFO,
    subject: {
      nama: subjectName,
      no_rm: noRm,
      nip: nip,
      nik: nik,
      tempat_lahir: birthPlace,
      tgl_lahir: birthDate,
      umur: age,
      jenis_kelamin: gender,
      golongan_darah: bloodType,
      status_pernikahan: maritalStatus,
      agama: religion,
      pendidikan: education,
      pekerjaan: occupation,
      alamat: addressKtp,
      alamat_ktp: addressKtp,
      alamat_domisili: addressDomisili,
      telepon: phone,
      no_hp: phone,
      kontak_darurat: emergencyContact,
      penjamin: guarantor,
      no_kartu_bpjs: bpjsCardNo,
      no_sep: sepNumber,
      unit_pelayanan: unit,
      poli: unit,
      dokter_dpjp: doctor,
      dokter_pengirim: data.dokter_pengirim || 'dr. Maya Sartika, Sp.PD (Konsulen Rujukan Internal)',
      tgl_periksa: examDate,
      tgl_masuk: data.tgl_masuk || examDate,
      tgl_keluar: data.tgl_keluar || examDate,
      jam_masuk: data.jam_masuk || '08:45 WIB',
      jam_keluar: data.jam_keluar || '11:15 WIB',
      tipe_kunjungan: visitType,
      ruangan: data.ruangan || data.kamar,
      kelas_rawat: data.kelas_rawat || (data.ruangan ? 'Kelas I' : 'Rawat Jalan Reguler'),
      no_bed: data.no_bed || data.bed,
      jabatan: data.jabatan || (nip ? 'Staf Medis / Karyawan' : undefined),
      divisi: data.divisi || (nip ? 'Divisi Pelayanan Medik' : undefined)
    },
    riwayatAlergi: riwayatAlergi,
    riwayatPenyakitDahulu: riwayatPenyakitDahulu,
    riwayatPenyakitKeluarga: riwayatPenyakitKeluarga,
    riwayatPengobatanRutin: riwayatPengobatanRutin,
    anamnesis: anamnesis,
    keluhanUtama: keluhanUtama,
    riwayatPenyakitSekarang: riwayatPenyakitSekarang,
    tinjauanSistem: tinjauanSistem,
    pemeriksaanFisik: {
      tandaVital: tandaVital,
      catatanFisik: data.catatan_fisik || 'Tes Nistagmus Dix-Hallpike menunjukkan respon positif ke arah dekstra dengan periode latensi 3 detik. Tidak ditemukan tanda rangsang meningeal atau defisit neurologis fokal.',
      pemeriksaanSistemik: pemeriksaanSistemik
    },
    diagnosisUtama: diagnosisUtama,
    diagnosisSekunder: diagnosisSekunder,
    diagnosisBanding: diagnosisBanding,
    tindakanMedis: tindakanMedis,
    terapiObat: terapiObat,
    terapiNonFarmakologi: data.terapi_non_farmakologi || 'Manuver Reposisi Partikel Otolit Epley di klinik & Edukasi Latihan Vestibular Brandt-Daroff.',
    dietNutrisi: data.diet_nutrisi || 'Diet Lunak Rendah Garam (RGL) 1800 kkal/hari, batasi kafein dan asupan monosodium glutamat (MSG), minum air putih hangat 2-2.5 liter per hari.',
    hasilPemeriksaanLab: hasilPemeriksaanLab,
    hasilRadiologi: hasilRadiologi,
    hasilEkg: data.hasil_ekg || 'Sinus Rhythm 82 bpm, Normoaxis, Interval PR 0.16s, QRS 0.08s, tidak tampak tanda iskemia / infark miokard akut (T-Inverted/ST-Elevation negative).',
    itemBilling: itemBilling,
    edukasiInstruksi: edukasiInstruksi,
    rencanaKontrol: rencanaKontrol,
    prognosis: prognosis,
    kondisiPulang: data.kondisi_pulang || data.status || 'Perbaikan Klinis / Berobat Jalan Mandiri',
    catatanKhusus: data.catatan_khusus || 'Rekam Medis Elektronik ini telah divalidasi dan dienkripsi secara digital sesuai standar Permenkes RI No. 24 Tahun 2022 tentang Rekam Medis.',
    signer: {
      nama: doctor,
      gelar: data.gelar || doctorSpecialty || 'Spesialis',
      jabatan: data.signer_jabatan || (data.nip ? 'Direktur Sumber Daya Manusia' : 'Dokter Penanggung Jawab Pelayanan (DPJP),'),
      sip_nip: doctorSip,
      kota: 'Jakarta Selatan',
      tanggal: dateFormatted,
      digitalValidationCode: `VERIF-RS-${yearStr}-${Math.floor(10000 + Math.random() * 90000)}`
    },
    rawRecord: data
  };
}

