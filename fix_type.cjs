const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');
code = code.replace(/provider: any => \(\{/g, "(provider: any) => ({");
fs.writeFileSync('src/lib/firestoreService.ts', code);
