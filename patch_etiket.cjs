const fs = require('fs');
const file = 'src/components/Pharmacy/EtiketPrintModal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

if (!content.includes('showPreview')) {
    content = content.replace(
        "const [activeEtiketTab, setActiveEtiketTab] = useState",
        "const [showPreview, setShowPreview] = useState(false);\n  const [activeEtiketTab, setActiveEtiketTab] = useState"
    );
}

content = content.replace(
    /const handlePrint = \(\) => \{\s*toast\.success\('Membuka dialog cetak etiket obat\.\.\.'\);\s*window\.print\(\);\s*\};/,
    `const handlePrint = () => {
    setShowPreview(true);
  };`
);

const renderJSXRegex = /<div className="flex-1 overflow-y-auto p-6 bg-slate-200 dark:bg-slate-900\/50 flex items-center justify-center print-container">([\s\S]*?)<\/div>\s*\{\/\* FOOTER ACTIONS \*\/\}/;
const match = content.match(renderJSXRegex);

if (match) {
    const etiketBlock = match[1];
    const documentModal = `
      {showPreview && (
        <DocumentPreviewModal 
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            customContent={(
                <div className="flex items-center justify-center w-full h-full p-8 bg-white text-slate-900 border border-slate-200">
                    ${etiketBlock}
                </div>
            )}
            title={\`Etiket_\${order.no_resep}\`}
        />
      )}
    </div>
  );
}`;
    content = content.replace(/<\/div>\s*\)\s*;\s*\}\s*$/, documentModal);
    fs.writeFileSync(file, content);
    console.log("EtiketPrintModal patched successfully.");
} else {
    console.log("Regex match failed for EtiketPrintModal.");
}
