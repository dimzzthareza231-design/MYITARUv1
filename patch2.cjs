const fs = require('fs');
const file = 'src/components/PrintPDFButton.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /interface PrintPDFButtonProps \{[\s\S]*?\}/,
  `interface PrintPDFButtonProps {
  targetId?: string;
  filename?: string;
  label?: string;
  className?: string;
  documentData?: any;
  docType?: any;
  title?: string;
  iconOnly?: boolean;
  customContent?: React.ReactNode;
}`
);

content = content.replace(
  /export default function PrintPDFButton\(\{[\s\S]*?\}\: PrintPDFButtonProps\) \{/,
  `export default function PrintPDFButton({
  targetId,
  filename = 'dokumen',
  label = 'Print PDF',
  className = '',
  documentData,
  docType = 'resume_medis',
  title,
  iconOnly = false,
  customContent
}: PrintPDFButtonProps) {`
);

content = content.replace(
  /<DocumentPreviewModal[\s\S]*?\/>/,
  `<DocumentPreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        document={getDocumentModel()}
        customContent={customContent}
        title={title || label}
      />`
);

fs.writeFileSync(file, content);
