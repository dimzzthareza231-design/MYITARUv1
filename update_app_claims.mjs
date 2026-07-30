import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { Analytics } from './components/Analytics';",
  "import { Analytics } from './components/Analytics';\nimport { Claims } from './components/Claims';"
);

content = content.replace(
  "{currentView === 'analytics' && <Analytics />}",
  "{currentView === 'analytics' && <Analytics />}\n          {currentView === 'claims' && <Claims />}"
);

content = content.replace(
  "{['claims', 'security'].includes(currentView) && (",
  "{['security'].includes(currentView) && ("
);

fs.writeFileSync('src/App.tsx', content);
