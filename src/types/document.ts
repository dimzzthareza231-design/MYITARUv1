export interface HospitalInfo {
  name: string;
  subname?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  accreditation?: string;
  licenseNumber?: string;
  kodeRs?: string;
  kodePpk?: string;
  directorName?: string;
  directorNip?: string;
  hospitalType?: string;
  ownership?: string;
  emergencyHotline?: string;
  faxNumber?: string;
}

export const DEFAULT_HOSPITAL_INFO: HospitalInfo = {
  name: 'KLINIK TARUMANAGARA',
  subname: 'KLINIK UMUM PENDIDIKAN TARUMANAGARA',
  address: 'Jl. TB Simatupang, & Jl. Raya Cilandak KKO No.1, RT.1/RW.5, Ragunan, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12550',
  city: 'Jakarta Selatan',
  phone: '(021) 56958723',
  email: 'marketing@institut.tarumanagara.ac.id',
  website: 'itaru.ac.id',
  accreditation: 'TERAKREDITASI PARIPURNA (KARS KEMENKES RI)',
  licenseNumber: 'No. Izin Operasional: 445/1029/DINKES/2024',
  kodeRs: '3171890',
  kodePpk: '0115R001',
  directorName: 'dr. H. Hendra, MARS, Sp.PK',
  directorNip: '197508122002121001',
  hospitalType: 'Klinik Umum (Kelas B Pendidikan)',
  ownership: 'Yayasan Tarumanagara',
  emergencyHotline: '(021) 56958999 (IGD 24 Jam)',
  faxNumber: '(021) 56958724'
};

export type DocumentType = 
  | 'resume_medis'
  | 'surat_keterangan_sakit'
  | 'surat_keterangan_sehat'
  | 'surat_rujukan'
  | 'hasil_laboratorium'
  | 'hasil_radiologi'
  | 'kuitansi_billing'
  | 'resep_obat'
  | 'profil_sdm'
  | 'laporan_insiden'
  | 'kartu_pasien'
  | 'sep_bpjs'
  | 'dokumen_umum'
  // 1. Asesmen Spesifik & Skrining Risiko (Rawat Inap)
  | 'asesmen_risiko_jatuh'
  | 'skrining_gizi_lanjut'
  | 'asesmen_nyeri'
  | 'asesmen_barthel'
  // 2. Dokumen Khusus Kelompok Pasien Tertentu
  | 'partograf'
  | 'asesmen_maternal_nifas'
  | 'asesmen_neonatus_apgar'
  | 'asesmen_jiwa'
  // 3. Dokumen Hukum Medis (Legal-Medik)
  | 'formulir_dnr'
  | 'pulang_paksa'
  | 'penolakan_tindakan'
  | 'penitipan_barang'
  // 4. Hasil Pemeriksaan Penunjang Asli (Exhibits)
  | 'grafik_ekg_eeg'
  | 'laporan_patologi_anatomi'
  // 5. Dokumen Pasca-Perawatan & Pemulasaran
  | 'surat_kematian'
  | 'serah_terima_jenazah'
  // 6. Prosedural & Observasi Khusus
  | 'general_consent'
  | 'hak_pasien'
  | 'asesmen_medis'
  | 'asesmen_medis_ranap'
  | 'asesmen_keperawatan'
  | 'informed_consent'
  | 'cppt'
  | 'laporan_operasi'
  | 'laporan_anestesi'
  | 'surgical_safety_checklist'
  | 'pemantauan_pacu'
  | 'rekonsiliasi_obat'
  | 'fluid_balance'
  | 'discharge_planning'
  | 'transfer_pasien'
  | 'audit_trail_rme';

