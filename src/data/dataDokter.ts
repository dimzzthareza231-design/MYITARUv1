import { DATA_DOKTER_JAGA_LENGKAP, DoctorDutyRecord } from './dataDokterJagaLengkap';

export interface Dokter {
  id: string;
  nip: string;
  namaLengkap: string;   // Sudah termasuk gelar lengkap
  gelar: string;
  spesialisasi: string;
  poliId: string;
  poliNama: string;
  sip: string;           // Surat Izin Praktik
  str?: string;
  noHp: string;
  email: string;
  jadwalPraktik: string;
  shift?: string;
  ruangan?: string;
  peran?: string;
  kuotaPasien?: number;
  status: 'Aktif' | 'Cuti' | 'Non-Aktif';
}

export const DATA_DOKTER: Dokter[] = DATA_DOKTER_JAGA_LENGKAP.map((d: DoctorDutyRecord) => ({
  id: d.id,
  nip: d.nip,
  namaLengkap: d.nama,
  gelar: d.gelar,
  spesialisasi: d.spesialisasi,
  poliId: d.poli_id || 'poli-umum',
  poliNama: d.poli_nama || d.unit_tugas,
  sip: d.sip,
  str: d.str,
  noHp: d.kontak_darurat,
  email: d.email,
  jadwalPraktik: `${d.hari_praktik}, ${d.jam_praktik}`,
  shift: d.shift,
  ruangan: d.ruangan,
  peran: d.peran,
  kuotaPasien: d.kuota_pasien,
  status: 'Aktif'
}));

export function getDokterById(id: string): Dokter | undefined {
  return DATA_DOKTER.find(d => d.id === id);
}

export function getDokterByPoli(poliId: string): Dokter[] {
  return DATA_DOKTER.filter(d => d.poliId === poliId);
}
