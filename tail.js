const fs = require('fs');
const text = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');
const lines = text.split('\n');
fs.writeFileSync('tail.txt', lines.slice(-30).join('\n'));
