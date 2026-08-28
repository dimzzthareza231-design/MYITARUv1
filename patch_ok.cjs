const fs = require('fs');
const file = 'src/components/KamarOperasi/PasienOperasiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

// Extract the print modal content
const modalRegex = /\{\/\* MODAL 4: CETAK RESMI FORMAT RUMAH SAKIT \*\/\}\s*\{\/\* ═══════════════════════════════════════════════════════════════════════════ \*\/\}\s*\{isPrintModalOpen && selectedPatient && \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/80 backdrop-blur-sm animate-in fade-in">\s*<div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-\[90vh\] flex flex-col shadow-2xl overflow-hidden">\s*\{\/\* Header Cetak \*\/\}\s*<div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">[\s\S]*?<\/div>\s*\{\/\* Kertas Cetak A4 \*\/\}\s*<div className="p-8 overflow-y-auto space-y-6 text-sm font-serif">([\s\S]*?)<\/div>\s*\{\/\* Footer Buttons \*\/\}\s*<div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}/;

const match = content.match(modalRegex);
if (match) {
    const innerHTML = match[1];
    const newModal = `
      {/* MODAL 4: CETAK RESMI FORMAT RUMAH SAKIT */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isPrintModalOpen && selectedPatient && (
        <DocumentPreviewModal 
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            customContent={(
                <div className="bg-white text-slate-900 w-full p-8 space-y-6 text-sm font-serif max-w-4xl mx-auto">
                    ${innerHTML}
                </div>
            )}
            title={\`Formulir_Operasi_\${selectedPatient.nomor}\`}
        />
      )}
    `;
    
    content = content.replace(modalRegex, newModal);
    fs.writeFileSync(file, content);
    console.log("PasienOperasiTab patched successfully.");
} else {
    console.log("Regex match failed for PasienOperasiTab.");
}
