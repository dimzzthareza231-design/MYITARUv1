const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');
code = code.replace(/\(provider\) => provider\.providerId/g, "(provider: any) => provider.providerId");
fs.writeFileSync('src/lib/firestoreService.ts', code);