export interface PatientSubjectData {
  nama: string;
  no_rm?: string;
  nip?: string;
  nik?: string;
  tempat_lahir?: string;
  tgl_lahir?: string;
  umur?: string | number;
  jenis_kelamin?: 'L' | 'P' | 'Laki-laki' | 'Perempuan' | string;
  golongan_darah?: string;
  status_pernikahan?: string;
  agama?: string;
  pendidikan?: string;
  pekerjaan?: string;
  alamat?: string;
  alamat_ktp?: string;
  alamat_domisili?: string;
  telepon?: string;
  no_hp?: string;
  kontak_darurat?: {
    nama: string;
    hubungan: string;
    telepon: string;
  } | string;
  penjamin?: string;
  no_kartu_bpjs?: string;
  no_sep?: string;
  unit_pelayanan?: string;
  poli?: string;
  dokter_dpjp?: string;
  dokter_pengirim?: string;
  tgl_periksa?: string;
  tgl_masuk?: string;
  tgl_keluar?: string;
  jam_masuk?: string;
  jam_keluar?: string;
  tipe_kunjungan?: string;
  ruangan?: string;
  kelas_rawat?: string;
  no_bed?: string;
  jabatan?: string;
  divisi?: string;
}

export interface TableItemRow {
  no?: number | string;
  nama: string;
  sediaan?: string;
  dosis_aturan?: string;
  aturan_pakai?: string;
  dosis?: string;
  rute?: string;
  durasi?: string;
  jumlah?: string | number;
  indikasi?: string;
  keterangan?: string;
  hasil?: string;
  nilai_rujukan?: string;
  satuan?: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Abnormal' | 'Critical' | string;
  metode?: string;
  tarif?: number;
  subtotal?: number;
}

export interface SignerInfo {
  nama: string;
  gelar?: string;
  jabatan?: string;
  sip_nip?: string;
  kota?: string;
  tanggal?: string;
  digitalValidationCode?: string;
  qrData?: string;
}

export interface AllergyItem {
  tipe: string; // Obat, Makanan, Udara, Lingkungan
  alergen: string;
  reaksi: string;
  derajat?: 'Ringan' | 'Sedang' | 'Berat / Anafilaktik';
}

export interface PhysicalExamSystemic {
  kepalaLeher?: string;
  mata?: string;
  tht?: string;
  thoraxCor?: string;
  thoraxPulmo?: string;
  abdomen?: string;
  ekstremitas?: string;
  neurologis?: string;
  statusLokalis?: string;
  statusDermatologis?: string;
}

export interface HospitalDocumentModel {
  id?: string;
  type: DocumentType;
  nomorDokumen: string;
  judulDokumen: string;
  subJudul?: string;
  hospitalInfo?: HospitalInfo;
  subject: PatientSubjectData;
  
  // Riwayat & Peringatan Medis
  riwayatAlergi?: AllergyItem[] | string;
  riwayatPenyakitDahulu?: string;
  riwayatPenyakitKeluarga?: string;
  riwayatPengobatanRutin?: string;

  // Anamnesis Terstruktur (Subjektif)
  anamnesis?: string;
  keluhanUtama?: string;
  riwayatPenyakitSekarang?: string;
  tinjauanSistem?: string;

  // Pemeriksaan Fisik Terstruktur (Objektif)
  pemeriksaanFisik?: {
    tandaVital?: {
      tekananDarah?: string;
      nadi?: string;
      suhu?: string;
      rr?: string;
      spo2?: string;
      bb?: string;
      tb?: string;
      imt?: string;
      kategoriImt?: string;
      lingkarPerut?: string;
      kesadaran?: string;
      gcs?: string;
      skalaNyeri?: string;
      lokasiNyeri?: string;
    };
    catatanFisik?: string;
    pemeriksaanSistemik?: PhysicalExamSystemic;
  };

  // Pemeriksaan Penunjang (Laboratorium, Radiologi, EKG)
  hasilPemeriksaanLab?: TableItemRow[];
  hasilRadiologi?: Array<{
    jenis: string;
    tanggal?: string;
    ekspertise: string;
    kesimpulan: string;
    dokterRadiologi?: string;
  }>;
  hasilEkg?: string;

