import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { BedManagement }')) {
  content = content.replace(
    "import { FormsModule } from './components/FormsModule';",
    "import { FormsModule } from './components/FormsModule';\nimport { BedManagement } from './components/BedManagement';"
  );
  
  content = content.replace(
    "          {currentView === 'forms' && <FormsModule />}",
    "          {currentView === 'forms' && <FormsModule />}\n          {currentView === 'beds' && <BedManagement />}"
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
