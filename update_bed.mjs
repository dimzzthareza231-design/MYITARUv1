import fs from 'fs';
let content = fs.readFileSync('src/components/BedManagement.tsx', 'utf8');

const oldWards = `    { id: 'icu', name: 'ICU', capacity: 10, type: 'Critical Care' },
    { id: 'vip', name: 'VIP Pavilion', capacity: 15, type: 'Premium' },
    { id: 'melati', name: 'Melati (Maternity)', capacity: 20, type: 'General' },
    { id: 'mawar', name: 'Mawar (Surgical)', capacity: 25, type: 'General' },
    { id: 'anggrek', name: 'Anggrek (Pediatrics)', capacity: 20, type: 'General' },`;

const newWards = `    { id: 'icu', name: 'ICU', capacity: 50, type: 'Critical Care' },
    { id: 'vip', name: 'VIP Pavilion', capacity: 100, type: 'Premium' },
    { id: 'melati', name: 'Melati (Maternity)', capacity: 150, type: 'General' },
    { id: 'mawar', name: 'Mawar (Surgical)', capacity: 200, type: 'General' },
    { id: 'anggrek', name: 'Anggrek (Pediatrics)', capacity: 150, type: 'General' },
    { id: 'dahlia', name: 'Dahlia (Internal Med)', capacity: 200, type: 'General' },`;

content = content.replace(oldWards, newWards);

fs.writeFileSync('src/components/BedManagement.tsx', content);
