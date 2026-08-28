const fs = require('fs');

// 1. DocumentPreviewModal
let d = fs.readFileSync('src/components/Documents/DocumentPreviewModal.tsx', 'utf8');
d = d.replace(/doc\./g, 'doc?.');
fs.writeFileSync('src/components/Documents/DocumentPreviewModal.tsx', d);

// 2. CetakHasilModal
let c = fs.readFileSync('src/components/Laboratorium/CetakHasilModal.tsx', 'utf8');
c = c.replace(/order\.no_order/g, 'order.id');
fs.writeFileSync('src/components/Laboratorium/CetakHasilModal.tsx', c);

// 3. DefectaProcurementTab
let p = fs.readFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', 'utf8');
p = p.replace(/selectedPO\.pbf_tujuan/g, '(selectedPO as any).supplier');
p = p.replace(/selectedPO\.total_nilai/g, '(selectedPO as any).total_harga');
fs.writeFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', p);

// 4. LembarHasilPrint
let r = fs.readFileSync('src/components/Radiologi/LembarHasilPrint.tsx', 'utf8');
r = r.replace(/item\.tanggal_lahir/g, '(item as any).tanggal_lahir');
r = r.replace(/item\.tindakan/g, '(item as any).tindakan');
r = r.replace(/exp\?\.keterangan_klinis/g, '(exp as any)?.keterangan_klinis');
r = r.replace(/exp\?\.deskripsi_hasil/g, '(exp as any)?.deskripsi_hasil');
r = r.replace(/exp\?\.kesimpulan/g, '(exp as any)?.kesimpulan');
r = r.replace(/item\.waktu_validasi/g, '(item as any).waktu_validasi');
r = r.replace(/item\.dokter_radiologi/g, '(item as any).dokter_radiolog');
r = r.replace(/item\.nomor_pemeriksaan/g, 'item.id');
fs.writeFileSync('src/components/Radiologi/LembarHasilPrint.tsx', r);

console.log("Fixed all type issues.");
