const fs = require('fs');
let code = fs.readFileSync('src/contexts/HospitalContext.tsx', 'utf8');

// Ensure import
if (!code.includes('isFirebaseConfigured')) {
  code = code.replace(
    /import \{ db \} from '\.\.\/lib\/firebase';/,
    "import { db, isFirebaseConfigured } from '../lib/firebase';"
  );
}

// Add early return in useEffect
code = code.replace(
  /\/\/ Real-time Firestore listeners for core hospital collections\n\s*useEffect\(\(\) => \{\n\s*let seededPasien = false;/,
  "// Real-time Firestore listeners for core hospital collections\n  useEffect(() => {\n    if (!isFirebaseConfigured) return;\n    let seededPasien = false;"
);

fs.writeFileSync('src/contexts/HospitalContext.tsx', code);
