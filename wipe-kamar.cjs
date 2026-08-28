const fs = require('fs');

let content = fs.readFileSync('src/components/KamarOperasi.tsx', 'utf8');

// The tricky part:
//   const [pasienList, setPasienList] = useState<PasienOperasiItem[]>(() => {
//     if (saved) {
//       try { ... }

content = content.replace(/useState<PasienOperasiItem\[\]>\(\(\) => \{[^}]*if \(saved\)[^}]*\} catch [^}]*\}[^}]*\}\s*return \[\];\s*\}\)/g, 'useState<PasienOperasiItem[]>([])');

fs.writeFileSync('src/components/KamarOperasi.tsx', content);

