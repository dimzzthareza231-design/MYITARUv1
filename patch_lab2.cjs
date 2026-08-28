const fs = require('fs');
const file = 'src/components/Laboratorium/CetakHasilModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const returnIndex = content.indexOf('return (');
if (returnIndex !== -1) {
    const beforeReturn = content.substring(0, returnIndex);
    const afterReturn = content.substring(returnIndex);
    
    // Find the `<div ref={printRef} className="p-8 print:p-0 bg-white text-black printable-area">` part
    const printAreaMatch = afterReturn.match(/<div ref=\{printRef\} className="p-8 print:p-0 bg-white text-black printable-area">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/);
    
    if (printAreaMatch) {
        const innerContent = printAreaMatch[1];
        const newReturn = `
    const customContent = (
      <div ref={printRef} className="p-8 bg-white text-black">
        ${innerContent}
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
        content = beforeReturn + newReturn;
        fs.writeFileSync(file, content);
        console.log("Successfully replaced");
    } else {
        console.log("Regex match failed");
    }
}
