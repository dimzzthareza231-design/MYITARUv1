const fs = require('fs');
let c = fs.readFileSync('src/components/RME/SmartVoiceReport.tsx', 'utf8');
c = c.replace(/\/\/ Update last resume\s*\n\s*\.toLocaleDateString\('id-ID', \{ day: '2-digit', month: 'short', year: 'numeric' \}\)\s*\n\s*\}/, 
  "// Update last resume");
fs.writeFileSync('src/components/RME/SmartVoiceReport.tsx', c);
