const fs = require('fs');
const file = 'src/components/RME/Patient360.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\{activeTab === 'overview' && <OverviewTab patientData=\{patientData\} \/>\}/,
  "{activeTab === 'overview' && <OverviewTab patientData={patientData} />}\n            {activeTab === 'timeline' && <TimelineTab />}"
);

fs.writeFileSync(file, code);
