const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<ShieldCheck className="w-4 h-4 text-emerald-500" title="Signed Document" \/>/g,
  '<span title="Signed Document"><ShieldCheck className="w-4 h-4 text-emerald-500" /></span>'
);

code = code.replace(
  /<Lock className="w-4 h-4 text-slate-500" title="Locked Document" \/>/g,
  '<span title="Locked Document"><Lock className="w-4 h-4 text-slate-500" /></span>'
);

fs.writeFileSync(file, code);
