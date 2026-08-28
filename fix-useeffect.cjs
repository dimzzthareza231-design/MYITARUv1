const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix mangled useEffects
  content = content.replace(/useEffect\(\(\) => \{\s*\);\s*\}, \[[^\]]*\]\)?/g, '');
  content = content.replace(/useEffect\(\(\) => \{\s*\}, \[[^\]]*\]\)/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed useEffect in', file);
  }
}
