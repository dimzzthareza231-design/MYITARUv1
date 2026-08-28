export interface EmergencyContact {
  nama: string;
  hubungan: string;
  noHp: string;
  alamat: string;
}

export interface Alergi {
  allergen: string;
  reaction: string;
  severity: string;
}

export interface Problem {
  problem: string;
  icd10: string;
  onset: string;
}

export interface Obat {
  nama: string;
  dosis: string;
  frekuensi: string;
}

export interface TandaVital {
  td: string;
  nadi: string;
  suhu: string;
  rr: string;
  spo2: string;
}

export interface TtdData {
  nama: string;
  hubungan: string;
  nik: string;
  tanggalWaktu: string;
  signature: string;
}

export interface RegistrationFormState {
  // Demografi
  noRm: string;
  nik: string;
  namaLengkap: string;
  namaPanggilan: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  golonganDarah: string;
  rhesus: string;
  agama: string;
  sukuBangsa: string;
  kewarganegaraan: string;
  noPaspor: string;
  bahasa: string;
  statusPerkawinan: string;
  pendidikanTerakhir: string;

  // Kontak
  alamatKtp: string;
  samaDenganKtp: boolean;
  alamatDomisili: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kotaKabupaten: string;
  provinsi: string;
  kodePos: string;
  noHpUtama: string;
  noHpAlternatif: string;
  email: string;
  kontakDarurat: EmergencyContact[];

  // Pekerjaan
  pekerjaan: string;
  statusPekerjaan: string;
  namaPerusahaan: string;
  alamatPerusahaan: string;
  jabatan: string;
  penghasilan: string;
  jenisPekerjaan: string;

  // Penjamin
  jenisPenjamin: string;
  // BPJS
  noKartuBpjs: string;
  namaBpjs: string;
  jenisPesertaBpjs: string;
  kelasBpjs: string;
  faskes1Bpjs: string;
  namaIbuKandung: string;
  // Asuransi
  namaAsuransi: string;
  noPolis: string;
  namaTertanggung: string;
  masaBerlakuAsuransi: string;
  limitCoverage: string;
  // Perusahaan
  perusahaanPenjamin: string;
  noKaryawan: string;
  masaBerlakuPerusahaan: string;
  coveragePerusahaan: string;
  // Umum
  metodePembayaran: string;

  // Dokumen
  dokumenFiles: any[]; // we'll store file refs or metadata

  // Rujukan
  jenisKunjungan: string;
  poliTujuan: string;
  dokterPilihan: string;
  sumberInformasi: string;
  caraDatang: string;
  adaRujukan: string;
  jenisRujukan: string;
  noRujukan: string;
  faskesPengirim: string;
  tanggalRujukan: string;
  diagnosisRujukan: string;
  adaSuratKontrol: string;
  noSuratKontrol: string;
  tanggalKontrol: string;
  dokterSK: string;
  poliSK: string;

  // Data Medis Awal
  keluhanUtama: string;
  riwayatAlergi: Alergi[];
  tandaVital: TandaVital;
  problemList: Problem[];
  obatKonsumsi: Obat[];

  // Persetujuan
  setujuUmum: boolean;
  setujuPdp: boolean;
  setujuHakKewajiban: boolean;
  pernyataanBenar: boolean;
  ttdData: TtdData;
}
