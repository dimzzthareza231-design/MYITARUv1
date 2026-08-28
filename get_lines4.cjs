const fs = require('fs');
const lines = fs.readFileSync('src/components/RME/SmartVoiceReport.tsx', 'utf8').split('\n');
console.log(lines.slice(390, 415).join('\n'));
