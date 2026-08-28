const fs = require('fs');
const names = ['Budi', 'Siti', 'Andi', 'Rina', 'Joko', 'Dewi', 'Ahmad', 'Fitri', 'Eko', 'Sari', 'Hendro', 'Lestari', 'Tono', 'Maya', 'Rudi'];
const lastNames = ['Santoso', 'Aminah', 'Wijaya', 'Melati', 'Anwar', 'Putri', 'Pratama', 'Wulandari', 'Kusuma', 'Saputra', 'Setiawan', 'Kurniawan', 'Hidayat'];
const streets = ['Jl. Sudirman', 'Jl. Thamrin', 'Jl. Gatot Subroto', 'Jl. Melawai', 'Jl. Kemang', 'Jl. Kebon Jeruk', 'Jl. Menteng', 'Jl. Kuningan', 'Jl. Senayan'];
const bloodGroups = ['O', 'A', 'B', 'AB'];

const patients = [];
for (let i = 1; i <= 100; i++) {
  const idStr = String(i).padStart(6, '0');
  const gender = i % 2 === 0 ? 'P' : 'L';
  const name = names[i % names.length] + ' ' + lastNames[i % lastNames.length];
  const tgl = 1940 + (i % 60);
  const bln = String((i % 12) + 1).padStart(2, '0');
  const hari = String((i % 28) + 1).padStart(2, '0');
  
  patients.push(`  { id: 'P${i}', no_rm: 'RM-${idStr}', nik: '317123456789${String(i).padStart(4, '0')}', nama: '${name}', tanggal_lahir: '${tgl}-${bln}-${hari}', jenis_kelamin: '${gender}', alamat: '${streets[i % streets.length]} No ${i}, Jakarta', telepon: '0812${String(i).padStart(8, '0')}', golongan_darah: '${bloodGroups[i % 4]}' }`);
}

console.log(`const dummyPasien: Pasien[] = [\n${patients.join(',\\n')}\n];`);
