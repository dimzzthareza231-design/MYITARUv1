const fs = require('fs');
const content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf-8');
const fixedContent = content.replace(
  'return saved ? JSON.parse(saved) : PASIEN;',
  'return saved ? JSON.parse(saved) : PASIEN.map(p => ({ id: String(p.id), no_rm: p.no_rm, nik: p.nik, nama: p.nama, tanggal_lahir: p.tanggal_lahir, jenis_kelamin: p.jenis_kelamin, alamat: p.alamat, telepon: p.no_hp, golongan_darah: ["A","B","AB","O"][p.id % 4] }));'
);
fs.writeFileSync('src/contexts/HospitalContext.tsx', fixedContent);
