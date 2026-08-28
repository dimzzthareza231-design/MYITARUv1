const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.{ts,tsx}');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  // Match {/* something */ but without the } at the end
  content = content.replace(/\{\/\*([^*]+)\*\//g, '{/*$1*/}');
  // Deduplicate */} if it became */}}
  content = content.replace(/\*\/}\}/g, '*/}');
  fs.writeFileSync(file, content);
}