  // Diagnosis (Assessment)
  diagnosisUtama?: {
    kode?: string;
    nama: string;
    deskripsi?: string;
  };
  diagnosisSekunder?: Array<{
    kode?: string;
    nama: string;
  }>;
  diagnosisBanding?: string[];

  // Tata Laksana & Terapi (Plan)
  tindakanMedis?: Array<{
    kode?: string;
    nama: string;
    keterangan?: string;
  }>;
  terapiObat?: TableItemRow[];
  terapiNonFarmakologi?: string;
  dietNutrisi?: string;

  // Edukasi, Evaluasi & Prognosis
  edukasiInstruksi?: string;
  rencanaKontrol?: string;
  prognosis?: {
    vitam?: string;
    functionam?: string;
    sanationam?: string;
  };
  kondisiPulang?: string;
  catatanKhusus?: string;

  itemBilling?: TableItemRow[];
  
  // Spesifik Dokumen Khusus & Mandiri (Mencegah Pencampuran Dokumen)
  suratSakit?: {
    lamaHari: number;
    terhitungMulai: string;
    terhitungSampai: string;
    anjuranMedis?: string;
    pekerjaan?: string;
  };
  suratSehat?: {
    keperluan: string;
    visusMataOD?: string;
    visusMataOS?: string;
    butaWarna?: 'Normal (Tidak Buta Warna)' | 'Buta Warna Parsial' | 'Buta Warna Total';
    pendengaran?: 'Normal (Bilateral)' | 'Penurunan Ringan' | 'Abnormal';
    gigiMulut?: string;
    skriningNarkoba?: 'Negatif (Bebas Narkoba / Napza)' | 'Non-Reaktif' | 'Tidak Dilakukan';
    kesimpulanFisik?: string;
    masaBerlaku?: string;
  };
  suratRujukan?: {
    faskesTujuan: string;
    poliTujuan: string;
    dokterTujuan?: string;
    alasanRujukan: string;
    terapiTindakanDiberikan: string;
    fasilitasTransportasi?: string;
    pendamping?: string;
    tipeRujukan?: 'Horizontal' | 'Vertikal' | 'Balik / PRB';
  };
  resepData?: {
    iterasi?: string;
    telaahApoteker?: {
      kesesuaianDosis: boolean;
      duplikasiObat: boolean;
      interaksiObatAman: boolean;
      alergiAman: boolean;
      namaApoteker: string;
      sipaApoteker?: string;
    };
    instruksiKhususApotek?: string;
  };
  billingSummary?: {
    noKuitansi: string;
    kasir: string;
    metodeBayar: string;
    totalTarif: number;
    diskonPenjamin: number;
    totalDibayar: number;
    terbilang: string;
    statusLunas: boolean;
    tanggalBayar: string;
  };
  labMetadata?: {
    noLab: string;
    tglSampling: string;
    tglSelesai: string;
    dokterSpPk: string;
    analisLab: string;
    catatanKlinis?: string;
  };
  radiologiMetadata?: {
    noFoto: string;
    proyeksi: string;
    pesawatRontgen?: string;
    dokterSpRad: string;
  };
  sepData?: {
    noSep: string;
    tglSep: string;
    noKartu: string;
    peserta: string;
    noRujukan?: string;
    faskesPerujuk?: string;
    diagnosaAwal?: string;
    catatanPeserta?: string;
    hakKelas?: string;
    jenisPelayanan?: string;
  };

  profilSdmData?: {
    nip: string;
    nama: string;
    jabatan: string;
    divisi: string;
    str?: string;
    sip?: string;
    pendidikan?: string;
    statusKepegawaian?: string;
    tglMasuk?: string;
    kontak?: string;
    email?: string;
    alamat?: string;
  };

  laporanInsidenData?: {
    noInsiden: string;
    tglWaktuInsiden: string;
    lokasiUnit: string;
    tipeInsiden: 'KNC' | 'KTC' | 'KTD' | 'Sentinel' | string;
    kronologis: string;
    tindakanLangsung: string;
    gradingRisiko: 'Biru' | 'Hijau' | 'Kuning' | 'Merah' | string;
    dampak: string;
    pelapor: string;
  };

