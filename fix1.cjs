const fs = require('fs');
let c = fs.readFileSync('src/components/Finance/KwitansiTab.tsx', 'utf8');

c = c.replace(
    /\s*\)\s*:\s*\(\s*<div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">/g,
    `
          </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">`
);

fs.writeFileSync('src/components/Finance/KwitansiTab.tsx', c);
