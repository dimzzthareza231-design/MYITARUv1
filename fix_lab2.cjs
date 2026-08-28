const fs = require('fs');
let c = fs.readFileSync('src/components/Laboratorium/CetakHasilModal.tsx', 'utf8');

c = c.replace(/order\.id_rs/g, 'order.id');

fs.writeFileSync('src/components/Laboratorium/CetakHasilModal.tsx', c);
console.log("Fixed Lab order.id_rs");
