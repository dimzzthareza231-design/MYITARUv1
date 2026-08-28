const fs = require('fs');
let c = fs.readFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', 'utf8');

// I need to extract the DocumentPreviewModal and move it to the end.
const startMarker = '{showPreview && selectedPO && (';
const endMarker = 'title={`SP_${selectedPO.no_po}`}\n                />\n              )}';

const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker) + endMarker.length;

if (startIdx !== -1 && endIdx !== -1) {
    const modalJSX = c.substring(startIdx, endIdx);
    
    // Remove it from its current position
    c = c.substring(0, startIdx) + c.substring(endIdx);
    
    // Put it at the very end before the last closing tags
    // Let's find `</div>\n      {/* 4. MODAL BUAT SURAT PESANAN */}`
    const targetIdx = c.indexOf('{/* 4. MODAL BUAT SURAT PESANAN */}');
    if (targetIdx !== -1) {
        c = c.substring(0, targetIdx) + modalJSX + '\n      ' + c.substring(targetIdx);
        fs.writeFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', c);
        console.log("DefectaProcurementTab fixed!");
    } else {
        console.log("Could not find targetIdx.");
    }
}
