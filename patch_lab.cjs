const fs = require('fs');
const file = 'src/components/Laboratorium/CetakHasilModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

// Modify return statement to wrap everything in customContent
content = content.replace(
    /return \([\s\S]*?(<div className="fixed inset-0[\s\S]*?)<div ref=\{printRef\} className="p-8 print:p-0 bg-white text-black printable-area">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/,
    `
    const customContent = (
      <div ref={printRef} className="p-8 print:p-0 bg-white text-black printable-area max-w-4xl mx-auto border border-slate-200">
        $2
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
`
);

fs.writeFileSync(file, content);
