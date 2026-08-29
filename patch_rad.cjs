const fs = require('fs');
const file = 'src/components/Radiologi/LembarHasilPrint.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { RadiologiItem } from './types';",
        "import { RadiologiItem } from './types';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
    let afterReturn = content.substring(returnIndex);
    
    afterReturn = afterReturn.replace(
        /<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950\/80 backdrop-blur-sm flex items-center justify-center p-4">\s*<div className="bg-white text-slate-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 text-left relative print:p-0 print:shadow-none print:max-w-full">\s*\{\/\* Floating Action Buttons \(Hidden when printing\) \*\/\}\s*<div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">[\s\S]*?<\/div>/,
        `const customContent = (\n      <div className="bg-white text-slate-900 w-full p-8 space-y-6 text-left relative">\n        {/* HEADER Klinik */}`
    );
    
    afterReturn = afterReturn.replace(/<\/div>\s*<\/div>\s*\);\s*\}/, `);\n\n    return (\n        <DocumentPreviewModal \n            isOpen={true}\n            onClose={onClose}\n            customContent={customContent}\n            title={\`Hasil_Radiologi_\${item.no_order}\`}\n        />\n    );\n}`);
    
    content = content.substring(0, returnIndex) + afterReturn;
    fs.writeFileSync(file, content);
}
