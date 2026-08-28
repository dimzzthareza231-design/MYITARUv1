const fs = require('fs');
const lines = fs.readFileSync('src/components/RME/Patient360.tsx', 'utf8').split('\n');
console.log(lines.slice(140, 175).join('\n'));
