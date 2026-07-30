import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

content = content.replace("name: 'Dr. Budi Santoso'", "name: 'Dr. Budi Santoso, Sp.JP'");
content = content.replace("name: 'Dr. Sarah Connor'", "name: 'Dr. Sarah Connor, Sp.N'");
content = content.replace("name: 'Siti Aminah, RN'", "name: 'Siti Aminah, S.Kep., Ns.'");
content = content.replace("name: 'Ahmad, S.Kom'", "name: 'Ahmad, A.Md.RMIK'");
content = content.replace("name: 'Admin System'", "name: 'M. Reza, S.Kom., M.TI'");

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
