const fs = require('fs');
let content = fs.readFileSync('src/components/PatientManagement.tsx', 'utf8');

// Remove MOCK_PATIENTS and add imports
content = content.replace(/const MOCK_PATIENTS = \[[\s\S]*?\];\n\n/, '');
content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { useHospital } from '../contexts/HospitalContext';\nimport type { Patient } from '../types';");

// Use context
content = content.replace(
  "export function PatientManagement() {", 
  "export function PatientManagement() {\n  const { patients, addPatient } = useHospital();\n  const [isAdding, setIsAdding] = useState(false);\n"
);

// Replace MOCK_PATIENTS usages with patients
content = content.replace(/MOCK_PATIENTS\[0\]\.id/g, 'patients[0]?.id || ""');
content = content.replace(/MOCK_PATIENTS\.find/g, 'patients.find');
content = content.replace(/MOCK_PATIENTS\[0\]/g, 'patients[0]');
content = content.replace(/MOCK_PATIENTS\.filter/g, 'patients.filter');

// Add onClick to add patient button
content = content.replace(
  /<button className="btn-primary">/,
  '<button className="btn-primary" onClick={() => setIsAdding(true)}>'
);

fs.writeFileSync('src/components/PatientManagement.tsx', content);
