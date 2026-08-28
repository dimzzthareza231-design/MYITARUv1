const fs = require('fs');
const { execSync } = require('child_process');

function appendEnd(file) {
  try {
    fs.appendFileSync(file, '\n}\n');
    console.log('Appended } to', file);
  } catch (e) {
    console.log(e.message);
  }
}

function removeClosingBrace(file, lineRegex) {
    // not used yet
}

appendEnd('src/components/Bridging/SatuSehatBridging.tsx');
appendEnd('src/components/Registration/RegistrationForm.tsx');
appendEnd('src/components/BPJS/Tabs/RujukanBPJS.tsx');
appendEnd('src/components/BPJS/Tabs/MappingKodeBPJS.tsx');

// NotificationPreferences.tsx:281
let notif = fs.readFileSync('src/components/NotificationPreferences.tsx', 'utf8');
const linesNotif = notif.split('\n');
console.log('Notif 280-285:', linesNotif.slice(275, 285).join('\n'));

// WAGatewayBridging.tsx:227
let wa = fs.readFileSync('src/components/Bridging/WAGatewayBridging.tsx', 'utf8');
const waLines = wa.split('\n');
console.log('WA 225-230:', waLines.slice(222, 230).join('\n'));

// GenerateSEP.tsx:65
let sep = fs.readFileSync('src/components/BPJS/Tabs/GenerateSEP.tsx', 'utf8');
const sepLines = sep.split('\n');
console.log('SEP 60-70:', sepLines.slice(58, 70).join('\n'));
