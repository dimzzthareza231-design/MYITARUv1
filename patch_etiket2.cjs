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

const marker = '{/* PREVIEW CONTAINER */}';
const endMarker = '{/* FOOTER ACTIONS */}';
const startIdx = content.indexOf(marker);
const endIdx = content.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
    const previewContainer = content.substring(startIdx + marker.length, endIdx);
    const innerHTML = previewContainer.substring(
        previewContainer.indexOf('>') + 1,
        previewContainer.lastIndexOf('</div>')
    );
    
    const documentModal = `
      {showPreview && (
        <DocumentPreviewModal 
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            customContent={(
                <div className="flex items-center justify-center w-full p-8 bg-white text-slate-900 border border-slate-200 shadow-sm mx-auto min-h-[500px]">
                    ${innerHTML}
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
    console.log("Etiket patched.");
} else {
    console.log("Could not find markers.");
}
