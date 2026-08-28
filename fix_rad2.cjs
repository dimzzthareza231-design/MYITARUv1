const fs = require('fs');
let c = fs.readFileSync('src/components/Radiologi/LembarHasilPrint.tsx', 'utf8');

c = c.replace(/return \(\s*const customContent = \(/, 'const customContent = (');
c = c.replace(/<button\s*onClick=\{handlePrint\}[\s\S]*?Cetak Dokumen\s*<\/button>/, '');
c = c.replace(/<button\s*onClick=\{onClose\}[\s\S]*?Tutup\s*<\/button>/, '');
// Just remove the print buttons from the customContent since DocumentPreviewModal has its own!
// Oh wait, `handlePrint` might be inside the JSX.

// I will just wipe out everything after `);` at line 191 and replace it with a clean return.
const marker = '        </div>\n        <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100 print:block">\n          Lembar hasil ini merupakan rekaman medis elektronik sah Rumah Sakit MYITARU dan dapat diverifikasi secara daring.\n        </div>\n      );';
const splitIdx = c.indexOf(marker);

if (splitIdx !== -1) {
    let clean = c.substring(0, splitIdx + marker.length) + `\n\n    return (
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
    console.log("Could not find marker in LembarHasilPrint.");
}
