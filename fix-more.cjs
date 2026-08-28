const fs = require('fs');

let notif = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');
notif = notif.replace(/(\s+)\)(\s*)<\/div>\s*<\/div>\s*<\/div>\s*{\/\* Test Sender \*\//, '$1)}$2</div>\n            </div>\n          </div>\n          {/* Test Sender */}');
fs.writeFileSync('src/components/NotificationPreferences.tsx', notif);

let wa = fs.readFileSync('src/components/Bridging/WAGatewayBridging.tsx', 'utf8');
wa = wa.replace(/\}, 800\s*\n\s*\};/, '}, 800);\n  };');
fs.writeFileSync('src/components/Bridging/WAGatewayBridging.tsx', wa);

let sep = fs.readFileSync('src/components/BPJS/Tabs/GenerateSEP.tsx', 'utf8');
sep = sep.replace(/\}, 2000\s*\n\s*\};/, '}, 2000);\n  };');
fs.writeFileSync('src/components/BPJS/Tabs/GenerateSEP.tsx', sep);

