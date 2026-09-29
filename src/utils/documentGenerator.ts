import { 
  HospitalDocumentModel, 
  DocumentType, 
  DEFAULT_HOSPITAL_INFO,
  TableItemRow 
} from '../types/document';
import { SEMUA_DOKTER, MASTER_POLIKLINIK } from '../data/seedData';
import { detectIsRawatInap } from './resumeTemplateHelper';

/**
 * Helper to convert integer amount to Indonesian spelled words (Terbilang)
 */
export function numberToWordsId(amount: number): string {
  if (amount === 0) return 'Nol Rupiah';
  const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  
  function toWords(n: number): string {
    if (n < 12) return units[n];
    if (n < 20) return toWords(n - 10) + ' Belas';
    if (n < 100) return toWords(Math.floor(n / 10)) + ' Puluh' + (n % 10 !== 0 ? ' ' + toWords(n % 10) : '');
    if (n < 200) return 'Seratus' + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '');
    if (n < 1000) return toWords(Math.floor(n / 100)) + ' Ratus' + (n % 100 !== 0 ? ' ' + toWords(n % 100) : '');
    if (n < 2000) return 'Seribu' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
    if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' Ribu' + (n % 1000 !== 0 ? ' ' + toWords(n % 1000) : '');
    if (n < 1000000000) return toWords(Math.floor(n / 1000000)) + ' Juta' + (n % 1000000 !== 0 ? ' ' + toWords(n % 1000000) : '');
    if (n < 1000000000000) return toWords(Math.floor(n / 1000000000)) + ' Milyar' + (n % 1000000000 !== 0 ? ' ' + toWords(n % 1000000000) : '');
    return String(n);
  }
  
  const words = toWords(Math.abs(Math.floor(amount))).trim();
  return words ? `${words} Rupiah` : 'Nol Rupiah';
}

/**
 * Intelligent Document Type Detector based on record fields, context, and title
 */
export function detectDocumentType(data: Record<string, any> = {}, contextOrTitle?: string): DocumentType {
  const ctx = (contextOrTitle || '').toLowerCase();
  const typeField = String(data.type || data.tipe || data.jenis_dokumen || data.docType || '').toLowerCase();

  // 1. Explicit document type
  if (typeField === 'hasil_laboratorium' || typeField === 'lab') return 'hasil_laboratorium';
  if (typeField === 'hasil_radiologi' || typeField === 'radiologi') return 'hasil_radiologi';
  if (typeField === 'kuitansi_billing' || typeField === 'billing' || typeField === 'kasir') return 'kuitansi_billing';
  if (typeField === 'resep_obat' || typeField === 'resep' || typeField === 'farmasi') return 'resep_obat';
  if (typeField === 'surat_keterangan_sakit' || typeField === 'surat_sakit') return 'surat_keterangan_sakit';
  if (typeField === 'surat_keterangan_sehat' || typeField === 'surat_sehat') return 'surat_keterangan_sehat';
  if (typeField === 'surat_rujukan' || typeField === 'rujukan') return 'surat_rujukan';
  if (typeField === 'sep_bpjs' || typeField === 'sep') return 'sep_bpjs';
  if (typeField === 'profil_sdm' || typeField === 'sdm') return 'profil_sdm';
  if (typeField === 'laporan_insiden' || typeField === 'insiden') return 'laporan_insiden';
  if (typeField === 'resume_medis') return 'resume_medis';
  if (typeField === 'dokumen_umum' || typeField === 'laporan-medis') return 'dokumen_umum';

  // 2. By context or title keywords
  if (ctx.includes('lab') || ctx.includes('darah') || ctx.includes('lis') || ctx.includes('spesimen')) {
    return 'hasil_laboratorium';
  }
  if (ctx.includes('radiologi') || ctx.includes('rontgen') || ctx.includes('pacs') || ctx.includes('dicom') || ctx.includes('x-ray') || ctx.includes('ct-scan') || ctx.includes('usg') || ctx.includes('mri')) {
    return 'hasil_radiologi';
  }
  if (ctx.includes('resep') || ctx.includes('apotek') || ctx.includes('obat') || ctx.includes('farmasi') || ctx.includes('dispens')) {
    return 'resep_obat';
  }
  if (ctx.includes('kuitansi') || ctx.includes('billing') || ctx.includes('kasir') || ctx.includes('tagihan') || ctx.includes('invoice') || ctx.includes('pembayaran') || ctx.includes('keuangan')) {
    return 'kuitansi_billing';
  }
  if (ctx.includes('sep') || ctx.includes('vclaim') || ctx.includes('peserta bpjs') || ctx.includes('eligibilitas')) {
    return 'sep_bpjs';
  }
  if (ctx.includes('surat sakit') || ctx.includes('keterangan sakit') || ctx.includes('istirahat')) {
    return 'surat_keterangan_sakit';
  }
  if (ctx.includes('surat sehat') || ctx.includes('keterangan sehat') || ctx.includes('mcu') || ctx.includes('kebugaran')) {
    return 'surat_keterangan_sehat';
  }
  if (ctx.includes('rujuk') || ctx.includes('fktl') || ctx.includes('faskes perujuk')) {
    return 'surat_rujukan';
  }
  if (ctx.includes('sdm') || ctx.includes('pegawai') || ctx.includes('karyawan') || ctx.includes('shift') || ctx.includes('absensi') || ctx.includes('cuti') || ctx.includes('payroll')) {
    return 'profil_sdm';
  }
  if (ctx.includes('insiden') || ctx.includes('keselamatan') || ctx.includes('ikp') || ctx.includes('knc') || ctx.includes('ktc') || ctx.includes('ktd') || ctx.includes('sentinel')) {
    return 'laporan_insiden';
  }
  if (ctx.includes('gudang') || ctx.includes('inventory') || ctx.includes('inventori') || ctx.includes('stok barang') || ctx.includes('pengadaan') || ctx.includes('logistik') || ctx.includes('aset') || ctx.includes('rekapitulasi')) {
    return 'dokumen_umum';
  }

  // 3. By data attributes
  if (data.no_lab || data.parameter || data.hasil_lab || data.nilai_rujukan) {
    return 'hasil_laboratorium';
  }
  if (data.no_foto || data.ekspertise || data.proyeksi || data.modalitas) {
    return 'hasil_radiologi';
  }
  if (data.no_kuitansi || data.total_tagihan || data.invoice || data.total_bayar || data.nominal_tarif) {
    return 'kuitansi_billing';
  }
  if (data.aturan_pakai || data.dosis || data.signa || data.sediaan || data.resep) {
    return 'resep_obat';
  }
  if (data.no_sep || data.sep || data.peserta_bpjs) {
    return 'sep_bpjs';
  }
  if (data.lama_hari || data.hari_istirahat || data.tgl_mulai_istirahat) {
    return 'surat_keterangan_sakit';
  }
  if (data.keperluan || data.visus_od || data.buta_warna || data.skrining_narkoba) {
    return 'surat_keterangan_sehat';
  }
  if (data.faskes_tujuan || data.rs_tujuan || data.alasan_rujuk) {
    return 'surat_rujukan';
  }
  if (data.nip || data.jabatan || data.str || data.sip || data.divisi || data.departemen) {
    return 'profil_sdm';
  }
  if (data.tipe_insiden || data.grading_risiko || data.kronologis_insiden) {
    return 'laporan_insiden';
  }
  if (data.keluhan_utama || data.soap || data.diagnosa || data.diagnosis || data.anamnesis || data.no_resume) {
    return 'resume_medis';
  }
  if (data.no_rm && (data.tanda_vital || data.tekanan_darah || data.poli)) {
    return 'resume_medis';
  }

  // Fallback default
  return 'dokumen_umum';
}

/**
 * Helper to find matching doctor and specialty based on unit/poli
 */
