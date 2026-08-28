const fs = require('fs');
const file = 'src/components/Documents/DocumentPreviewModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Interface
content = content.replace(
  /interface DocumentPreviewModalProps \{[\s\S]*?\}/,
  `interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: HospitalDocumentModel;
  customContent?: React.ReactNode;
  title?: string;
  onUpdateDocument?: (updated: HospitalDocumentModel) => void;
}`
);

// Replace component signature
content = content.replace(
  /export function DocumentPreviewModal\(\{[\s\S]*?\}: DocumentPreviewModalProps\) \{/,
  `export function DocumentPreviewModal({
  isOpen,
  onClose,
  document: initialDoc,
  customContent,
  title,
  onUpdateDocument
}: DocumentPreviewModalProps) {`
);

// Update states
content = content.replace(
  /const \[doc, setDoc\] = useState<HospitalDocumentModel>\(initialDoc\);/,
  `const [doc, setDoc] = useState<HospitalDocumentModel | undefined>(initialDoc);`
);

content = content.replace(
  /const \[tempNotes, setTempNotes\] = useState<string>\(initialDoc\.edukasiInstruksi \|\| ''\);/,
  `const [tempNotes, setTempNotes] = useState<string>(initialDoc?.edukasiInstruksi || '');`
);

content = content.replace(
  /setTempNotes\(initialDoc\.edukasiInstruksi \|\| ''\);/,
  `setTempNotes(initialDoc?.edukasiInstruksi || '');`
);

// Update pdf generation
content = content.replace(
  /const safeFilename = `\$\{doc\.judulDokumen[\s\S]*?\}\.pdf`;/,
  `const safeFilename = doc ? \`\$\{doc.judulDokumen.replace(/[^a-zA-Z0-9]/g, '_')\}_\$\{doc.subject.no_rm || doc.subject.nip || 'DOC'\}_\$\{doc.subject.nama.replace(/[^a-zA-Z0-9]/g, '_')\}.pdf\` : \`\$\{title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Dokumen_RS'\}_\$\{new Date().getTime()\}.pdf\`;`
);

// Update handleCopyText
content = content.replace(
  /const handleCopyText = \(\) => \{/,
  `const handleCopyText = () => {\n    if (!doc) {\n      toast.error('Tidak ada teks medis terstruktur untuk disalin.');\n      return;\n    }`
);

// Update rendering of Document
content = content.replace(
  /<HospitalDocumentSheet document=\{doc\} watermark=\{showWatermark\} \/>/,
  `{customContent ? (
              <div className="printable-hospital-doc bg-white shadow-sm" style={{ width: '210mm', minHeight: '297mm', padding: '10mm', boxSizing: 'border-box' }}>
                {customContent}
              </div>
            ) : doc ? (
              <HospitalDocumentSheet document={doc} watermark={showWatermark} />
            ) : (
              <div className="printable-hospital-doc bg-white flex items-center justify-center text-slate-500" style={{ width: '210mm', minHeight: '297mm', padding: '10mm' }}>Tidak ada dokumen.</div>
            )}`
);

// Safely access doc in UI
content = content.replace(
  /<h2 className="text-lg font-black text-slate-900 truncate">\{doc\.judulDokumen\}<\/h2>/,
  `<h2 className="text-lg font-black text-slate-900 truncate">{doc?.judulDokumen || title || 'Pratinjau Dokumen'}</h2>`
);
content = content.replace(
  /<p className="text-xs font-semibold text-slate-500 truncate">\{doc\.subject\.nama\} • \{doc\.subject\.no_rm \|\| doc\.subject\.nip\}<\/p>/,
  `{doc ? <p className="text-xs font-semibold text-slate-500 truncate">{doc.subject.nama} • {doc.subject.no_rm || doc.subject.nip}</p> : <p className="text-xs font-semibold text-slate-500 truncate">{title}</p>}`
);
content = content.replace(
  /value=\{doc\.edukasiInstruksi \|\| ''\}/,
  `value={doc?.edukasiInstruksi || ''}`
);
content = content.replace(
  /if \(!doc\.edukasiInstruksi && !doc\.rencanaKontrol\) return null;/,
  `if (!doc || (!doc.edukasiInstruksi && !doc.rencanaKontrol)) return null;`
);

fs.writeFileSync(file, content);
