import fs from 'fs';
let content = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

content = content.replace("rmNumber: 'RM-123456'", "rmNumber: 'RM-000000'");
content = content.replace("rmNumber: 'RM-123457'", "rmNumber: 'RM-000001'");
content = content.replace("rmNumber: \`RM-\${123458 + i}\`", "rmNumber: \`RM-\${i.toString().padStart(6, '0')}\`");

fs.writeFileSync('src/contexts/HospitalContext.tsx', content);
