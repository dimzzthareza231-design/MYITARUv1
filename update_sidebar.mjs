import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const oldGroups = `        { id: 'forms', label: 'Forms & Workflows', icon: FileText },`;
const newGroups = `        { id: 'forms-doctor', label: 'Forms (Doctor)', icon: FileText },
        { id: 'forms-nurse', label: 'Forms (Nurse)', icon: FileText },
        { id: 'forms-medical-record', label: 'Forms (Med Record)', icon: FileText },`;

content = content.replace(oldGroups, newGroups);

const pharmacyInsert = `        { id: 'pharmacy', label: 'Pharmacy', icon: FlaskConical },
        { id: 'records', label: 'Records', icon: FileText },`;

content = content.replace(`        { id: 'records', label: 'Records', icon: FileText },`, pharmacyInsert);

if (!content.includes('FlaskConical')) {
  content = content.replace('Stethoscope', 'Stethoscope, FlaskConical');
}

fs.writeFileSync('src/components/Sidebar.tsx', content);
