const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace useState(() => JSON.parse(localStorage.getItem('...') || '[]'))
  // with useState([])
  content = content.replace(/useState(?:<any\[\]>)?\(\(\) => JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| '\[\]'\)\)/g, 'useState<any[]>([])');
  
  // Replace useState(() => JSON.parse(localStorage.getItem('...') || JSON.stringify([...])))
  // with useState([...])
  content = content.replace(/useState(?:<any\[\]>)?\(\(\) => JSON\.parse\(localStorage\.getItem\([^)]+\) \|\| JSON\.stringify\(([^)]+)\)\)\)/g, 'useState<any[]>($1)');
  
  // Replace useEffect(() => { localStorage.setItem(...) }, [...])
  content = content.replace(/useEffect\(\(\) => \{\s*localStorage\.setItem\([^,]+,\s*JSON\.stringify\([^)]+\)\);\s*\}, \[.*?\]\);?/g, '');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