  // ══════════════════════════════════════════════════════════
  // STRUKTUR DATA BERKAS DOSSIER REKAM MEDIS LENGKAP (PERMENKES 24/2022 & KARS)
  // ══════════════════════════════════════════════════════════
  fallRiskData?: {
    scaleType: 'morse' | 'humpty';
    skor: number;
    kategori: string;
    shift: string;
    morseValues?: Record<string, number>;
    humptyValues?: Record<string, number>;
    intervensi: Record<string, boolean>;
    petugas: string;
  };

  nutritionData?: {
    bb: number | string;
    tb: number | string;
    imt: string;
    imtKategori: string;
    mstScore: number;
    isMalnourished: boolean;
    dietType: string;
    bentukMakanan: string;
    rutePemberian: string;
    alergiMakanan?: string;
    diagnosisGizi: string;
    intervensiGizi: string;
    targetKalori: string;
    targetProtein: string;
    dietisien: string;
  };

  painData?: {
    skala: number;
    metode: 'NRS' | 'VAS' | 'FLACC' | 'CPOT';
    kategori: string;
    lokasi: string;
    onset: string;
    provokasi: string;
    kualitas: string;
    radiasi: string;
    frekuensi: string;
    terapiNonFarmakologi: string;
    terapiFarmakologi: string;
    responSetelahIntervensi: string;
    evaluator: string;
  };

  barthelData?: {
    skor: number;
    kategori: string;
    parameterScores: Record<string, number>;
    kemandirianMakan: string;
    kemandirianMandi: string;
    kemandirianBerpakaian: string;
    kemandirianTransfer: string;
    kemandirianMobilitas: string;
    fisioterapis: string;
  };

  partografData?: {
    gravida: string;
    ketubanPecahSejak: string;
    mulesSejak: string;
    dataPoints: Array<{
      jam: string;
      waktuJam: number;
      pembukaan: number;
      turunKepala: number;
      djj: number;
      hisFrekuensi: number;
      hisDurasi: number;
      tdSistol: number;
      tdDiastol: number;
      nadi: number;
      ketuban: string;
      penyusupan: string;
    }>;
    bidanDPJP: string;
  };

  apgarData?: {
    tglLahir: string;
    jamLahir: string;
    jenisPersalinan: string;
    beratLahir: number | string;
    panjangBadan: number | string;
    lingkarKepala: number | string;
    skorApgar1Min: number;
    skorApgar5Min: number;
    detail1Min?: Record<string, number>;
    detail5Min?: Record<string, number>;
    kategoriKondisi: string;
    profilaksisVitK: boolean;
    salepMata: boolean;
    imunisasiHb0: boolean;
    resusitasiDilakukan: string;
    dokterAnak: string;
  };

  dnrData?: {
    penandatangan: string;
    wali?: { nama: string; hubungan: string; nik: string };
    alasanMedis: string;
    tindakanDibatasi: Record<string, boolean>;
    dokterPenanggungJawab: string;
    saksi1: string;
    saksi2: string;
  };

  pulangPaksaData?: {
    namaPenandatangan: string;
    hubungan: string;
    alasanPulang: string;
    edukasiDiberikan: string;
    pelepasanTanggungJawab: boolean;
    saksiKeluarga: string;
    saksiPerawat: string;
    dokterDPJP: string;
  };

  ekgData?: {
    jenisPemeriksaan: string;
    irama: string;
    heartRate: number | string;
    axisJantung: string;
    gelombangP: string;
    intervalPR: string;
    kompleksQRS: string;
    segmenST: string;
    gelombangT: string;
    kesimpulan: string;
    spesialisJantung: string;
  };

  patologiAnatomiData?: {
    noPA: string;
    lokasiJaringan: string;
    tindakanBiopsi: string;
    makroskopis: string;
    mikroskopis: string;
    kesimpulanPA: string;
    stagingTnm?: string;
    dokterSpPA: string;
  };

