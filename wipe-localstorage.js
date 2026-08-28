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

      // Wipe exact useEffects doing localStorage.setItem
      content = content.replace(/useEffect\(\(\) => \{\s*localStorage\.setItem\([^)]+\);\s*\}, \[[^\]]*\]\);/g, '');
      content = content.replace(/useEffect\(\(\) => \{\s*if\([^)]+\)\s*\{\s*localStorage\.setItem\([^)]+\);\s*\}\s*\}, \[[^\]]*\]\);/g, '');
      
      // Wipe inline localStorage.setItem
      content = content.replace(/localStorage\.setItem\([^)]+\);?/g, '');
      content = content.replace(/localStorage\.removeItem\([^)]+\);?/g, '');
      
      // Wipe localStorage.getItem from useState
      content = content.replace(/useState(?:<any\[\]>)?\(\(\) => JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| '\[\]'\)\)/g, 'useState<any[]>([])');
      content = content.replace(/useState(?:<any\[\]>)?\(\(\) => JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| JSON\.stringify\(([^)]+)\)\)\)/g, 'useState<any[]>($1)');
      
      // Other usages of getItem
      content = content.replace(/const\s+\w+\s*=\s*localStorage\.getItem\([^)]+\);/g, '');
      content = content.replace(/JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| '\[\]'\)/g, '[]');
      content = content.replace(/localStorage\.getItem\([^)]+\)/g, 'null');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Cleaned:", fullPath);
      }
    }
  }
}

processDir('./src');
