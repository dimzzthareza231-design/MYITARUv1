const fs = require('fs');
const file = 'src/components/KamarOperasi/PasienOperasiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

const marker = '{/* MODAL 4: CETAK RESMI FORMAT RUMAH SAKIT */}';
const startIdx = content.indexOf(marker);
const endIdx = content.lastIndexOf('</div>\n    </div>\n  );\n}\n');

if (startIdx !== -1 && endIdx !== -1) {
    const rawModal = content.substring(startIdx, endIdx);
    const kertasStart = rawModal.indexOf('{/* Kertas Cetak A4 */}');
    const kertasEnd = rawModal.indexOf('{/* Footer Buttons */}');
    
    if (kertasStart !== -1 && kertasEnd !== -1) {
        let innerHTML = rawModal.substring(kertasStart + '{/* Kertas Cetak A4 */}'.length, kertasEnd);
        // Clean up the `<div className="p-8 overflow-y-auto space-y-6 text-sm font-serif">` tag
        innerHTML = innerHTML.replace(/<div className="p-8 overflow-y-auto space-y-6 text-sm font-serif">/, '');
        // Remove the closing div of this block
        innerHTML = innerHTML.substring(0, innerHTML.lastIndexOf('</div>'));
        
        const newModal = `
      {/* MODAL 4: CETAK RESMI FORMAT RUMAH SAKIT */}
      {isPrintModalOpen && selectedPatient && (
        <DocumentPreviewModal 
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            customContent={(
                <div className="bg-white text-slate-900 w-full p-8 space-y-6 text-sm font-serif max-w-4xl mx-auto border border-slate-200">
                    ${innerHTML}
                </div>
            )}
            title={\`Formulir_Operasi_\${selectedPatient.nomor}\`}
        />
      )}
`;
        content = content.substring(0, startIdx) + newModal + content.substring(endIdx);
        fs.writeFileSync(file, content);
        console.log("Replaced using indices.");
    } else {
        console.log("Could not find inner kertas markers.");
    }
} else {
    console.log("Could not find start/end markers.");
}
