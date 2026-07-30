import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('export interface User')) {
  content += `\nexport type UserRole = 'Doctor' | 'Nurse' | 'Medical Record' | 'Lab' | 'Management' | 'Admin';\n\nexport interface User {\n  id: string;\n  name: string;\n  role: UserRole;\n  department: string;\n  initials: string;\n  status: 'On Duty' | 'Off Duty';\n}\n`;
  fs.writeFileSync('src/types.ts', content);
}
