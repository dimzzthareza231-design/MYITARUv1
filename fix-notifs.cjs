const fs = require('fs');
let c = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');
c = c.replace(/\)\)\n/g, '))}\n');
c = c.replace(/\)\)\}\}/g, '))}');
fs.writeFileSync('src/components/NotificationPreferences.tsx', c);
