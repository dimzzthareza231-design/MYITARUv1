const fs = require('fs');
const file = 'src/components/Finance/KwitansiTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

if (!content.includes('showPreview')) {
    content = content.replace(
        "const [searchTerm, setSearchTerm] = useState('');",
        "const [showPreview, setShowPreview] = useState(false);\n  const [searchTerm, setSearchTerm] = useState('');"
    );
}

content = content.replace(
    /const handlePrint = \(\) => \{\s*window\.print\(\);\s*toast\.success\('Membuka dialog cetak kwitansi\.\.\.'\);\s*\};/,
    `const handlePrint = () => {\n    setShowPreview(true);\n  };`
);

// We need to extract the exact block from `<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 relative shadow-sm print:shadow-none print:border-none printable-area">`
// to the end of the `Signatures and QR Code` div.
const extractRegex = /<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-8 relative shadow-sm print:shadow-none print:border-none printable-area">([\s\S]*?\{\/\* Signatures and QR Code \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/;
const match = content.match(extractRegex);

if (match) {
    const fullInner = match[1];
    const newJSX = `
      <DocumentPreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        customContent={(
          <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm max-w-4xl mx-auto">
            ${fullInner}
          </div>
        )}
        title={\`Kwitansi_\${selectedBilling?.noKwitansi || selectedBilling?.noBilling}\`}
      />
    </div>
  );
}`;

    // replace the ending of the component
    content = content.replace(/<\/div>\s*\)\s*:\s*\(\s*<div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, 
    `</div>\n          ) : (\n            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">\n              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />\n              <h4 className="font-bold text-slate-700 dark:text-slate-300">Pilih Kwitansi</h4>\n              <p className="text-xs text-slate-400 mt-1">Pilih dari daftar transaksi di sebelah kiri untuk melihat kwitansi resmi.</p>\n            </div>\n          )}\n        </div>\n      </div>\n${newJSX}`);
    fs.writeFileSync(file, content);
    console.log("Kwitansi matched and patched.");
} else {
    console.log("Failed to match kwitansi content.");
}
