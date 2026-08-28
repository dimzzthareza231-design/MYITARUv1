const fs = require('fs');
let c = fs.readFileSync('src/components/ErrorBoundary.tsx', 'utf8');
c = c.replace(/try \{ window\.localStorage\.removeItem\(k\); \} catch \(e\) \{\}/g, '');
fs.writeFileSync('src/components/ErrorBoundary.tsx', c);
