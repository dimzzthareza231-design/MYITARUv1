const fs = require('fs');
let c = fs.readFileSync('src/components/Finance/KwitansiTab.tsx', 'utf8');

const ternaryStart = '{selectedBilling ? (';
c = c.replace(ternaryStart, '{selectedBilling ? (\n          <>');

const ternaryMid = `          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">`;

c = c.replace(ternaryMid, `          </>\n          ) : (\n            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">`);

fs.writeFileSync('src/components/Finance/KwitansiTab.tsx', c);
console.log("Fixed KwitansiTab syntax.");