  suratKematianData?: {
    noSurat: string;
    tglMeninggal: string;
    jamMeninggal: string;
    tempatMeninggal: string;
    whoCauseOfDeath: {
      part1: {
        a: { penyakit: string; selangWaktu: string };
        b?: { penyakit: string; selangWaktu: string };
        c?: { penyakit: string; selangWaktu: string };
      };
      part2?: string;
    };
    keteranganOtopsi?: string;
    dokterPemeriksa: string;
  };

  generalConsentData?: {
    namaPemberiPersetujuan: string;
    hubunganDenganPasien: string;
    persetujuanPerawatanUmum: boolean;
    persetujuanPelepasanInformasi: boolean;
    persetujuanTataTertibHakKewajiban: boolean;
    penjaminBiaya: string;
    anggotaKeluargaDiizinkanBesuk?: string;
    saksiPetugasAdmisi: string;
  };

  informedConsentData?: {
    namaTindakanMedis: string;
    dokterPelaksana: string;
    pemberiInformasi: string;
    penerimaInformasi: string;
    indikasiTindakan: string;
    tataCaraTindakan: string;
    tujuanTindakan: string;
    risikoDanKomplikasi: string;
    prognosisTindakan: string;
    alternatifTindakan?: string;
    statusPernyataan: 'SETUJU' | 'MENOLAK';
    namaYangMenyatakan: string;
    hubunganDenganPasien: string;
    saksiKeluarga: string;
    saksiPerawat: string;
  };

  cpptData?: {
    entries: Array<{
      id: string | number;
      tanggal: string;
      jam: string;
      profesi: 'Dokter DPJP' | 'Perawat' | 'Apoteker' | 'Dietisien' | string;
      namaPetugas: string;
      sbarSoap: {
        s: string;
        o: string;
        a: string;
        p: string;
      };
      instruksiPPA: string;
      verifikasiDPJP?: {
        diverifikasi: boolean;
        namaDPJP: string;
        jamVerifikasi: string;
      };
    }>;
  };

  asesmenRanapData?: {
    keluhanUtama: string;
    riwayatPenyakitSekarang: string;
    riwayatPenyakitDahulu: string;
    riwayatAlergi: string;
    keadaanUmum: string;
    gcs: string;
    tandaVital: {
      td: string;
      nadi: string;
      suhu: string;
      rr: string;
      spo2: string;
    };
    pemeriksaanFisikLengkap: string;
    diagnosisMasuk: string;
    diagnosisBanding?: string;
    rencanaPemeriksaanPenunjang: string;
    terapiAwal: string;
    dpjpUtama: string;
    perawatPenerima: string;
  };

  surgicalSafetyData?: {
    namaOperasi: string;
    operator: string;
    anestesiolog: string;
    ruangOperasi: string;
    signIn: {
      identitasTerkonfirmasi: boolean;
      lokasiOperasiDitandai: boolean;
      mesinAnestesiObatLengkap: boolean;
      pulseOximeterBerfungsi: boolean;
      riwayatAlergiDicek: boolean;
      risikoAspirasiDinilai: boolean;
      risikoPerdarahan500ml: boolean;
    };
    timeOut: {
      seluruhTimMemperkenalkanDiri: boolean;
      bacaUlangIdentitasDanTindakan: boolean;
      antibiotikProfilaksis60Mnt: boolean;
      antisipasiKondisiKritis: boolean;
      hasilRadiologiDitampilkan: boolean;
    };
    signOut: {
      namaTindakanTercatat: boolean;
      penghitunganKasaInstrumenLengkap: boolean;
      spesimenDiberiLabelBenar: boolean;
      masalahPeralatanDitangani: boolean;
      perhatianKhususPemulihanPACU: string;
    };
    perawatSirkuler: string;
  };

