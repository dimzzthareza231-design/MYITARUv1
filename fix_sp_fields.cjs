const fs = require('fs');
let c = fs.readFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', 'utf8');

c = c.replace(/selectedPO.supplier/g, "selectedPO.pbf_tujuan");
c = c.replace(/item.kemasan/g, "(item as any).kemasan");
c = c.replace(/item.jumlah_pesan/g, "item.jumlah_order");
c = c.replace(/selectedPO.total_harga/g, "selectedPO.total_nilai");

fs.writeFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', c);
console.log("Fixed DefectaProcurementTab fields");
