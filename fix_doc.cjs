const fs = require('fs');
let c = fs.readFileSync('src/components/Documents/DocumentPreviewModal.tsx', 'utf8');

c = c.replace(
    /setDoc\(updated\);/,
    "setDoc(updated as HospitalDocumentModel);"
);

c = c.replace(
    /if \(onUpdateDocument\) onUpdateDocument\(updated\);/,
    "if (onUpdateDocument) onUpdateDocument(updated as HospitalDocumentModel);"
);

c = c.replace(
    /value=\{doc\.edukasiInstruksi \|\| ''\}/,
    "value={doc?.edukasiInstruksi || ''}"
);
c = c.replace(
    /if \(!doc\.edukasiInstruksi\) return null;/,
    "if (!doc?.edukasiInstruksi) return null;"
);
c = c.replace(
    /className="text-sm font-medium text-slate-800 whitespace-pre-wrap">\{doc\.edukasiInstruksi\}/,
    "className=\"text-sm font-medium text-slate-800 whitespace-pre-wrap\">{doc?.edukasiInstruksi}"
);


fs.writeFileSync('src/components/Documents/DocumentPreviewModal.tsx', c);
console.log("Fixed DocumentPreviewModal");
