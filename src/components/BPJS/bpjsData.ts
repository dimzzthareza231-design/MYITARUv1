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
  if (!localStorage.getItem(BPJS_KEYS.PESERTA)) {
    localStorage.setItem(BPJS_KEYS.PESERTA, JSON.stringify([
      { nik: '3201123456789001', noKartu: '0001234567891', nama: 'Budi Santoso', tgLahir: '1985-05-12', jk: 'L', noTelp: '081234567890', faskes1: 'Puskesmas Melati', kelas: 'Kelas 1', status: 'Aktif' },
      { nik: '3201123456789002', noKartu: '0001234567892', nama: 'Siti Aminah', tgLahir: '1990-11-20', jk: 'P', noTelp: '081234567891', faskes1: 'Klinik Sehat', kelas: 'Kelas 2', status: 'Non-Aktif' },
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.RUJUKAN)) {
    localStorage.setItem(BPJS_KEYS.RUJUKAN, JSON.stringify([
      { noRujukan: '1234567890', tglKunjungan: '2023-10-15', noKartu: '0001234567891', nama: 'Budi Santoso', poliRujukan: 'Penyakit Dalam', diagnosa: 'A09 - Diarrhoea', faskesPerujuk: 'Puskesmas Melati', status: 'Aktif' },
    ]));
  }
  
  if (!localStorage.getItem(BPJS_KEYS.SEP)) {
    localStorage.setItem(BPJS_KEYS.SEP, JSON.stringify([
      { noSep: '0001R01230823000001', tglSep: '2023-10-15', noKartu: '0001234567891', nama: 'Budi Santoso', poli: 'Penyakit Dalam', diagnosa: 'A09 - Diarrhoea', kelas: 'Kelas 1', status: 'Tercetak' }
    ]));
  }
  
  if (!localStorage.getItem(BPJS_KEYS.SURAT_KONTROL)) {
    localStorage.setItem(BPJS_KEYS.SURAT_KONTROL, JSON.stringify([
      { noSuratKontrol: 'SK-202310-001', tglRencanaKontrol: '2023-10-22', noSepAsal: '0001R01230823000001', noKartu: '0001234567891', nama: 'Budi Santoso', poli: 'Penyakit Dalam', dokter: 'Dr. Andi', status: 'Aktif' }
    ]));
  }
  
  if (!localStorage.getItem(BPJS_KEYS.PRB)) {
    localStorage.setItem(BPJS_KEYS.PRB, JSON.stringify([
      { noSRB: 'PRB-202310-001', noSep: '0001R01230823000001', noKartu: '0001234567891', nama: 'Budi Santoso', alamat: 'Jl. Merdeka No 1', email: 'budi@example.com', program: 'Diabetes Melitus', faskes1: 'Puskesmas Melati', keterangan: 'Rujuk Balik' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.KLAIM)) {
    localStorage.setItem(BPJS_KEYS.KLAIM, JSON.stringify([
      { id: 'KLM-001', noSep: '0001R01230823000001', nama: 'Budi Santoso', poli: 'Penyakit Dalam', diagnosa: 'A09', totalBiaya: 1500000, status: 'Pending', tglSep: '2023-10-15', dokter: 'Dr. Andi' }
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.LOG)) {
    localStorage.setItem(BPJS_KEYS.LOG, JSON.stringify([
      { id: 'LOG-001', time: '2023-08-08 10:15:22', endpoint: '/sep/1.1/insert', method: 'POST', status: 200, message: 'Sukses', responseTime: 245, user: 'Dr. Andi', action: 'Create SEP' },
    ]));
  }

  if (!localStorage.getItem(BPJS_KEYS.MAPPING)) {
    localStorage.setItem(BPJS_KEYS.MAPPING, JSON.stringify([
      { id: 'M-001', type: 'Poli', internalCode: 'INT', internalName: 'Penyakit Dalam', bpjsCode: 'INT', bpjsName: 'Penyakit Dalam' }
    ]));
  }
};
