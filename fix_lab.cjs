const fs = require('fs');
let c = fs.readFileSync('src/components/Laboratorium/CetakHasilModal.tsx', 'utf8');

const docStart = c.indexOf('<div \n            ref={printRef}');
const docEnd = c.indexOf('{/* LEGAL DISCLAIMER */}');

if (docStart !== -1 && docEnd !== -1) {
    let docContent = c.substring(docStart, docEnd);
    // remove the ref attribute
    docContent = docContent.replace(/ref=\{printRef\}/, '');
    
    // The previous agent already imported DocumentPreviewModal
    
    // We rewrite the component's return
    let newReturn = `
    const customContent = (
        <div className="bg-white text-slate-900 p-8 w-full max-w-4xl mx-auto space-y-6">
${docContent.substring(docContent.indexOf('>') + 1)}
            {/* LEGAL DISCLAIMER */}
            <div className="text-[9px] text-slate-400 text-center pt-2 border-t border-slate-100">
              Dokumen ini merupakan rekam medis elektronik resmi RS MYITARU SEHAT UTAMA yang dilindungi oleh undang-undang kerahasiaan medis.
            </div>
        </div>
    );

    return (
        <DocumentPreviewModal 
            isOpen={isOpen}
            onClose={onClose}
            customContent={customContent}
            title={\`Hasil_Lab_\${order.no_order || order.id}\`}
        />
    );
}
`;
    // Find where the old return starts
    const returnStart = c.indexOf('return (');
    c = c.substring(0, returnStart) + newReturn;
    fs.writeFileSync('src/components/Laboratorium/CetakHasilModal.tsx', c);
    console.log("CetakHasilModal fixed.");
} else {
    console.log("Could not find docStart or docEnd.");
}
