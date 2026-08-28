const fs = require('fs');
let c = fs.readFileSync('src/components/Radiologi/LembarHasilPrint.tsx', 'utf8');

c = c.replace(/return \(\s*const customContent = \(/g, 'const customContent = (');
const splitIdx = c.indexOf('Lembar hasil ini merupakan rekaman medis elektronik sah Rumah Sakit MYITARU dan dapat diverifikasi secara daring.');

if (splitIdx !== -1) {
    let clean = c.substring(0, splitIdx + 115) + `
        </div>
      );

    return (
        <DocumentPreviewModal 
            isOpen={true}
            onClose={onClose}
            customContent={customContent}
            title={\`Hasil_Radiologi_\${item.no_order}\`}
        />
    );
}`;
    fs.writeFileSync('src/components/Radiologi/LembarHasilPrint.tsx', clean);
    console.log("Cleaned up LembarHasilPrint.");
} else {
    console.log("Could not find marker.");
}
