export type PaymentMethod = 'Tunai' | 'QRIS' | 'Debit' | 'Kredit' | 'Transfer VA' | 'BPJS' | 'Asuransi Swasta' | 'Split Payment';

export type BillingStatus = 'Belum Lunas' | 'Lunas' | 'Sebagian' | 'Dibatalkan' | 'Menunggu Verifikasi BPJS';

export interface BillingItem {
  id: string;
  kategori: 'Pendaftaran' | 'Konsultasi' | 'Tindakan' | 'Kamar' | 'Farmasi' | 'Laboratorium' | 'Radiologi' | 'Alkes' | 'Lainnya';
  deskripsi: string;
  jumlah: number;
  satuan?: string;
  hargaSatuan: number;
  diskonNominal?: number;
  total: number;
  penjaminCovered?: boolean;
}

export interface BillingRecord {
  id: string;
  noBilling: string;
  noKwitansi?: string;
  kunjunganId: string;
  pasienId: string;
  noRm: string;
  namaPasien: string;
  nik?: string;
  jenisKelamin: 'L' | 'P' | string;
  umur?: string;
  tipeLayanan: 'Rawat Jalan' | 'Rawat Inap' | 'IGD';
  poliRuangan: string;
  dokterId?: string;
  namaDokter: string;
  penjaminId: string;
  namaPenjamin: string;
  tipePenjamin: 'BPJS' | 'Asuransi' | 'Umum' | 'Perusahaan';
  noSep?: string;
  tanggalMasuk: string;
  tanggalKeluar?: string;
  lamaInapHari?: number;
  items: BillingItem[];
  subtotal: number;
  diskonTotal: number;
  pajak: number;
  biayaAdministrasi: number;
  totalTagihan: number;
  uangMukaDeposit: number;
  sisaTagihan: number;
  jumlahDibayar: number;
  kembalian: number;
  metodePembayaran: PaymentMethod;
  detailSplitPayment?: {
    metodeUtama: PaymentMethod;
    nominalUtama: number;
    metodeKedua: PaymentMethod;
    nominalKedua: number;
  };
  nomorReferensiPembayaran?: string; // No Trace EDC / Ref VA / ID QRIS
  status: BillingStatus;
  kasirNama: string;
  waktuPembayaran?: string;
  catatan?: string;
}

export interface MasterTarifItem {
  id: string;
  kodeTarif: string;
  namaLayanan: string;
  kategori: 'Pendaftaran' | 'Konsultasi Dokter' | 'Tindakan Medis' | 'Akomodasi Kamar' | 'Tindakan Keperawatan' | 'Laboratorium' | 'Radiologi';
  unit?: string;
  unitLayanan?: string;
  kelas?: string;
  kelasRuangan?: string;
  jasaSarana?: number;
  jasaDokter?: number;
  jasaPerawat?: number;
  totalTarif?: number;
  tarifTotal?: number;
  statusAktif: boolean;
  rincianJasa?: {
    jasaSarana?: number;
    jasaRS?: number;
    jasaDokter: number;
    jasaParamedis: number;
    bhp?: number;
    bahanHabisPakai?: number;
  };
}

export interface ShiftKasirRecord {
  id: string;
  shift: string;
  tanggal?: string;
  kasirId?: string;
  namaKasir?: string;
  kasirNama?: string;
  waktuMulai?: string;
  waktuSelesai?: string;
  modalAwal: number;
  modalAwalKas?: number;
  totalTunai: number;
  totalPenerimaanTunai?: number;
  totalQRIS: number;
  totalEDC: number;
  totalTransfer: number;
  totalPenerimaanNonTunai?: number;
  totalBPJSAsuransi: number;
  totalPenerimaan: number;
  totalPenerimaanKeseluruhan?: number;
  totalKasFisikDiserahkan: number;
  kasFisikTutup?: number;
  selisihKas: number;
  statusShift: string;
  catatanSerahTerima?: string;
  catatanTutup?: string;
}

export interface INACBGsClaimItem {
  id: string;
  noKlaim: string;
  noSep: string;
  noRm: string;
  namaPasien: string;
  jenisRawat: 'Rawat Jalan' | 'Rawat Inap';
  kelasRawat: 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Non Kelas';
  tglMasuk: string;
  tglPulang: string;
  lamaHari: number;
  diagnosaUtamaCode: string;
  diagnosaUtamaDesc: string;
  diagnosaSekunder: string[];
  prosedurUtamaCode?: string;
  prosedurUtamaDesc?: string;
  prosedurSekunder?: string[];
  kodeInaCbg: string;
  deskripsiInaCbg: string;
  tarifInaCbg: number;
  specialCmgTopup: number;
  totalTarifKlaim: number;
  realCostHospital: number;
  marginHospital: number; // totalTarifKlaim - realCostHospital
  statusKlaim: 'Draft' | 'Siap Kirim' | 'Diajukan' | 'Verifikasi Vedika' | 'Disetujui' | 'Dispute' | 'Klaim Cair';
  catatanVerifikator?: string;
  kelengkapanDokumen: {
    sep: boolean;
    resumeMedis: boolean;
    billing: boolean;
    hasilLabRad: boolean;
    laporanOperasi?: boolean;
    resepFarmasi: boolean;
  };
  aiAudit: {
    skorKelayakan: number; // 0 - 100
    statusAudit: 'Aman' | 'Potensi Pending' | 'Tinggi Resiko Dispute';
    temuan: string[];
    rekomendasi: string;
  };
}

export interface JasaMedisDokterRecord {
  id: string;
  dokterId: string;
  namaDokter: string;
  spesialisasi: string;
  periode: string;
  totalPasien: number;
  totalVisiteRanap: number;
  totalKonsultasiRalan: number;
  totalTindakanOperatif: number;
  brutoJasaMedis: number;
  porsiDokter: number; // misal 70%
  porsiRumahSakit: number; // misal 30%
  potonganPPh21: number;
  potonganManajemen: number;
  nettoDiterima: number;
  statusPembayaran: 'Draft' | 'Disetujui Direksi' | 'Sudah Ditransfer';
}
