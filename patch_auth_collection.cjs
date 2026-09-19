const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
code = code.replace(
  /const unsubscribe = onSnapshot\(collection\(db, 'users'\), \(snapshot\) => \{/g,
  "const unsubscribe = isFirebaseConfigured ? onSnapshot(collection(db, 'users'), (snapshot) => {"
);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
