const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix useState missing closing parenthesis
  // If we see `return initial;  }` we change it to `return initial;  });`
  content = content.replace(/return initial;\s*\}/g, 'return initial;\n  });');

  // If we see `if (saved) return JSON.parse(saved);`, we remove it
  content = content.replace(/if\s*\(saved\)\s*return\s*JSON\.parse\(saved\);/g, '');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
