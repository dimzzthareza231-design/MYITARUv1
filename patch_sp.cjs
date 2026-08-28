const fs = require('fs');
const file = 'src/components/Pharmacy/DefectaProcurementTab.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('DocumentPreviewModal')) {
    content = content.replace(
        "import { useToast } from '../../contexts/ToastContext';",
        "import { useToast } from '../../contexts/ToastContext';\nimport { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';"
    );
}

if (!content.includes('showPreview')) {
    content = content.replace(
        "const [filterSupplier, setFilterSupplier] = useState('Semua');",
        "const [showPreview, setShowPreview] = useState(false);\n  const [filterSupplier, setFilterSupplier] = useState('Semua');"
    );
}

content = content.replace(
    /window\.print\(\);\s*toast\.success\('Surat Pesanan dikirim ke printer!'\);/,
    `setShowPreview(true);`
);

const marker = '{/* KOP SURAT PESANAN */}';
const startIdx = content.indexOf(marker);

if (startIdx !== -1) {
    const rawModal = content.substring(startIdx);
    // Find the enclosing div closing it. The Surat Pesanan seems to end right before `{/* MODAL ADD MANUAL PO */}` or similar. Let's see what is after the KOP SURAT PESANAN.
}
