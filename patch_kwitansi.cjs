const fs = require('fs');
const file = 'src/components/Finance/KwitansiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

// Add state
if (!content.includes('showPreview')) {
    content = content.replace(
        "const [searchTerm, setSearchTerm] = useState('');",
        "const [showPreview, setShowPreview] = useState(false);\n  const [searchTerm, setSearchTerm] = useState('');"
    );
}

// Update handlePrint
content = content.replace(
    /const handlePrint = \(\) => \{\s*window\.print\(\);\s*toast\.success\('Membuka dialog cetak kwitansi\.\.\.'\);\s*\};/,
    `const handlePrint = () => {
    setShowPreview(true);
  };`
);

// We need to extract the Kwitansi container and render it inside the modal
const printAreaRegex = /<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 relative shadow-sm print:shadow-none print:border-none printable-area">([\s\S]*?)<\/div>\s*\{\/\* FOOTER ACTIONS \*\/\}/;
const match = content.match(printAreaRegex);
if (match) {
    const inner = match[1];
    
    // Add DocumentPreviewModal to the very end before last </div>
    const modalJSX = `
      <DocumentPreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        customContent={(
          <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm">
            ${inner}
          </div>
        )}
        title={\`Kwitansi_\${selectedBilling?.noKwitansi || selectedBilling?.noBilling}\`}
      />
    </div>
  );
}`;
    
    content = content.replace(/<\/div>\s*\);\s*\}\s*$/, modalJSX);
    fs.writeFileSync(file, content);
    console.log("Kwitansi patched!");
} else {
    console.log("Regex match failed for Kwitansi area");
}
