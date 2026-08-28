const fs = require('fs');
let c = fs.readFileSync('src/components/Radiologi/LembarHasilPrint.tsx', 'utf8');

c = c.replace('return (\n    const customContent = (', 'const customContent = (');
c = c.replace('return (\n    const customContent = (', 'const customContent = ('); // just in case

// We need to add the return statement after customContent.
// The previous agent likely left `);` at the end of the file.
const endIdx = c.lastIndexOf(');');
if (endIdx !== -1) {
    let newEnd = `    );

    return (
        <DocumentPreviewModal
            isOpen={true}
            onClose={onClose}
            customContent={customContent}
            title={\`Hasil_Radiologi_\${item.nomor_pemeriksaan}\`}
        />
    );
}`;
    // Find the very last `}`
    const lastBrace = c.lastIndexOf('}');
    c = c.substring(0, lastBrace - 2) + newEnd; 
    fs.writeFileSync('src/components/Radiologi/LembarHasilPrint.tsx', c);
    console.log("LembarHasilPrint fixed.");
}
