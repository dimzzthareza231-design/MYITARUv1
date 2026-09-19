const fs = require('fs');
let code = fs.readFileSync('src/lib/firestoreService.ts', 'utf8');
code = code.replace(/catch \(error\) \{\n\s*console\.error\('Failed to seed users:', error\);\n\s*throw error;\n\s*\}/g, "catch (error: any) {\n      console.error('Failed to seed users:', error);\n      throw error;\n    }");
// Find the provider parameter error and add type
code = code.replace(/\(provider\) => provider\.providerId/g, "(provider: any) => provider.providerId");
fs.writeFileSync('src/lib/firestoreService.ts', code);
