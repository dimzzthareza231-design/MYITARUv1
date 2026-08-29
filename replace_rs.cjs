const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.html', '.md', '.json', '.js', '.cjs'].includes(ext)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(process.cwd());

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/Klinik/g, 'Klinik');
  content = content.replace(/klinik/g, 'klinik');
  content = content.replace(/KLINIK/g, 'KLINIK');
  content = content.replace(/Klinik/g, 'Klinik');
  
  // also consider SIMRS -> SIM Klinik? The user didn't ask for that explicitly. They just asked "klinik menjadi klinik"
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
