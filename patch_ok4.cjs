const fs = require('fs');
const file = 'src/components/KamarOperasi/PasienOperasiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

const marker = '{/* MODAL 4: CETAK RESMI FORMAT KLINIK */}';
const startIdx = content.indexOf(marker);

if (startIdx !== -1) {
    const rawModal = content.substring(startIdx);
    const kertasStart = rawModal.indexOf('{/* Kertas Cetak A4 */}');
    const kertasEnd = rawModal.indexOf('{/* Footer Cetak */}');
    
    if (kertasStart !== -1 && kertasEnd !== -1) {
        let innerHTML = rawModal.substring(kertasStart + '{/* Kertas Cetak A4 */}'.length, kertasEnd);
        innerHTML = innerHTML.replace(/<div className="p-8 overflow-y-auto space-y-6 text-sm font-serif">/, '');
        innerHTML = innerHTML.substring(0, innerHTML.lastIndexOf('</div>'));
        
        const newModal = `
      {/* MODAL 4: CETAK RESMI FORMAT KLINIK */}
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
    </div>
  );
}`;
        content = content.substring(0, startIdx) + newModal;
        fs.writeFileSync(file, content);
        console.log("Replaced using startIdx.");
    } else {
        console.log("Could not find inner kertas markers.");
    }
}