  laporanOperasiData?: {
    namaOperasi: string;
    dokterOperator: string;
    asistenOperator: string;
    dokterAnestesi: string;
    penataAnestesi: string;
    jenisAnestesi: string;
    tglOperasi: string;
    jamMulai: string;
    jamSelesai: string;
    durasiMenit: number | string;
    diagnosisPraBedah: string;
    diagnosisPascaBedah: string;
    indikasiOperasi: string;
    desinfeksiKulit: string;
    insisiKulit: string;
    temuanIntraoperatif: string;
    tahapanUraianPembedahan: string;
    jumlahPerdarahan: string;
    transfusiIntraoperatif: string;
    jaringanDikirimKePA: boolean;
    komplikasi: string;
    instruksiPascaBedah: string;
  };

  rekonsiliasiObatData?: {
    riwayatObatSebelumAdmisi: Array<{
      namaObat: string;
      dosis: string;
      rute: string;
      aturanPakai: string;
      tindakLanjut: 'Lanjut Sesuai Dosis' | 'Modifikasi Dosis' | 'Stop / Ditunda' | 'Ganti Obat';
      perubahanInstruksi?: string;
    }>;
    catatanPemberianObatKPO: Array<{
      namaObat: string;
      dosisRute: string;
      frekuensi: string;
      jamPemberian: string;
      perawatPelaksana: string;
      status: 'Diberikan' | 'Ditunda' | 'Pasien Menolak';
    }>;
    apotekerKlinis: string;
  };

  fluidBalanceData?: {
    tanggalObservasi: string;
    shift: string;
    bbPasien: number | string;
    intake: {
      oralEnteral: number;
      parenteralInfus: number;
      injeksiObat: number;
      transfusi: number;
      totalIntake: number;
    };
    output: {
      urine: number;
      drainStoma: number;
      muntahNGT: number;
      pendarahan: number;
      feses: number;
      iwl: number;
      totalOutput: number;
    };
    balans24Jam: number;
    diuresis: string; // ml/kgBB/jam
    evaluasiKlinis: string;
    perawatPenanggungJawab: string;
  };

  dischargePlanningData?: {
    tglMasuk: string;
    estimasiTglPulang: string;
    kriteriaKesiapanPulang: {
      tandaVitalStabil: boolean;
      nyeriTerkendali: boolean;
      dapatMobilisasiMandiri: boolean;
      dapatMakanMinumOral: boolean;
      obatPulangTersediaDanDiedukasi: boolean;
      lukaOperasiBersih: boolean;
    };
    instruksiPerawatanRumah: string;
    obatPulang: Array<{
      nama: string;
      aturan: string;
      keterangan: string;
    }>;
    tandaBahayaEmergency: string;
    jadwalKontrolPoli: string;
    dokterDPJP: string;
    edukatorNurse: string;
  };

  transferPasienData?: {
    jenisTransfer: 'Internal Antar Unit / ICU' | 'Eksternal Antar Rumah Sakit';
    unitAsal: string;
    unitTujuan: string;
    waktuTransfer: string;
    sbar: {
      situation: string;
      background: string;
      assessment: string;
      recommendation: string;
    };
    tandaVitalSaatPindah: {
      kesadaran: string;
      td: string;
      nadi: string;
      rr: string;
      suhu: string;
      spo2: string;
    };
    alatMedisTerpasang: string[];
    petugasPengantar: string;
    petugasPenerima: string;
  };

  dokumenUmumData?: {
    kategori: string;
    deskripsi?: string;
    tabelData?: Array<{
      label: string;
      value: string | number;
    }>;
    daftarBarang?: Array<{
      no?: number | string;
      kode?: string;
      nama: string;
      kategori?: string;
      jumlah?: string | number;
      satuan?: string;
      harga?: number;
      lokasi?: string;
      status?: string;
      keterangan?: string;
    }>;
  };

  sections?: Array<{
    title: string;
    type?: string;
    content?: string;
    tableData?: {
      headers: string[];
      rows: (string | number)[][];
    };
  }>;

  keteranganTambahan?: Record<string, any>;
  signer: SignerInfo;
  rawRecord?: Record<string, any>;
}
