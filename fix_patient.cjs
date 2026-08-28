const fs = require('fs');
let c = fs.readFileSync('src/components/RME/Patient360.tsx', 'utf8');
c = c.replace(/    <\/div>\s*\n  \);/g, '    </div>\n  );\n}');
fs.writeFileSync('src/components/RME/Patient360.tsx', c);
