const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;

      // Find useState(() => { ... localStorage ... }) and replace with useState([]) or standard value.
      content = content.replace(/useState(?:<[^>]+>)?\(\(\) => \{\s*(?:const|let|var)\s+\w+\s*=\s*localStorage\.getItem\([^)]+\);\s*return\s+\w+\s*\?\s*JSON\.parse\(\w+\)\s*:\s*(\[[^\]]*\]|\{[^}]*\}|'[^']*'|[^;]+);\s*\}\)/g, 'useState<any[]>($1)');
      
      content = content.replace(/useState(?:<[^>]+>)?\(\(\) => \{\s*return\s+JSON\.parse\(localStorage\.getItem\([^)]+\)\s*\|\|\s*('\[\]'|'\{\}')\);\s*\}\)/g, 'useState<any[]>([])');
      
      // Update any remaining multi-line useEffects writing to localStorage
      content = content.replace(/useEffect\(\(\) => \{\s*try\s*\{\s*localStorage\.setItem\([^)]+\);\s*\}\s*catch\s*\([^)]*\)\s*\{\s*console\.\w+\([^)]+\);\s*\}\s*\}, \[[^\]]*\]\);/g, '');

      // Wipe any lingering localStorage or sessionStorage lines
      content = content.replace(/.*localStorage\..*\n/g, '');
      content = content.replace(/.*sessionStorage\..*\n/g, '');

      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Cleaned multi-line:", fullPath);
      }
    }
  }
}

processDir('./src');
