const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Fix useEffect setPersistence
code = code.replace(
  /setPersistence\(auth, browserLocalPersistence\)\.catch\(\(err\) => \{\n\s*console\.warn\('Firebase Auth persistence setup notice:', err\);\n\s*\}\);/,
  `if (isFirebaseConfigured) {\n      setPersistence(auth, browserLocalPersistence).catch((err) => {\n        console.warn('Firebase Auth persistence setup notice:', err);\n      });\n    }`
);

// Fix signInWithGoogle setPersistence
code = code.replace(
  /await setPersistence\(auth, browserLocalPersistence\);/g,
  `if (isFirebaseConfigured) await setPersistence(auth, browserLocalPersistence);`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
