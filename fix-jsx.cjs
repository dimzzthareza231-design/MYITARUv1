const fs = require('fs');
let content = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');

// Fix value={... without }
content = content.replace(/value=\{([^}]+)\s*\n(\s*)onChange/g, 'value={$1}\n$2onChange');
// Fix onChange={... without }
content = content.replace(/onChange=\{([^}]+)\s*\n(\s*)className/g, 'onChange={$1}\n$2className');

fs.writeFileSync('src/components/NotificationPreferences.tsx', content);
