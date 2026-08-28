const fs = require('fs');
let c = fs.readFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', 'utf8');

c = c.replace(
    "const [showCreateSPModal, setShowCreateSPModal] = useState(false);",
    "const [showCreateSPModal, setShowCreateSPModal] = useState(false);\n  const [showPreview, setShowPreview] = useState(false);"
);
c = c.replace(
    /setShowPreview\(true\);/g,
    "setShowPreview(true);"
);

fs.writeFileSync('src/components/Pharmacy/DefectaProcurementTab.tsx', c);
console.log("Fixed showPreview");