export function getDoctorForPoli(poliOrUnit?: string, fallbackDoctor?: string): { doctor: string; gelar: string; sip: string; unit: string; spesialisasi: string } {
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

  // Default fallback
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
 * Creates a targeted, non-polluted HospitalDocumentModel matching the exact document type
 */
export function generateHospitalDocument(
  data: Record<string, any> = {},
  docTypeInput?: DocumentType,
  customTitle?: string
): HospitalDocumentModel {
  const docType = docTypeInput || detectDocumentType(data, customTitle);
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const yearStr = today.getFullYear();
  const monthRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][today.getMonth()];

  // Document Number
  const docNumber = data.no_dokumen || data.no_resume || data.no_kuitansi || data.no_sep || data.no_lab || data.no_foto || data.nomor || data.nomor_surat ||
    `Klinik/DOC/${yearStr}/${monthRoman}/${String(data.no_rm || data.nip || data.id || '101').replace(/[^a-zA-Z0-9-]/g, '')}`;

  // Subject identity
  const subjectName = data.nama_pasien || data.nama || data.pasien_nama || data.nama_pegawai || data.nama_barang || data.judul || 'Entitas Terdaftar';
  const noRm = data.no_rm || data.norm || (data.nip ? undefined : undefined);
  const nip = data.nip || data.no_induk;
  const nik = data.nik || data.no_ktp;
  const gender = data.jenis_kelamin || data.jk || data.gender;
  const birthPlace = data.tempat_lahir || data.tmp_lahir;
  const birthDate = data.tanggal_lahir || data.tgl_lahir || data.ttl;
  const age = data.umur || data.usia;
  const bloodType = data.golongan_darah || data.gol_darah;
  const occupation = data.pekerjaan;
  const addressKtp = data.alamat_ktp || data.alamat;
  const phone = data.telepon || data.no_hp || data.kontak;
  
  const emergencyContact = data.kontak_darurat;

  // Resolve Doctor & Unit
  const inputUnit = data.unit_pelayanan || data.poli || data.poli_nama || data.divisi || data.departemen || data.unit || '';
  const inputDoctor = data.dokter_dpjp || data.dokter || data.dpjp || data.atasan;
  const resolvedDoctorInfo = getDoctorForPoli(inputUnit, inputDoctor);

  const unit = inputUnit || (docType === 'profil_sdm' ? (data.divisi || 'Divisi Kepegawaian') : resolvedDoctorInfo.unit);
  const doctor = inputDoctor || resolvedDoctorInfo.doctor;
  const doctorSpecialty = data.spesialisasi_dpjp || data.spesialisasi || resolvedDoctorInfo.spesialisasi;
  const doctorSip = data.sip || data.nip_dokter || resolvedDoctorInfo.sip;

  const guarantor = data.penjamin || data.asuransi || data.tipe_pembayaran || 'Umum Mandiri';
  const bpjsCardNo = data.no_kartu_bpjs || data.no_kartu;
  const sepNumber = data.no_sep || (docType === 'sep_bpjs' ? `0194R0010826V00${Math.floor(1000 + Math.random() * 9000)}` : undefined);
  const examDate = data.tanggal || data.tgl_periksa || data.tgl_masuk || dateFormatted;
  const isRanap = detectIsRawatInap(data);
  const visitType = data.tipe_kunjungan || data.jenis_kunjungan || (isRanap ? 'Rawat Inap' : 'Rawat Jalan');

  // Title logic
  let title = customTitle;
  if (!title) {
    switch (docType) {
      case 'resume_medis':
        title = isRanap 
          ? 'RESUME MEDIS PASIEN (RAWAT INAP / DISCHARGE SUMMARY)' 
          : 'RESUME MEDIS PASIEN (RAWAT JALAN / POLIKLINIK)';
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
      case 'resep_obat':
        title = 'LEMBAR RESEP ELEKTRONIK & SALINAN RESEP DOKTER';
        break;
      case 'profil_sdm':
        title = 'PROFIL RESMI & SURAT KETERANGAN KEPEGAWAIAN';
        break;
      case 'laporan_insiden':
        title = 'LAPORAN INVESTIGASI INSIDEN KESELAMATAN PASIEN (IKP)';
        break;
      case 'sep_bpjs':
        title = 'SURAT ELEGIBILITAS PESERTA (SEP) BPJS KESEHATAN RI';
        break;
      case 'asesmen_risiko_jatuh':
        title = 'LEMBAR ASESMEN & MONITORING RISIKO JATUH (MORSE / HUMPTY DUMPTY)';
        break;
      case 'skrining_gizi_lanjut':
        title = 'LEMBAR SKRINING & ASESMEN ASUHAN GIZI KLINIS (PAGT / DIETISIEN)';
        break;
      case 'asesmen_nyeri':
        title = 'LEMBAR ASESMEN, EVALUASI & PEMANTAUAN DERAJAT NYERI BERKALA';
        break;
      case 'asesmen_barthel':
        title = 'ASESMEN STATUS FUNGSIONAL & TINGKAT KEMANDIRIAN (INDEKS BARTHEL ADL)';
        break;
      case 'partograf':
        title = 'LEMBAR PARTOGRAF STANDAR WHO (KEMAJUAN PERSALINAN & MATERNAL)';
        break;
      case 'asesmen_neonatus_apgar':
        title = 'LEMBAR PENILAIAN NEONATAL & SKOR APGAR BAYI BARU LAHIR';
        break;
      case 'formulir_dnr':
        title = 'FORMULIR PERINTAH JANGAN DILAKUKAN RESUSITASI (DO NOT RESUSCITATE - DNR)';
        break;
      case 'pulang_paksa':
        title = 'SURAT PERNYATAAN PULANG ATAS PERMINTAAN SENDIRI (APS / DAMA)';
        break;
      case 'grafik_ekg_eeg':
        title = 'LEMBAR EKSPERTISE & REKAMAN ELEKTROFISIOLOGI (EKG 12-LEAD / EEG)';
        break;
      case 'laporan_patologi_anatomi':
        title = 'LEMBAR LAPORAN PATOLOGI ANATOMI & HISTOPATOLOGI BIOPSI';
        break;
      case 'surat_kematian':
        title = 'SURAT KETERANGAN KEMATIAN RESMI (SKK WHO ICD-10 MORTALITY)';
        break;
      case 'general_consent':
        title = 'PERSETUJUAN UMUM RAWAT INAP & HAK KEWAJIBAN PASIEN (GENERAL CONSENT)';
        break;
      case 'informed_consent':
        title = 'SURAT PERSETUJUAN / PENOLAKAN TINDAKAN KEDOKTERAN (INFORMED CONSENT)';
        break;
      case 'cppt':
        title = 'CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT SBAR & SOAP)';
        break;
      case 'asesmen_medis_ranap':
        title = 'ASESMEN AWAL MEDIS & KEPERAWATAN RAWAT INAP (24 JAM PERTAMA)';
        break;
      case 'surgical_safety_checklist':
        title = 'SURGICAL SAFETY CHECKLIST STANDAR WHO (SIGN IN, TIME OUT, SIGN OUT)';
        break;
      case 'laporan_operasi':
        title = 'LAPORAN OPERASI & CATATAN TINDAKAN PEMBEDAHAN INTRAOPERATIF';
        break;
      case 'rekonsiliasi_obat':
        title = 'LEMBAR REKONSILIASI OBAT & CATATAN PEMBERIAN OBAT (KPO / MAR)';
        break;
      case 'fluid_balance':
        title = 'LEMBAR PEMANTAUAN CAIRAN & BALANS CAIRAN 24 JAM (INTAKE - OUTPUT)';
        break;
      case 'discharge_planning':
        title = 'PERENCANAAN PEMULANGAN PASIEN (DISCHARGE PLANNING) & EDUKASI';
        break;
      case 'transfer_pasien':
        title = 'FORMULIR TRANSFER PASIEN ANTAR RUANGAN / RUMAH SAKIT (SBAR)';
        break;
      default:
        title = 'LEMBAR LAPORAN OPERASIONAL & ARSIP RESMI KLINIK';
    }
  }

  // Base Document Object
  const baseDocument: HospitalDocumentModel = {
    id: String(data.id || Date.now()),
    type: docType,
    nomorDokumen: docNumber,
    judulDokumen: title,
    subJudul: data.subjudul || 'MYITARU INTEGRATED HOSPITAL INFORMATION SYSTEM — OFFICIAL RECORD',
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
      pekerjaan: occupation,
      alamat: addressKtp,
      alamat_ktp: addressKtp,
      telepon: phone,
      no_hp: phone,
      kontak_darurat: emergencyContact,
      penjamin: guarantor,
      no_kartu_bpjs: bpjsCardNo,
      no_sep: sepNumber,
      unit_pelayanan: unit,
      poli: unit,
      dokter_dpjp: doctor,
      tgl_periksa: examDate,
      tgl_masuk: data.tgl_masuk || examDate,
      tgl_keluar: data.tgl_keluar || examDate,
      tipe_kunjungan: visitType,
      ruangan: data.ruangan || data.kamar,
      kelas_rawat: data.kelas_rawat || (data.ruangan ? 'Kelas I' : undefined),
      no_bed: data.no_bed || data.bed,
      jabatan: data.jabatan,
      divisi: data.divisi
    },
    signer: {
      nama: doctor,
      gelar: data.gelar || doctorSpecialty || 'Spesialis',
      jabatan: data.signer_jabatan || (docType === 'profil_sdm' ? 'Kepala Bagian SDM & Organisasi' : docType === 'kuitansi_billing' ? 'Petugas Kasir & Keuangan' : 'Dokter Penanggung Jawab Pelayanan (DPJP)'),
      sip_nip: doctorSip,
      kota: 'Jakarta Selatan',
      tanggal: dateFormatted,
      digitalValidationCode: `VERIF-MYITARU-${yearStr}-${Math.floor(10000 + Math.random() * 90000)}`
    },
    rawRecord: data
  };

  // =========================================================================
  // TYPE-SPECIFIC STRICT SEGREGATION (Mencegah Pencampuran Data Tidak Relevan)
  // =========================================================================

  // 1. HASIL LABORATORIUM
  if (docType === 'hasil_laboratorium') {
    let labItems: TableItemRow[] = [];
    if (Array.isArray(data.hasil_lab) && data.hasil_lab.length > 0) {
      labItems = data.hasil_lab;
    } else if (Array.isArray(data.parameter_list) && data.parameter_list.length > 0) {
      labItems = data.parameter_list;
    } else if (data.parameter || data.hasil) {
      labItems = [{
        no: 1,
        nama: String(data.parameter || data.nama_tes || 'Pemeriksaan Lab'),
        hasil: String(data.hasil || '-'),
        nilai_rujukan: String(data.nilai_rujukan || data.rujukan || '-'),
        satuan: String(data.satuan || '-'),
        flag: String(data.flag || data.status || 'Normal'),
        metode: String(data.metode || 'Automated LIS')
      }];
    } else {
      labItems = [
        { no: 1, nama: 'Hemoglobin (Hb)', hasil: '14.2', nilai_rujukan: '13.2 - 17.3', satuan: 'g/dL', flag: 'Normal', metode: 'Colorimetric' },
        { no: 2, nama: 'Leukosit Total', hasil: '7.800', nilai_rujukan: '4.500 - 10.500', satuan: '/µL', flag: 'Normal', metode: 'Flow Cytometry' },
        { no: 3, nama: 'Trombosit', hasil: '240.000', nilai_rujukan: '150.000 - 450.000', satuan: '/µL', flag: 'Normal', metode: 'Impedance' },
        { no: 4, nama: 'Hematokrit (Ht)', hasil: '42.5', nilai_rujukan: '40.0 - 52.0', satuan: '%', flag: 'Normal', metode: 'Calculated' },
        { no: 5, nama: 'Gula Darah Sewaktu (GDS)', hasil: '105', nilai_rujukan: '< 140', satuan: 'mg/dL', flag: 'Normal', metode: 'Hexokinase' }
      ];
    }

    baseDocument.hasilPemeriksaanLab = labItems;
    baseDocument.labMetadata = {
      noLab: data.no_lab || data.nomor || `LAB-${yearStr}-${Math.floor(1000 + Math.random() * 9000)}`,
      tglSampling: data.tgl_sampling || data.waktu_ambil || `${examDate}, 08:30 WIB`,
      tglSelesai: data.tgl_selesai || data.waktu_selesai || `${examDate}, 10:00 WIB`,
      dokterSpPk: data.dokter_sp_pk || 'dr. H. Hendra, MARS, Sp.PK',
      analisLab: data.analis_lab || data.analis || 'Siti Rahmawati, A.Md.AK',
      catatanKlinis: data.catatan_lab || data.keterangan || 'Spesimen serum jernih, kontrol kualitas harian (IQC) valid.'
    };
    return baseDocument;
  }

  // 2. HASIL RADIOLOGI
  if (docType === 'hasil_radiologi') {
    baseDocument.hasilRadiologi = data.hasil_radiologi || [
      {
        jenis: String(data.jenis_pemeriksaan || data.pemeriksaan || data.foto || 'Rontgen Foto Thorax PA'),
        tanggal: examDate,
        ekspertise: String(data.ekspertise || data.hasil || 'Cor: Bentuk dan ukuran normal, CTR < 50%. Pulmo: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat atau massa. Sinus kostofrenikus kanan dan kiri tajam.'),
        kesimpulan: String(data.kesimpulan || data.diagnosa || 'Pemeriksaan dalam batas normal. Tidak tampak kelainan radiologis aktif.'),
        dokterRadiologi: String(data.dokter_sp_rad || 'dr. Hendra Wijaya, Sp.Rad (K)')
      }
    ];
    baseDocument.radiologiMetadata = {
      noFoto: data.no_foto || data.nomor || `RAD-${yearStr}-${Math.floor(1000 + Math.random() * 9000)}`,
      proyeksi: data.proyeksi || 'Postero-Anterior (PA)',
      pesawatRontgen: data.pesawat || 'Digital Radiography (DR) 500mA',
      dokterSpRad: data.dokter_sp_rad || 'dr. Hendra Wijaya, Sp.Rad (K)'
    };
    return baseDocument;
  }

  // 3. KUITANSI BILLING & KASIR
  if (docType === 'kuitansi_billing') {
    let billingItems: TableItemRow[] = [];
    if (Array.isArray(data.item_billing) && data.item_billing.length > 0) {
      billingItems = data.item_billing;
    } else if (Array.isArray(data.rincian_biaya) && data.rincian_biaya.length > 0) {
      billingItems = data.rincian_biaya;
    } else {
      const itemTarif = Number(data.total_tagihan || data.total || data.biaya || data.tarif || 250000);
      billingItems = [
        { 
          no: 1, 
          nama: String(data.layanan || data.tindakan || data.keterangan || 'Jasa Pemeriksaan & Pelayanan Medis'), 
          jumlah: 1, 
          tarif: itemTarif, 
          subtotal: itemTarif 
        }
      ];
    }

    const totalTarif = billingItems.reduce((acc, it) => acc + (Number(it.subtotal || (Number(it.jumlah || 1) * Number(it.tarif || 0))) || 0), 0);
    const diskon = Number(data.diskon || 0);
    const totalDibayar = Math.max(0, totalTarif - diskon);

    baseDocument.itemBilling = billingItems;
    baseDocument.billingSummary = {
      noKuitansi: data.no_kuitansi || data.invoice || `KW-${yearStr}-${monthRoman}-${Math.floor(10000 + Math.random() * 90000)}`,
      kasir: data.kasir || 'Dewi Lestari, S.E (Kasir Utama)',
      metodeBayar: data.metode_bayar || data.tipe_pembayaran || 'QRIS / Non-Tunai',
      totalTarif: totalTarif,
      diskonPenjamin: diskon,
      totalDibayar: totalDibayar,
      terbilang: numberToWordsId(totalDibayar),
      statusLunas: true,
      tanggalBayar: `${examDate}, 11:00 WIB`
    };
    return baseDocument;
  }

  // 4. RESEP ELEKTRONIK & OBAT
  if (docType === 'resep_obat') {
    let prescriptionItems: TableItemRow[] = [];
    if (Array.isArray(data.terapi_obat) && data.terapi_obat.length > 0) {
      prescriptionItems = data.terapi_obat;
    } else if (Array.isArray(data.resep) && data.resep.length > 0) {
      prescriptionItems = data.resep.map((r: any, idx: number) => ({
        no: idx + 1,
        nama: r.nama || r.obat || `Obat ${idx + 1}`,
        sediaan: r.sediaan || 'Tablet',
        dosis_aturan: r.aturan_pakai || r.dosis || '3 x 1 sehari',
        jumlah: r.qty || r.jumlah || 10,
        keterangan: r.keterangan || 'Sesudah Makan'
      }));
    } else if (data.nama_obat || data.obat) {
      prescriptionItems = [{
        no: 1,
        nama: String(data.nama_obat || data.obat),
        sediaan: String(data.sediaan || 'Tablet'),
        dosis_aturan: String(data.aturan_pakai || data.dosis || '3 x 1 sehari'),
        jumlah: String(data.jumlah || data.stok || '10'),
        keterangan: String(data.keterangan || 'Sesudah Makan')
      }];
    }

    baseDocument.terapiObat = prescriptionItems;
    baseDocument.resepData = {
      iterasi: data.iter || 'Iter 1x',
      telaahApoteker: {
        kesesuaianDosis: true,
        duplikasiObat: false,
        interaksiObatAman: true,
        alergiAman: true,
        namaApoteker: 'apt. Nurul Aini, S.Farm',
        sipaApoteker: 'SIPA: 19890412/SIPA-3174/2023'
      },
      instruksiKhususApotek: data.instruksi_apotek || 'Simpan di tempat kering dan sejuk (< 30°C).'
    };
    return baseDocument;
  }

  // 5. SURAT KETERANGAN SAKIT
  if (docType === 'surat_keterangan_sakit') {
    baseDocument.suratSakit = {
      lamaHari: Number(data.lama_hari || data.hari_istirahat || 3),
      terhitungMulai: data.tgl_mulai_istirahat || examDate,
      terhitungSampai: data.tgl_selesai_istirahat || examDate,
      anjuranMedis: data.anjuran_istirahat || 'Tirah baring (bed rest) cukup, hindari aktivitas fisik berat, minum obat teratur.',
      pekerjaan: occupation || '-'
    };
    if (data.diagnosa || data.diagnosis) {
      baseDocument.diagnosisUtama = {
        nama: String(data.diagnosa || data.diagnosis)
      };
    }
    return baseDocument;
  }

  // 6. SURAT KETERANGAN SEHAT
  if (docType === 'surat_keterangan_sehat') {
    baseDocument.suratSehat = {
      keperluan: data.keperluan || 'Persyaratan Administrasi Pekerjaan / Melamar Pekerjaan',
      visusMataOD: data.visus_od || '6/6',
      visusMataOS: data.visus_os || '6/6',
      butaWarna: data.buta_warna || 'Normal (Tidak Buta Warna)',
      pendengaran: data.pendengaran || 'Normal (Bilateral)',
      gigiMulut: data.gigi_mulut || 'Kebersihan Baik, Karies Negatif',
      skriningNarkoba: data.skrining_narkoba || 'Negatif (Bebas Narkoba / Napza)',
      kesimpulanFisik: data.kesimpulan_sehat || 'SEHAT JASMANI / FIT UNTUK BEKERJA',
      masaBerlaku: '1 (Satu) Bulan sejak diterbitkan'
    };
    baseDocument.pemeriksaanFisik = {
      tandaVital: {
        tb: String(data.tb || '170'),
        bb: String(data.bb || '68'),
        imt: '23.5 kg/m²',
        kategoriImt: 'Normal',
        tekananDarah: String(data.tekanan_darah || data.td || '120/80 mmHg'),
        nadi: String(data.nadi || '80 x/mnt'),
        rr: String(data.rr || '18 x/mnt'),
        suhu: String(data.suhu || '36.5 °C')
      }
    };
    return baseDocument;
  }

  // 7. SURAT RUJUKAN
  if (docType === 'surat_rujukan') {
    baseDocument.suratRujukan = {
      faskesTujuan: data.faskes_tujuan || data.rs_tujuan || 'Rumah Sakit Rujukan Lanjutan (FKTL)',
      poliTujuan: data.poli_tujuan || 'Poliklinik Spesialis Konsultan',
      dokterTujuan: data.dokter_tujuan || 'Dokter Spesialis Konsulen',
      alasanRujukan: data.alasan_rujuk || 'Mohon evaluasi dan tata laksana diagnostik lanjutan.',
      terapiTindakanDiberikan: data.terapi_diberikan || 'Terapi awal simtomatik dan observasi klinis.',
      fasilitasTransportasi: data.transportasi || 'Kendaraan Pribadi / Layanan Ambulans',
      pendamping: data.pendamping || 'Keluarga Pasien'
    };
    baseDocument.diagnosisUtama = {
      nama: String(data.diagnosa || data.diagnosis || 'Kondisi Medis Memerlukan Rujukan')
    };
    return baseDocument;
  }

  // 8. SEP BPJS KESEHATAN
  if (docType === 'sep_bpjs') {
    baseDocument.sepData = {
      noSep: sepNumber || `0194R0010826V00${Math.floor(1000 + Math.random() * 9000)}`,
      tglSep: examDate,
      noKartu: bpjsCardNo || '0001234567890',
      peserta: subjectName,
      noRujukan: data.no_rujukan || '0115B0010826P000123',
      faskesPerujuk: data.faskes_perujuk || 'Faskes Tingkat Pertama (FKTP)',
      diagnosaAwal: String(data.diagnosa || data.diagnosis || 'Pelayanan Rawat Jalan BPJS'),
      catatanPeserta: data.catatan_peserta || 'Pelayanan rawat jalan rujukan tingkat pertama.',
      hakKelas: data.hak_kelas || 'Kelas 1 (Satu)',
      jenisPelayanan: visitType
    };
    return baseDocument;
  }

  // 9. PROFIL SDM / KEPEGAWAIAN
  if (docType === 'profil_sdm') {
    baseDocument.profilSdmData = {
      nip: String(data.nip || nip || '198812122022011002'),
      nama: String(subjectName),
      jabatan: String(data.jabatan || data.posisi || 'Tenaga Kesehatan / Staf Medis'),
      divisi: String(data.divisi || data.departemen || data.unit || 'Instalasi Pelayanan Medis'),
      str: data.str ? String(data.str) : undefined,
      sip: data.sip ? String(data.sip) : undefined,
      pendidikan: String(data.pendidikan || 'Pendidikan Profesi Kesehatan Terakreditasi'),
      statusKepegawaian: String(data.status || data.status_kepegawaian || 'Pegawai Tetap'),
      tglMasuk: String(data.tgl_masuk || data.tanggal || '01 Januari 2022'),
      kontak: String(phone || '0812-3456-7890'),
      email: String(data.email || 'staf@itaru.ac.id'),
      alamat: String(addressKtp || '-')
    };
    return baseDocument;
  }

  // 10. LAPORAN INSIDEN KESELAMATAN PASIEN (IKP)
  if (docType === 'laporan_insiden') {
    baseDocument.laporanInsidenData = {
      noInsiden: String(data.no_insiden || data.nomor || `IKP-${yearStr}-${Math.floor(100 + Math.random() * 900)}`),
      tglWaktuInsiden: String(data.tgl_insiden || data.tanggal || `${dateFormatted}, 09:00 WIB`),
      lokasiUnit: String(data.lokasi || data.unit || data.ruangan || 'Unit Pelayanan Medis'),
      tipeInsiden: String(data.tipe_insiden || data.kategori || data.insiden || 'KNC (Kejadian Nyaris Cedera)'),
      kronologis: String(data.kronologis || data.deskripsi || data.keterangan || 'Insiden teridentifikasi selama proses verifikasi ganda dan segera ditindaklanjuti sebelum menimbulkan dampak klinis.'),
      tindakanLangsung: String(data.tindakan_langsung || data.tindakan || 'Melakukan verifikasi ulang bersama penanggung jawab shift dan mencatat dalam buku log insiden.'),
      gradingRisiko: String(data.grading || data.grading_risiko || 'Biru (Risiko Rendah)'),
      dampak: String(data.dampak || 'Tidak ada cedera fisik pada pasien'),
      pelapor: String(data.pelapor || data.nama_pelapor || 'Petugas Mutu & Keselamatan Pasien')
    };
    return baseDocument;
  }

  // 11. DOKUMEN UMUM / GUDANG / LOGISTIK / LAPORAN
  if (docType === 'dokumen_umum') {
    // Extract actual fields from data record
    const tabelData = Object.entries(data)
      .filter(([k, v]) => !['id', 'ttd', 'qrData', 'history', 'logs', 'rawRecord', 'sections', 'type', 'tipe'].includes(k) && typeof v !== 'function' && typeof v !== 'object')
      .map(([k, v]) => ({
        label: k.replace(/_/g, ' ').toUpperCase(),
        value: String(v ?? '-')
      }));

    baseDocument.dokumenUmumData = {
      kategori: String(data.kategori || data.unit || 'Laporan Umum Operasional'),
      deskripsi: String(data.deskripsi || data.keterangan || data.catatan || `Dokumen rekapitulasi data resmi untuk ${title}`),
      tabelData: tabelData
    };

    if (Array.isArray(data.sections)) {
      baseDocument.sections = data.sections;
    }

    return baseDocument;
  }

  // ══════════════════════════════════════════════════════════
  // BERKAS DOSSIER REKAM MEDIS LENGKAP 100% (PERMENKES 24/2022 & KARS)
  // ══════════════════════════════════════════════════════════

  // DOSSIER 1: ASESMEN RISIKO JATUH (MORSE / HUMPTY DUMPTY)
  if (docType === 'asesmen_risiko_jatuh') {
    const isPediatric = Number(data.umur || age || 30) < 18;
    const scale = data.scaleType || (isPediatric ? 'humpty' : 'morse');
    baseDocument.fallRiskData = {
      scaleType: scale,
      skor: Number(data.skor ?? (scale === 'morse' ? 45 : 12)),
      kategori: String(data.kategori || (scale === 'morse' ? 'Risiko Tinggi (High Risk)' : 'Risiko Tinggi Anak (High Risk)')),
      shift: String(data.shift || 'Pagi (07:00 - 14:00 WIB)'),
      morseValues: data.morseValues || {
        riwayatJatuh: 25,
        diagnosisSekunder: 15,
        alatBantu: 15,
        terpasangInfus: 20,
        gayaBerjalan: 10,
        statusMental: 0
      },
      humptyValues: data.humptyValues,
      intervensi: data.intervensi || {
        gelangKuning: true,
        segitigaJatuh: true,
        bedRailTerkunci: true,
        belJangkauan: true,
        lantaiKering: true,
        edukasiKeluarga: true,
        pendampinganMobilisasi: true
      },
      petugas: String(data.petugas || 'Ns. Ratna Sari, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 2: SKRINING & ASESMEN GIZI LANJUT (DIETISIEN / PAGT)
  if (docType === 'skrining_gizi_lanjut') {
    const bbNum = Number(data.bb || 65);
    const tbNum = Number(data.tb || 168);
    const tbM = tbNum / 100;
    const calcImt = tbM > 0 ? (bbNum / (tbM * tbM)).toFixed(1) : '23.0';

    baseDocument.nutritionData = {
      bb: bbNum,
      tb: tbNum,
      imt: String(data.imt || calcImt),
      imtKategori: String(data.imtKategori || (Number(calcImt) < 18.5 ? 'Gizi Kurang' : Number(calcImt) > 25 ? 'Overweight / Obesitas' : 'Normal / Gizi Baik')),
      mstScore: Number(data.mstScore ?? 2),
      isMalnourished: data.isMalnourished ?? true,
      dietType: String(data.dietType || 'Diet DM 1900 kkal + Rendah Garam II'),
      bentukMakanan: String(data.bentukMakanan || 'Makanan Lunak / Bubur Halus'),
      rutePemberian: String(data.rutePemberian || 'Oral'),
      alergiMakanan: String(data.alergiMakanan || 'Tidak ada riwayat alergi makanan dilaporkan'),
      diagnosisGizi: String(data.diagnosisGizi || 'NI-5.1 Peningkatan kebutuhan zat gizi energi dan protein berkaitan dengan proses katabolisme penyakit'),
      intervensiGizi: String(data.intervensiGizi || 'Preskripsi diet DM 1900 kkal, protein 1.2 g/kgBB/hari, frekuensi 3x makan utama dan 2x selingan.'),
      targetKalori: String(data.targetKalori || '1900'),
      targetProtein: String(data.targetProtein || '78'),
      dietisien: String(data.dietisien || 'Siti Rahmawati, S.Gz, RD')
    };
    return baseDocument;
  }

  // DOSSIER 3: ASESMEN & MANAJEMEN NYERI BERKALA
  if (docType === 'asesmen_nyeri') {
    baseDocument.painData = {
      skala: Number(data.skala ?? 4),
      metode: (data.metode || 'NRS') as any,
      kategori: String(data.kategori || 'Nyeri Sedang (Moderate Pain)'),
      lokasi: String(data.lokasi || 'Abdomen Kuadran Kanan Bawah / Epigastrium'),
      onset: String(data.onset || 'Akut sejak 2 hari yang lalu'),
      provokasi: String(data.provokasi || 'Memberat saat bergerak, batuk atau ditekan'),
      kualitas: String(data.kualitas || 'Tertusuk-tusuk dan kram intermiten'),
      radiasi: String(data.radiasi || 'Menjalar ke arah pinggang belakang'),
      frekuensi: String(data.frekuensi || 'Hilang timbul setiap 15 - 30 menit'),
      terapiNonFarmakologi: String(data.terapiNonFarmakologi || 'Teknik relaksasi nafas dalam & kompres hangat'),
      terapiFarmakologi: String(data.terapiFarmakologi || 'Inj. Ketorolac 30 mg IV / 8 jam + Paracetamol 1000 mg infus'),
      responSetelahIntervensi: String(data.responSetelahIntervensi || 'Skala nyeri turun dari 6 menjadi 2 setelah 30 menit intervensi'),
      evaluator: String(data.evaluator || 'Ns. Dwi Astuti, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 4: ASESMEN STATUS FUNGSIONAL (INDEKS BARTHEL ADL)
  if (docType === 'asesmen_barthel') {
    baseDocument.barthelData = {
      skor: Number(data.skor ?? 75),
      kategori: String(data.kategori || 'Ketergantungan Ringan (Mild Dependency)'),
      parameterScores: data.parameterScores || {
        makan: 10,
        mandi: 5,
        berhias: 5,
        berpakaian: 10,
        bab: 10,
        bak: 10,
        toileting: 10,
        transfer: 15,
        mobilitas: 15,
        tangga: 5
      },
      kemandirianMakan: 'Mandiri mengambil & mengunyah makanan',
      kemandirianMandi: 'Butuh bantuan sedikit untuk punggung',
      kemandirianBerpakaian: 'Mandiri mengancing dan memakai celana',
      kemandirianTransfer: 'Mandiri dari tempat tidur ke kursi roda',
      kemandirianMobilitas: 'Dapat berjalan mandiri dengan pengawasan',
      fisioterapis: String(data.fisioterapis || 'Bambang Trianto, S.Ft, Ftr')
    };
    return baseDocument;
  }

  // DOSSIER 5: LEMBAR PARTOGRAF WHO
  if (docType === 'partograf') {
    baseDocument.partografData = {
      gravida: String(data.gravida || 'G2P1A0 Gravida 39-40 Minggu'),
      ketubanPecahSejak: String(data.ketubanPecahSejak || 'Pukul 06:30 WIB (Cairan Jernih)'),
      mulesSejak: String(data.mulesSejak || 'Pukul 03:00 WIB teratur'),
      dataPoints: Array.isArray(data.dataPoints) && data.dataPoints.length > 0 ? data.dataPoints : [
        { jam: '08:00', waktuJam: 0, pembukaan: 4, turunKepala: 4, djj: 140, hisFrekuensi: 3, hisDurasi: 35, tdSistol: 110, tdDiastol: 70, nadi: 80, ketuban: 'J', penyusupan: '0' },
        { jam: '09:00', waktuJam: 1, pembukaan: 5, turunKepala: 3, djj: 138, hisFrekuensi: 3, hisDurasi: 40, tdSistol: 115, tdDiastol: 75, nadi: 82, ketuban: 'J', penyusupan: '0' },
        { jam: '10:00', waktuJam: 2, pembukaan: 6, turunKepala: 3, djj: 142, hisFrekuensi: 4, hisDurasi: 45, tdSistol: 120, tdDiastol: 80, nadi: 84, ketuban: 'J', penyusupan: '1' },
        { jam: '11:00', waktuJam: 3, pembukaan: 8, turunKepala: 2, djj: 136, hisFrekuensi: 4, hisDurasi: 45, tdSistol: 120, tdDiastol: 80, nadi: 86, ketuban: 'J', penyusupan: '1' },
        { jam: '12:00', waktuJam: 4, pembukaan: 10, turunKepala: 0, djj: 144, hisFrekuensi: 5, hisDurasi: 50, tdSistol: 125, tdDiastol: 80, nadi: 88, ketuban: 'P', penyusupan: '1' }
      ],
      bidanDPJP: String(data.bidanDPJP || 'Bdn. Sri Wahyuni, S.Tr.Keb / dr. Maya Sp.OG')
    };
    return baseDocument;
  }

  // DOSSIER 6: SKOR APGAR & NEONATAL
  if (docType === 'asesmen_neonatus_apgar') {
    baseDocument.apgarData = {
      tglLahir: String(data.tglLahir || examDate),
      jamLahir: String(data.jamLahir || '12:35 WIB'),
      jenisPersalinan: String(data.jenisPersalinan || 'Spontan Pervaginam Preskep'),
      beratLahir: data.beratLahir || 3200,
      panjangBadan: data.panjangBadan || 50,
      lingkarKepala: data.lingkarKepala || 34,
      skorApgar1Min: Number(data.skorApgar1Min ?? 8),
      skorApgar5Min: Number(data.skorApgar5Min ?? 10),
      detail1Min: data.detail1Min || { denyutJantung: 2, pernafasan: 2, tonusOtot: 1, refleks: 2, warnaKulit: 1 },
      detail5Min: data.detail5Min || { denyutJantung: 2, pernafasan: 2, tonusOtot: 2, refleks: 2, warnaKulit: 2 },
      kategoriKondisi: String(data.kategoriKondisi || 'Vigorous Baby (Bayi Bugar, Adaptasi Baik)'),
      profilaksisVitK: data.profilaksisVitK ?? true,
      salepMata: data.salepMata ?? true,
      imunisasiHb0: data.imunisasiHb0 ?? true,
      resusitasiDilakukan: String(data.resusitasiDilakukan || 'Langkah awal: Jaga kehangatan, posisikan, hisap lendir, keringkan dan rangsang taktil.'),
      dokterAnak: String(data.dokterAnak || 'dr. Aditya Nugraha, Sp.A')
    };
    return baseDocument;
  }

  // DOSSIER 7: FORMULIR DNR (DO NOT RESUSCITATE)
  if (docType === 'formulir_dnr') {
    baseDocument.dnrData = {
      penandatangan: String(data.penandatangan || 'Keluarga / Wali Sah'),
      wali: data.wali || {
        nama: String(data.namaWali || 'Budi Santoso'),
        hubungan: String(data.hubunganWali || 'Anak Kandung'),
        nik: String(data.nikWali || '3271041982050002')
      },
      alasanMedis: String(data.alasanMedis || 'Penyakit stadium terminal dengan kegagalan multi-organ (End-stage disease) dengan prognosis ad malam.'),
      tindakanDibatasi: data.tindakanDibatasi || {
        rjpKompresiDada: true,
        intubasiVentilator: true,
        defibrilasiDCShock: true,
        obatVasopresorDosisTinggi: true,
        kenyamananPaliatifTetapDiberikan: true
      },
      dokterPenanggungJawab: String(data.dokterPenanggungJawab || 'dr. Hendra Gunawan, Sp.An-TI, Subsp.IC(K)'),
      saksi1: String(data.saksi1 || 'Ns. Fitri Handayani, S.Kep'),
      saksi2: String(data.saksi2 || 'Budi Santoso (Keluarga)')
    };
    return baseDocument;
  }

  // DOSSIER 8: SURAT PULANG PAKSA (APS / DAMA)
  if (docType === 'pulang_paksa') {
    baseDocument.pulangPaksaData = {
      namaPenandatangan: String(data.namaPenandatangan || data.nama || subjectName),
      hubungan: String(data.hubungan || 'Pasien Sendiri / Keluarga Penanggung Jawab'),
      alasanPulang: String(data.alasanPulang || 'Keinginan pribadi keluarga untuk melanjutkan rawat jalan dan perawatan mandiri di rumah.'),
      edukasiDiberikan: String(data.edukasiDiberikan || 'DPJP telah menjelaskan secara rinci tentang bahaya klinis, potensi perburukan kondisi, risiko kecacatan, hingga ancaman kematian apabila perawatan dihentikan secara sepihak.'),
      pelepasanTanggungJawab: true,
      saksiKeluarga: String(data.saksiKeluarga || 'Ahmad Fauzi (Keluarga)'),
      saksiPerawat: String(data.saksiPerawat || 'Ns. Kartika Dewi, S.Kep'),
      dokterDPJP: String(data.dokterDPJP || doctor)
    };
    return baseDocument;
  }

  // DOSSIER 9: GRAFIK & EKSPERTISE EKG 12-LEAD / EEG
  if (docType === 'grafik_ekg_eeg') {
    baseDocument.ekgData = {
      jenisPemeriksaan: String(data.jenisPemeriksaan || 'EKG 12-Lead Rest'),
      irama: String(data.irama || 'Sinus Rhythm (Irama Sinus Reguler)'),
      heartRate: data.heartRate || 78,
      axisJantung: String(data.axisJantung || 'Normoaxis (+60 derajat)'),
      gelombangP: String(data.gelombangP || 'Normal (0.08s, voltase <0.25 mV di II)'),
      intervalPR: String(data.intervalPR || '0.16 detik (Normal 0.12 - 0.20s)'),
      kompleksQRS: String(data.kompleksQRS || '0.08 detik (Morfologi sempit normal)'),
      segmenST: String(data.segmenST || 'Isoelektrik, tidak ada ST Elevasi / ST Depresi patologis'),
      gelombangT: String(data.gelombangT || 'Normal upright di I, II, aVF, V3-V6'),
      kesimpulan: String(data.kesimpulan || 'Rekaman EKG 12-Lead dalam batas normal (Normal Sinus Rhythm 78 bpm, tidak ditemukan tanda iskemia akut atau aritmia maligna).'),
      spesialisJantung: String(data.spesialisJantung || 'dr. Farhan Malik, Sp.JP(K), FIHA')
    };
    return baseDocument;
  }

  // DOSSIER 10: PATOLOGI ANATOMI & HISTOPATOLOGI BIOPSI
  if (docType === 'laporan_patologi_anatomi') {
    baseDocument.patologiAnatomiData = {
      noPA: String(data.noPA || `PA-2026-${Math.floor(1000 + Math.random() * 9000)}`),
      lokasiJaringan: String(data.lokasiJaringan || 'Jaringan Biopsi Eksisi Kelenjar / Massa Abdomen'),
      tindakanBiopsi: String(data.tindakanBiopsi || 'Biopsi Eksisi Operatif'),
      makroskopis: String(data.makroskopis || 'Diterima satu fragmen jaringan berukuran 3x2x1.5 cm, konsistensi kenyal padat, warna putih keabuan berbatas tegas, pada pemotongan penampang homogen.'),
      mikroskopis: String(data.mikroskopis || 'Sediaan menunjukkan proliferasi sel-sel dengan batas sitoplasma tegas, inti bulat monoton tanpa atipia bermakna. Stroma fibromuskular tersusun rapi. Tidak ditemukan tanda keganasan (malignansi).'),
      kesimpulanPA: String(data.kesimpulanPA || 'BENIGN FIBROADENOMATOUS LESION / PROLIFERASI JINAK (Tidak ditemukan tanda keganasan pada sediaan ini).'),
      stagingTnm: data.stagingTnm || 'T0 N0 M0 (Benign)',
      dokterSpPA: String(data.dokterSpPA || 'dr. Dian Kusuma, Sp.PA(K)')
    };
    return baseDocument;
  }

  // DOSSIER 11: SURAT KETERANGAN KEMATIAN (SKK WHO)
  if (docType === 'surat_kematian') {
    baseDocument.suratKematianData = {
      noSurat: String(data.noSurat || `445/SKK/${yearStr}/${Math.floor(1000 + Math.random() * 9000)}`),
      tglMeninggal: String(data.tglMeninggal || examDate),
      jamMeninggal: String(data.jamMeninggal || '04:45 WIB'),
      tempatMeninggal: String(data.tempatMeninggal || 'Ruang Perawatan Rawat Inap (Bed Medikal)'),
      whoCauseOfDeath: data.whoCauseOfDeath || {
        part1: {
          a: { penyakit: String(data.penyebabLangsungA || 'Syok Kardiogenik Akut'), selangWaktu: '4 Jam' },
          b: { penyakit: String(data.penyebabAntaraB || 'Acute Myocardial Infarction (STEMI Anteroseptal)'), selangWaktu: '24 Jam' },
          c: { penyakit: String(data.penyebabDasarC || 'Coronary Artery Disease & Diabetes Melitus Tipe 2'), selangWaktu: '5 Tahun' }
        },
        part2: String(data.kondisiLainPart2 || 'Hipertensi Derajat II & Dislipidemia Berat')
      },
      keteranganOtopsi: String(data.keteranganOtopsi || 'Tidak dilakukan bedah jenazah / otopsi (Kematian wajar akibat penyakit klinis)'),
      dokterPemeriksa: String(data.dokterPemeriksa || 'dr. Hendra Gunawan, Sp.An-TI, Subsp.IC(K)')
    };
    return baseDocument;
  }

  // DOSSIER 12: GENERAL CONSENT (PERSETUJUAN UMUM RAWAT INAP)
  if (docType === 'general_consent') {
    baseDocument.generalConsentData = {
      namaPemberiPersetujuan: String(data.namaPemberiPersetujuan || data.nama || subjectName),
      hubunganDenganPasien: String(data.hubunganDenganPasien || 'Pasien Sendiri'),
      persetujuanPerawatanUmum: true,
      persetujuanPelepasanInformasi: true,
      persetujuanTataTertibHakKewajiban: true,
      penjaminBiaya: String(data.penjamin || guarantor || 'BPJS Kesehatan / Penjamin Resmi'),
      anggotaKeluargaDiizinkanBesuk: String(data.anggotaKeluargaDiizinkanBesuk || 'Keluarga Inti (Suami/Istri, Orang Tua, Anak Kandung)'),
      saksiPetugasAdmisi: String(data.saksiPetugasAdmisi || 'Anisa Fitriani (Petugas Pendaftaran RME)')
    };
    return baseDocument;
  }

  // DOSSIER 13: INFORMED CONSENT (PERSETUJUAN TINDAKAN KEDOKTERAN)
  if (docType === 'informed_consent') {
    baseDocument.informedConsentData = {
      namaTindakanMedis: String(data.namaTindakanMedis || data.tindakan || 'Tindakan Invasif / Operasi Pembedahan / Anestesi'),
      dokterPelaksana: String(data.dokterPelaksana || doctor),
      pemberiInformasi: String(data.pemberiInformasi || doctor),
      penerimaInformasi: String(data.penerimaInformasi || data.nama || subjectName),
      indikasiTindakan: String(data.indikasiTindakan || 'Kondisi patologis yang memerlukan intervensi klinis segera untuk perbaikan prognosis.'),
      tataCaraTindakan: String(data.tataCaraTindakan || 'Prosedur pembedahan terstandar di bawah anestesi dengan monitoring tanda vital intraoperatif kontinu.'),
      tujuanTindakan: String(data.tujuanTindakan || 'Mengatasi sumber infeksi/patologi dan mencegah komplikasi yang membahayakan jiwa.'),
      risikoDanKomplikasi: String(data.risikoDanKomplikasi || 'Kemungkinan perdarahan, infeksi luka operasi, reaksi hipersensitivitas obat/anestesi.'),
      prognosisTindakan: String(data.prognosisTindakan || 'Dubia ad Bonam dengan penanganan cepat dan kepatuhan perawatan pasca tindakan.'),
      alternatifTindakan: String(data.alternatifTindakan || 'Terapi medikamentosa konservatif (prognosis kurang optimal)'),
      statusPernyataan: (data.statusPernyataan || (data.setuju !== false ? 'SETUJU' : 'MENOLAK')) as any,
      namaYangMenyatakan: String(data.namaYangMenyatakan || data.nama || subjectName),
      hubunganDenganPasien: String(data.hubunganDenganPasien || data.hubungan || 'Pasien Sendiri'),
      saksiKeluarga: String(data.saksiKeluarga || 'Wali / Keluarga Pasien'),
      saksiPerawat: String(data.saksiPerawat || 'Ns. Maya Indah, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 14: CPPT (CATATAN PERKEMBANGAN PASIEN TERINTEGRASI)
  if (docType === 'cppt') {
    baseDocument.cpptData = {
      entries: Array.isArray(data.entries) && data.entries.length > 0 ? data.entries : [
        {
          id: 1,
          tanggal: examDate,
          jam: '07:30 WIB',
          profesi: 'Perawat',
          namaPetugas: 'Ns. Ratna Sari, S.Kep',
          sbarSoap: {
            s: 'Pasien mengeluh nyeri luka berkurang, nafsu makan mulai membaik, flatus (+), mobilisasi duduk mandiri.',
            o: 'KU sedang, CM, TD 120/75 mmHg, Nadi 80 x/m, RR 18 x/m, Suhu 36.6 C, SpO2 99%. Luka operasi bersih, rembesan (-), terpasang infus RL 20 tpm.',
            a: 'Nyeri pasca tindakan bedah teratasi sebagian, pemulihan fungsi saluran cerna baik.',
            p: 'Lanjutkan mobilisasi bertahap, ganti perban luka, lanjutkan infus & analgetik oral.'
          },
          instruksiPPA: 'Mobilisasi miring kanan-kiri dan duduk di tepi tempat tidur.',
          verifikasiDPJP: {
            diverifikasi: true,
            namaDPJP: doctor,
            jamVerifikasi: '09:00 WIB'
          }
        },
        {
          id: 2,
          tanggal: examDate,
          jam: '09:15 WIB',
          profesi: 'Dokter DPJP',
          namaPetugas: doctor,
          sbarSoap: {
            s: 'Keluhan nyeri minimal (VAS 2/10), demam (-), mual (-).',
            o: 'Abdomen supel, bising usus (+) normal 8x/m, nyeri tekan (-), luka insisi intak jahitan baik.',
            a: 'Post-operatif Hari Ke-2 dengan perbaikan klinis signifikan.',
            p: 'Diet makanan lunak bertahap, lepas infus jika minum baik, rencana pulang besok bila afebris.'
          },
          instruksiPPA: 'Stop infus RL sore ini, alih terapi oral Cefixime 2x200mg & Asam Mefenamat 3x500mg.',
          verifikasiDPJP: {
            diverifikasi: true,
            namaDPJP: doctor,
            jamVerifikasi: '09:30 WIB'
          }
        },
        {
          id: 3,
          tanggal: examDate,
          jam: '11:00 WIB',
          profesi: 'Farmasi Klinis',
          namaPetugas: 'Apt. Bayu Pratama, S.Farm',
          sbarSoap: {
            s: 'Pasien menanyakan cara minum obat pasca pulang dan efek samping antinyeri.',
            o: 'Tidak ditemukan interaksi obat merugikan antara analgesik dan antibiotik oral.',
            a: 'Pemahaman pasien terhadap regimen obat cukup baik, kepatuhan tinggi.',
            p: 'Edukasi minum antibiotik sampai habis dan antinyeri diminum sesudah makan.'
          },
          instruksiPPA: 'Siapkan konseling obat pulang dan rekonsiliasi discharge.',
          verifikasiDPJP: {
            diverifikasi: true,
            namaDPJP: doctor,
            jamVerifikasi: '11:30 WIB'
          }
        }
      ]
    };
    return baseDocument;
  }

  // DOSSIER 15: ASESMEN AWAL MEDIS & KEPERAWATAN RAWAT INAP (24 JAM)
  if (docType === 'asesmen_medis_ranap') {
    baseDocument.asesmenRanapData = {
      keluhanUtama: String(data.keluhanUtama || data.keluhan || 'Nyeri akut perut bagian bawah disertai demam sejak 3 hari sebelum masuk RS.'),
      riwayatPenyakitSekarang: String(data.riwayatPenyakitSekarang || 'Pasien datang rujukan dengan keluhan nyeri perut memberat saat batuk dan berjalan. Mual (+), muntah 2x, nafsu makan menurun.'),
      riwayatPenyakitDahulu: String(data.riwayatPenyakitDahulu || 'Riwayat Gastritis erosif 2 tahun lalu, Hipertensi terkontrol rutin.'),
      riwayatAlergi: String(data.riwayatAlergi || 'Tidak ada riwayat alergi obat / makanan (NKDA)'),
      keadaanUmum: 'Tampak Sakit Sedang, Kesadaran Compos Mentis (E4M6V5)',
      gcs: 'GCS 15',
      tandaVital: {
        td: String(data.td || '125/80 mmHg'),
        nadi: String(data.nadi || '86 x/menit, kuat angkat'),
        suhu: String(data.suhu || '38.2 °C (Febris)'),
        rr: String(data.rr || '20 x/menit, reguler'),
        spo2: String(data.spo2 || '98% room air')
      },
      pemeriksaanFisikLengkap: String(data.pemeriksaanFisikLengkap || 'Kepala: Normocephali, konjungtiva anemis (-), sklera ikterik (-). Thorax: Cor S1-S2 murni reguler, Pulmo vesikuler simetris, ronkhi (-), wheezing (-). Abdomen: Datar lembut, bising usus melemah 4x/m, nyeri tekan McBurney (+), Rovsing sign (+), Psoas sign (+). Ekstremitas: Akral hangat, CRT < 2 detik.'),
      diagnosisMasuk: String(data.diagnosisMasuk || data.diagnosa || 'Apendisitis Akut Terlokalisir (K35.8)'),
      diagnosisBanding: String(data.diagnosisBanding || 'Limfadenitis Mesenterika, Gastroenteritis Akut'),
      rencanaPemeriksaanPenunjang: 'Darah Lengkap, CRP kuantitatif, USG Abdomen Appendiks, Golongan Darah & Skrining Hemostasis.',
      terapiAwal: 'IVFD Ringer Lactate 20 tpm, Inj. Ceftriaxone 1g/12j IV, Inj. Ondansetron 4mg/8j IV, Inj. Ketorolac 30mg/8j IV, Puasa pra-operasi.',
      dpjpUtama: String(data.dpjpUtama || doctor),
      perawatPenerima: String(data.perawatPenerima || 'Ns. Dewi Anggraini, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 16: SURGICAL SAFETY CHECKLIST (WHO STANDAR)
  if (docType === 'surgical_safety_checklist') {
    baseDocument.surgicalSafetyData = {
      namaOperasi: String(data.namaOperasi || 'Apendektomi Laparoskopi / Eksisi Bedah'),
      operator: String(data.operator || doctor || 'dr. Hendra Sp.B'),
      anestesiolog: String(data.anestesiolog || 'dr. Farhan Sp.An-TI'),
      ruangOperasi: String(data.ruangOperasi || 'Kamar Operasi Bedah Sentral (OK 03)'),
      signIn: data.signIn || {
        identitasTerkonfirmasi: true,
        lokasiOperasiDitandai: true,
        mesinAnestesiObatLengkap: true,
        pulseOximeterBerfungsi: true,
        riwayatAlergiDicek: true,
        risikoAspirasiDinilai: true,
        risikoPerdarahan500ml: false
      },
      timeOut: data.timeOut || {
        seluruhTimMemperkenalkanDiri: true,
        bacaUlangIdentitasDanTindakan: true,
        antibiotikProfilaksis60Mnt: true,
        antisipasiKondisiKritis: true,
        hasilRadiologiDitampilkan: true
      },
      signOut: data.signOut || {
        namaTindakanTercatat: true,
        penghitunganKasaInstrumenLengkap: true,
        spesimenDiberiLabelBenar: true,
        masalahPeralatanDitangani: true,
        perhatianKhususPemulihanPACU: 'Pantau tanda vital tiap 15 menit, awasi saturasi O2 dan rembesan luka operasi.'
      },
      perawatSirkuler: String(data.perawatSirkuler || 'Ns. Bambang Hermanto, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 17: LAPORAN OPERASI & TINDAKAN BEDAH
  if (docType === 'laporan_operasi') {
    baseDocument.laporanOperasiData = {
      namaOperasi: String(data.namaOperasi || 'Apendektomi Eksplorasi (Appendectomy)'),
      dokterOperator: String(data.dokterOperator || doctor),
      asistenOperator: String(data.asistenOperator || 'dr. Reza Fahlevi'),
      dokterAnestesi: String(data.dokterAnestesi || 'dr. Hendra Gunawan, Sp.An-TI'),
      penataAnestesi: String(data.penataAnestesi || 'Br. Toni S., A.Md.Kep'),
      jenisAnestesi: String(data.jenisAnestesi || 'General Anesthesia (Intubasi ETT No. 7.5)'),
      tglOperasi: String(data.tglOperasi || examDate),
      jamMulai: String(data.jamMulai || '09:00 WIB'),
      jamSelesai: String(data.jamSelesai || '10:15 WIB'),
      durasiMenit: data.durasiMenit || 75,
      diagnosisPraBedah: String(data.diagnosisPraBedah || 'Apendisitis Akut Supuratif (ICD-10: K35.8)'),
      diagnosisPascaBedah: String(data.diagnosisPascaBedah || 'Post-Apendektomi a/i Apendisitis Akut Flegmonosa'),
      indikasiOperasi: 'Nyeri perut fosa iliaka dextra memberat dengan leukositosis dan defans muskular positif.',
      desinfeksiKulit: 'Povidone Iodine 10% dan Alkohol 70% secara sirkuler aseptik.',
      insisiKulit: 'Insisi McBurney sepanjang 5 cm oblique menembus kutis, subkutis, fasia dan peritoneum.',
      temuanIntraoperatif: 'Didapatkan appendiks letak retrosekal, panjang 8 cm, diameter 1.2 cm, hiperemis dinding tebal dengan eksudat fibrinosa, tidak didapatkan perforasi bebas.',
      tahapanUraianPembedahan: '1. Pasien posisi supinasi dalam anestesi umum.\n2. Dilakukan tindakan asepsis dan antisepsis, ditutup duk steril.\n3. Dilakukan insisi McBurney, diperdalam lapis demi lapis.\n4. Mesoappendiks diklem, dipotong dan diligasi ganda dengan silk 2-0.\n5. Pangkal appendiks diligasi ganda dengan catgut chromic 2-0 dan dipotong.\n6. Dilakukan invaginasi pangkal dengan jahitan tabung (purse-string suturing).\n7. Kontrol perdarahan baik, rongga peritoneal dibilas NaCl 0.9% hangat sampai jernih.\n8. Luka operasi ditutup lapis demi lapis, kutis aproksimasi dengan subkutikuler nilon 4-0.',
      jumlahPerdarahan: String(data.jumlahPerdarahan || 'Kurang lebih 50 cc (Minimal)'),
      transfusiIntraoperatif: 'Tidak ada transfusi',
      jaringanDikirimKePA: true,
      komplikasi: 'Tidak ada komplikasi selama tindakan pembedahan berlangsung.',
      instruksiPascaBedah: '1. Awasi tanda vital dan balans cairan per jam di PACU.\n2. Analgesik Ketorolac 30mg IV tiap 8 jam.\n3. Antibiotik Ceftriaxone 1g IV tiap 12 jam.\n4. Puasa sampai bising usus normal dan flatus positif.'
    };
    return baseDocument;
  }

  // DOSSIER 18: REKONSILIASI OBAT & CATATAN PEMBERIAN OBAT (KPO)
  if (docType === 'rekonsiliasi_obat') {
    baseDocument.rekonsiliasiObatData = {
      riwayatObatSebelumAdmisi: Array.isArray(data.riwayatObatSebelumAdmisi) && data.riwayatObatSebelumAdmisi.length > 0 ? data.riwayatObatSebelumAdmisi : [
        {
          namaObat: 'Amlodipine 5 mg',
          dosis: '5 mg',
          rute: 'Oral',
          aturanPakai: '1 x 1 tablet pagi',
          tindakLanjut: 'Lanjut Sesuai Dosis',
          perubahanInstruksi: 'Lanjutkan minum pagi sesudah makan'
        },
        {
          namaObat: 'Metformin 500 mg',
          dosis: '500 mg',
          rute: 'Oral',
          aturanPakai: '2 x 1 tablet bersama makan',
          tindakLanjut: 'Stop / Ditunda',
          perubahanInstruksi: 'Tunda sementara diganti protokol regulasi insulin perioperatif'
        }
      ],
      catatanPemberianObatKPO: Array.isArray(data.catatanPemberianObatKPO) && data.catatanPemberianObatKPO.length > 0 ? data.catatanPemberianObatKPO : [
        { namaObat: 'Inj. Ceftriaxone 1 g', dosisRute: '1 g / IV', frekuensi: 'Tiap 12 jam', jamPemberian: '06:00, 18:00 WIB', perawatPelaksana: 'Ns. Ratna, S.Kep', status: 'Diberikan' },
        { namaObat: 'Inj. Ketorolac 30 mg', dosisRute: '30 mg / IV', frekuensi: 'Tiap 8 jam', jamPemberian: '06:00, 14:00, 22:00 WIB', perawatPelaksana: 'Ns. Ratna, S.Kep', status: 'Diberikan' },
        { namaObat: 'Inj. Ranitidine 50 mg', dosisRute: '50 mg / IV', frekuensi: 'Tiap 12 jam', jamPemberian: '06:00, 18:00 WIB', perawatPelaksana: 'Ns. Dwi, S.Kep', status: 'Diberikan' },
        { namaObat: 'Infus RL 500 ml', dosisRute: '500 ml / IV', frekuensi: '20 tetes/menit', jamPemberian: 'Kontinu 24 jam', perawatPelaksana: 'Ns. Kartika, S.Kep', status: 'Diberikan' }
      ],
      apotekerKlinis: String(data.apotekerKlinis || 'Apt. Bayu Pratama, S.Farm')
    };
    return baseDocument;
  }

  // DOSSIER 19: FLUID BALANCE (BALANS CAIRAN 24 JAM / IWL)
  if (docType === 'fluid_balance') {
    const bbVal = Number(data.bbPasien || data.bb || 60);
    const iwlCalc = Math.round(15 * bbVal); // 15 cc/kgBB/24 jam
    const intakeTot = data.intake?.totalIntake || 2450;
    const outputTot = data.output?.totalOutput || (1500 + iwlCalc);
    const balanceTot = intakeTot - outputTot;

    baseDocument.fluidBalanceData = {
      tanggalObservasi: String(data.tanggalObservasi || examDate),
      shift: String(data.shift || 'Kumulatif 24 Jam (Shift Pagi-Sore-Malam)'),
      bbPasien: bbVal,
      intake: data.intake || {
        oralEnteral: 800,
        parenteralInfus: 1500,
        injeksiObat: 150,
        transfusi: 0,
        totalIntake: intakeTot
      },
      output: data.output || {
        urine: 1450,
        drainStoma: 50,
        muntahNGT: 0,
        pendarahan: 0,
        feses: 100,
        iwl: iwlCalc,
        totalOutput: outputTot
      },
      balans24Jam: data.balans24Jam ?? balanceTot,
      diuresis: String(data.diuresis || '1.0 cc/kgBB/jam (Adekuat > 0.5 cc/kgBB/jam)'),
      evaluasiKlinis: String(data.evaluasiKlinis || 'Status hidrasi normovolemik tercapai, fungsi ekskresi ginjal normal, edema ekstremitas (-)'),
      perawatPenanggungJawab: String(data.perawatPenanggungJawab || 'Ns. Ratna Sari, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 20: DISCHARGE PLANNING & EDUKASI PASIEN TERINTEGRASI
  if (docType === 'discharge_planning') {
    baseDocument.dischargePlanningData = {
      tglMasuk: String(data.tglMasuk || data.tgl_masuk || examDate),
      estimasiTglPulang: String(data.estimasiTglPulang || examDate),
      kriteriaKesiapanPulang: data.kriteriaKesiapanPulang || {
        tandaVitalStabil: true,
        nyeriTerkendali: true,
        dapatMobilisasiMandiri: true,
        dapatMakanMinumOral: true,
        obatPulangTersediaDanDiedukasi: true,
        lukaOperasiBersih: true
      },
      instruksiPerawatanRumah: String(data.instruksiPerawatanRumah || 'Jaga luka jahitan tetap kering dan bersih, jangan basah saat mandi. Hindari mengangkat beban >5 kg selama 2 minggu.'),
      obatPulang: Array.isArray(data.obatPulang) && data.obatPulang.length > 0 ? data.obatPulang : [
        { nama: 'Cefixime 200 mg Kapsul', aturan: '2 x 1 kapsul sesudah makan', keterangan: 'Antibiotik oral, wajib dihabiskan 5 hari' },
        { nama: 'Asam Mefenamat 500 mg Tablet', aturan: '3 x 1 tablet sesudah makan', keterangan: 'Pereda nyeri, minum bila terasa sakit' },
        { nama: 'Vitamin C 500 mg Tablet', aturan: '1 x 1 tablet sesudah makan', keterangan: 'Membantu proses penyembuhan jaringan luka' }
      ],
      tandaBahayaEmergency: 'Segera ke IGD RS jika timbul: Demam tinggi >38.5 C, nyeri perut hebat mendadak, keluar nanah atau darah dari luka operasi, muntah terus-menerus.',
      jadwalKontrolPoli: String(data.jadwalKontrolPoli || 'Poliklinik Bedah Umum hari Senin depan pukul 09:00 WIB.'),
      dokterDPJP: String(data.dokterDPJP || doctor),
      edukatorNurse: String(data.edukatorNurse || 'Ns. Dewi Anggraini, S.Kep')
    };
    return baseDocument;
  }

  // DOSSIER 21: TRANSFER PASIEN ANTAR RUANGAN / FASKES (SBAR)
  if (docType === 'transfer_pasien') {
    baseDocument.transferPasienData = {
      jenisTransfer: (data.jenisTransfer || 'Internal Antar Unit / ICU') as any,
      unitAsal: String(data.unitAsal || 'Instalasi Gawat Darurat (IGD)'),
      unitTujuan: String(data.unitTujuan || 'Ruang Rawat Inap Melati Bed 04'),
      waktuTransfer: String(data.waktuTransfer || `${examDate}, 11:30 WIB`),
      sbar: data.sbar || {
        situation: 'Pasien pindah ruang rawat inap dari IGD untuk persiapan dan tindakan perawatan lanjutan post-stabilisasi.',
        background: 'Pasien masuk IGD tadi malam dengan keluhan nyeri perut kanan bawah akut dan febris, telah dilakukan USG dan konsul DPJP Bedah.',
        assessment: 'Kondisi umum stabil, nyeri berkurang dengan Ketorolac IV, infus terpasang lancar, tanda vital dalam batas aman.',
        recommendation: 'Lanjutkan tirah baring, monitor tanda vital tiap 4 jam, teruskan antibiotik profilaksis dan siapkan jadwal operasi bedah.'
      },
      tandaVitalSaatPindah: data.tandaVitalSaatPindah || {
        kesadaran: 'Compos Mentis (GCS 15)',
        td: '120/80 mmHg',
        nadi: '82 x/menit',
        rr: '18 x/menit',
        suhu: '36.8 °C',
        spo2: '99% udara ruangan'
      },
      alatMedisTerpasang: data.alatMedisTerpasang || ['Infus Intravena RL abocath 20G', 'Gelang Identitas Pasien & Gelang Kuning Risiko Jatuh'],
      petugasPengantar: String(data.petugasPengantar || 'Ns. Firman, S.Kep (Perawat IGD)'),
      petugasPenerima: String(data.petugasPenerima || 'Ns. Sri Mulyani, S.Kep (Perawat Bangsal)')
    };
    return baseDocument;
  }

  // 12. RESUME MEDIS (GENUINE CLINICAL RECORD)
  // Only executed when genuinely handling a clinical patient encounter
  const keluhanUtama = data.keluhan_utama || data.keluhan || data.subjektif || 'Pemeriksaan klinis rutin dan evaluasi berkala.';
  const anamnesis = data.anamnesis || `${keluhanUtama} \n\nRiwayat Penyakit Sekarang: ${data.rps || data.riwayat_penyakit_sekarang || 'Keluhan dirasakan sejak beberapa hari terakhir dan dalam proses penanganan medis teratur.'}`;

  baseDocument.anamnesis = anamnesis;
  baseDocument.keluhanUtama = keluhanUtama;
  baseDocument.riwayatAlergi = data.alergi || data.riwayat_alergi || 'Tidak ada riwayat alergi obat yang dilaporkan (NKDA).';
  baseDocument.riwayatPenyakitDahulu = data.rpd || data.riwayat_penyakit_dahulu || '-';

  baseDocument.pemeriksaanFisik = {
    tandaVital: {
      tekananDarah: data.tekanan_darah || data.tanda_vital?.tekananDarah || '120/80 mmHg',
      nadi: data.nadi || data.tanda_vital?.nadi || '80 x/mnt',
      suhu: data.suhu || data.tanda_vital?.suhu || '36.5 °C',
      rr: data.rr || data.tanda_vital?.rr || '18 x/mnt',
      spo2: data.spo2 || data.tanda_vital?.spo2 || '99 %',
      bb: String(data.bb || '65'),
      tb: String(data.tb || '168')
    },
    catatanFisik: data.catatan_fisik || 'Status lokalis dan pemeriksaan umum dalam batas normal.'
  };

  baseDocument.diagnosisUtama = {
    kode: data.kode_icd10 || data.diagnosis_utama_kode || (typeof data.diagnosis === 'object' ? data.diagnosis?.kode : 'Z00.0'),
    nama: typeof data.diagnosis_utama === 'string' ? data.diagnosis_utama : (typeof data.diagnosis === 'string' ? data.diagnosis : (data.diagnosis?.nama || 'Pemeriksaan Kesehatan Umum'))
  };

  if (data.diagnosis_sekunder) {
    baseDocument.diagnosisSekunder = Array.isArray(data.diagnosis_sekunder) 
      ? data.diagnosis_sekunder.map((d: any) => typeof d === 'string' ? { nama: d } : d)
      : [{ nama: String(data.diagnosis_sekunder) }];
  }

  if (Array.isArray(data.tindakan_medis)) {
    baseDocument.tindakanMedis = data.tindakan_medis;
  }

  if (Array.isArray(data.terapi_obat)) {
    baseDocument.terapiObat = data.terapi_obat;
  }

  baseDocument.edukasiInstruksi = data.edukasi || data.instruksi || 'Patuhi anjuran medis, minum obat teratur, dan jaga pola hidup sehat.';
  baseDocument.rencanaKontrol = data.jadwal_kontrol || `Kontrol sesuai anjuran dokter di ${unit}`;
  baseDocument.kondisiPulang = data.kondisi_pulang || data.status || 'Perbaikan Klinis';

  return baseDocument;
}
