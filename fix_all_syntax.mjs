import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');
const extensions = ['.tsx', '.ts'];
let totalFixed = 0;

function fixContent(content, filePath) {
  const original = content;

  // Fix arrow functions: "= >" → "=>"
  content = content.replace(/= >/g, '=>');
  content = content.replace(/\( \)=>/g, '() =>');

  // Fix logical AND: "& &" → "&&"
  content = content.replace(/& &/g, '&&');

  // Fix JSX closing tags: "/ >" → "/>"
  content = content.replace(/\/ >/g, '/>');

  // Fix boolean typos
  content = content.replace(/\bt rue\b/g, 'true');
  content = content.replace(/\btru e\b/g, 'true');
  content = content.replace(/\bfa lse\b/g, 'false');

  // Fix broken class names
  content = content.replace(/p ortrait/g, 'portrait');
  content = content.replace(/bord er-/g, 'border-');
  content = content.replace(/hover: scale-/g, 'hover:scale-');
  content = content.replace(/hover:bg-/g, 'hover:bg-');
  content = content.replace(/text-slate -/g, 'text-slate-');
  content = content.replace(/dark:text-slate -/g, 'dark:text-slate-');
  content = content.replace(/dark:bg-slate -/g, 'dark:bg-slate-');
  content = content.replace(/dark:bord er-/g, 'dark:border-');
  content = content.replace(/border-slate-2 00/g, 'border-slate-200');
  content = content.replace(/justify-cen ter/g, 'justify-center');
  content = content.replace(/outline-no ne/g, 'outline-none');
  content = content.replace(/bg-sl ate-/g, 'bg-slate-');
  content = content.replace(/bg-ro se-/g, 'bg-rose-');
  content = content.replace(/bor der-emerald-/g, 'border-emerald-');
  content = content.replace(/h over:bg-/g, 'hover:bg-');
  content = content.replace(/t ransition-colors/g, 'transition-colors');
  content = content.replace(/flex fl ex-col/g, 'flex flex-col');
  content = content.replace(/fl ex-col/g, 'flex-col');
  content = content.replace(/rounded-lg t ext-sm/g, 'rounded-lg text-sm');
  content = content.replace(/font-bold t ext-sm/g, 'font-bold text-sm');
  content = content.replace(/px-4 py-2\.5 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2\.5 rounded-lg h over:bg-/g, 'px-4 py-2.5 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg hover:bg-');

  // Fix broken identifiers
  content = content.replace(/se lectedLog/g, 'selectedLog');
  content = content.replace(/searc hLower/g, 'searchLower');
  content = content.replace(/\bcs v\b/g, 'csv');
  content = content.replace(/toISOS tring/g, 'toISOString');
  content = content.replace(/onClic k:/g, 'onClick:');
  content = content.replace(/\(r, ct x\)/g, '(r, ctx)');
  content = content.replace(/write-vertical-rl/g, '[writing-mode:vertical-rl]');

  // Fix template literal escaping
  content = content.replace(/\\\$/g, '$');

  // Fix broken HTML in ExportButton
  content = content.replace(/dark:bord er-slate-600/g, 'dark:border-slate-600');
  content = content.replace(/rounded-lg text-sm focus:border-emerald-500 focus:outline-none/g, 'rounded-lg text-sm focus:border-emerald-500 focus:outline-none');

  // Fix index.css missing selectors
  if (filePath.endsWith('index.css')) {
    content = content.replace(
      /\n\s*\{\s*\n\s*box-shadow: none !important;\s*\n\s*text-shadow: none !important;\s*\n\s*\}/,
      '\n.dark * {\n  box-shadow: none !important;\n  text-shadow: none !important;\n}'
    );
    content = content.replace(
      /\n\s*\{\s*\n\s*transition: background-color 0\.3s ease, color 0\.3s ease, border-color 0\.3s ease;\s*\n\s*\}/,
      '\n* {\n  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;\n}'
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    totalFixed++;
    console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        fixContent(content, filePath);
      } catch (e) {
        console.error(`❌ Error processing ${filePath}:`, e.message);
      }
    }
  }
}

// Also fix root-level CSS
const cssPath = path.join(srcDir, 'index.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  fixContent(cssContent, cssPath);
}

walkDir(srcDir);
console.log(`\n🎉 Selesai! Total file diperbaiki: ${totalFixed}`);
