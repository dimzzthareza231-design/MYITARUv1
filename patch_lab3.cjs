const fs = require('fs');
const file = 'src/components/Laboratorium/CetakHasilModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
    let afterReturn = content.substring(returnIndex);
    
    // Instead of parsing, we can just replace the outer modal divs with DocumentPreviewModal
    afterReturn = afterReturn.replace(
        /<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900\/70 backdrop-blur-sm p-4 overflow-y-auto">\s*<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-\[92vh\] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">\s*\{\/\* MODAL HEADER \*\/\}\s*<div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800\/80">[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*\{\/\* PRINTABLE CONTENT \*\/\}/,
        `const customContent = (`
    );
    
    afterReturn = afterReturn.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, `);\n\n    return (\n        <DocumentPreviewModal \n            isOpen={isOpen}\n            onClose={onClose}\n            customContent={customContent}\n            title={\`Hasil_Lab_\${order.no_order || order.id}\`}\n        />\n    );\n}`);
    
    content = content.substring(0, returnIndex) + afterReturn;
    fs.writeFileSync(file, content);
}
