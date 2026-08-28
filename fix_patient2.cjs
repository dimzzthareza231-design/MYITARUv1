const fs = require('fs');
let c = fs.readFileSync('src/components/RME/Patient360.tsx', 'utf8');
c = c.replace(/const currentDraft = JSON\.parse\(null \|\| '\{\}'\);\s*\n\s*\+ `\[Google Search Grounding\]:\\n\$\{rec\}`\s*\n\s*\}/, 
  "const saved = localStorage.getItem('simrs_soap_draft'); const currentDraft = JSON.parse(saved || '{}'); localStorage.setItem('simrs_soap_draft', JSON.stringify({ ...currentDraft, plan: (currentDraft.plan || '') + `\\n\\n[Google Search Grounding]:\\n${rec}` }));");
fs.writeFileSync('src/components/RME/Patient360.tsx', c);
