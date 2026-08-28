const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.{ts,tsx}');
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('export default') && !content.match(/\}\s*export default/)) {
    // wait, this could be tricky, some files might just be fine.
  }
}
