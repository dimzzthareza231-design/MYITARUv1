const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Find }, [vars] and add missing );
  content = content.replace(/\}, (\[[a-zA-Z0-9_,\s]*\])\s*\n/g, '}, $1);\n');
  content = content.replace(/\}, (\[[a-zA-Z0-9_,\s]*\])(?!\s*\);)/g, '}, $1);');
  
  // also deduplicate if we made it ););
  content = content.replace(/\);\);/g, ');');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
