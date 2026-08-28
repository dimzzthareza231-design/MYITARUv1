const fs = require('fs');
const text = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');
const lines = text.split('\n');
console.log(lines.slice(-30).join('\n'));
