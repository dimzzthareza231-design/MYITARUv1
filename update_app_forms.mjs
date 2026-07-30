import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { FormsModule }')) {
  content = content.replace(
    "import { Settings } from './components/Settings';",
    "import { Settings } from './components/Settings';\nimport { FormsModule } from './components/FormsModule';"
  );
  
  content = content.replace(
    "          {currentView === 'claims' && <Claims />}",
    "          {currentView === 'claims' && <Claims />}\n          {currentView === 'forms' && <FormsModule />}"
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
