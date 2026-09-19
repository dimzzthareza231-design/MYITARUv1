import { INITIAL_INACBGS_CLAIMS } from '../Finance/mockFinanceData';

export const BPJS_KEYS = {
  PESERTA: 'bpjs_peserta',
  RUJUKAN: 'bpjs_rujukan',
  SEP: 'bpjs_sep',
  SURAT_KONTROL: 'bpjs_surat_kontrol',
  PRB: 'bpjs_prb',
  KLAIM: 'bpjs_klaim',
  KLAIM_DETAIL: 'bpjs_klaim_detail',
  MAPPING: 'bpjs_mapping',
  LOG: 'bpjs_log'
};

export const initBPJSData = () => {
  if (!localStorage.getItem(BPJS_KEYS.KLAIM)) {
    // Map from finance mock data for consistency
    const klaimData = INITIAL_INACBGS_CLAIMS.map(k => ({
      id: k.id,
      no_klaim: k.noKlaim,
      no_sep: k.noSep,
      no_rm: k.noRm,
      nama_pasien: k.namaPasien,
      diagnosis_utama: `${k.diagnosaUtamaCode} - ${k.diagnosaUtamaDesc}`,
      tindakan_utama: k.prosedurUtamaCode ? `${k.prosedurUtamaCode} - ${k.prosedurUtamaDesc}` : '-',
      total_biaya: k.totalTarifKlaim,
      status: k.statusKlaim,
      tanggal: k.tglMasuk
    }));
    localStorage.setItem(BPJS_KEYS.KLAIM, JSON.stringify(klaimData));
  }

  if (!localStorage.getItem(BPJS_KEYS.PESERTA)) {
    localStorage.setItem(BPJS_KEYS.PESERTA, JSON.stringify([
      { noKartu: '0001234567890', nik: '3201123456780001', nama: 'Budi Santoso', faskes1: 'Puskesmas Melati', kelas: 'Kelas 1', status: 'Aktif' },
      { noKartu: '0001234567891', nik: '3201123456780002', nama: 'Siti Aminah', faskes1: 'Klinik Sehat', kelas: 'Kelas 2', status: 'Aktif' },
      { noKartu: '0001234567892', nik: '3201123456780003', nama: 'Agus Setiawan', faskes1: 'Klinik Berkah', kelas: 'Kelas 3', status: 'Tidak Aktif' },
      { noKartu: '0001234567893', nik: '3201123456780019', nama: 'Hj. Fatimah Zahra', faskes1: 'Puskesmas Cempaka', kelas: 'Kelas 2', status: 'Aktif' },
      { noKartu: '0001234567894', nik: '3201123456780032', nama: 'Supriyadi', faskes1: 'Puskesmas Anggrek', kelas: 'Kelas 1', status: 'Aktif' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.RUJUKAN)) {
    localStorage.setItem(BPJS_KEYS.RUJUKAN, JSON.stringify([
      { noRujukan: '1234567890123456', noKartu: '0001234567890', nama: 'Budi Santoso', poliRujukan: 'Poli Penyakit Dalam', faskesPerujuk: 'Puskesmas Melati', diagnosa: 'Type 2 Diabetes Mellitus', status: 'Aktif' },
      { noRujukan: '1234567890123457', noKartu: '0001234567893', nama: 'Hj. Fatimah Zahra', poliRujukan: 'Poli Penyakit Dalam', faskesPerujuk: 'Puskesmas Cempaka', diagnosa: 'Dengue Fever', status: 'Digunakan' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.SEP)) {
    localStorage.setItem(BPJS_KEYS.SEP, JSON.stringify(
      INITIAL_INACBGS_CLAIMS.map(k => ({
        noSep: k.noSep,
        noRujukan: '1234567890' + Math.floor(Math.random() * 1000000),
        noKartu: '000123456789' + Math.floor(Math.random() * 10),
        nama: k.namaPasien,
        poli: k.jenisRawat === 'Rawat Inap' ? 'IGD/Ranap' : 'Poli Penyakit Dalam',
        diagnosa: `${k.diagnosaUtamaCode} - ${k.diagnosaUtamaDesc}`,
        tipe: k.jenisRawat,
        status: 'Aktif',
        tglSep: k.tglMasuk
      }))
    ));
  }

  if (!localStorage.getItem(BPJS_KEYS.SURAT_KONTROL)) {
    localStorage.setItem(BPJS_KEYS.SURAT_KONTROL, JSON.stringify([
      { id: '1', no_surat: 'SK-20260801-001', nama_pasien: 'Budi Santoso', tanggal_kontrol: '2026-08-15', dokter: 'dr. Bambang Irawan, Sp.PD', poli: 'Poli Penyakit Dalam', diagnosis: 'Type 2 Diabetes Mellitus', status: 'Aktif' },
      { id: '2', no_surat: 'SK-20260801-002', nama_pasien: 'Hj. Fatimah Zahra', tanggal_kontrol: '2026-08-20', dokter: 'dr. Maya Indah, Sp.OG', poli: 'Poli Kebidanan & Kandungan', diagnosis: 'Dengue Fever Follow-up', status: 'Aktif' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.PRB)) {
    localStorage.setItem(BPJS_KEYS.PRB, JSON.stringify([
      { id: '1', no_prb: 'PRB-20260801-001', nama_pasien: 'Budi Santoso', program: 'Diabetes Mellitus', faskes_perujuk: 'Puskesmas Melati', tanggal_mulai: '2026-08-01', status: 'Aktif' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.MAPPING)) {
    localStorage.setItem(BPJS_KEYS.MAPPING, JSON.stringify({
      poli: [
        { id: 1, kode_internal: 'PDU', nama_internal: 'Poli Umum', kode_bpjs: '005', nama_bpjs: 'Poli Umum' },
        { id: 2, kode_internal: 'PDG', nama_internal: 'Poli Penyakit Dalam', kode_bpjs: '009', nama_bpjs: 'Poli Penyakit Dalam' }
      ],
      dokter: [
        { id: 1, kode_internal: 'D001', nama_internal: 'dr. Bambang Irawan, Sp.PD', kode_bpjs: '10293', nama_bpjs: 'BAMBANG IRAWAN' }
      ],
      obat: [],
      tindakan: []
    }));
  }
};
