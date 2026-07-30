import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const formsReplacement = `          {currentView === 'forms-doctor' && <FormsModule />}
          {currentView === 'forms-nurse' && <FormsModule />}
          {currentView === 'forms-medical-record' && <FormsModule />}`;

content = content.replace("{currentView === 'forms' && <FormsModule />}", formsReplacement);
content = content.replace("import { FormsModule } from './components/FormsModule';", "import { FormsModule } from './components/FormsModule';\nimport { Pharmacy } from './components/Pharmacy';");
content = content.replace("{currentView === 'beds' && <BedManagement />}", "{currentView === 'beds' && <BedManagement />}\n          {currentView === 'pharmacy' && <Pharmacy />}");

fs.writeFileSync('src/App.tsx', content);
