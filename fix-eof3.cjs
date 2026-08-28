const fs = require('fs');
const errors = fs.readFileSync('lint2.txt', 'utf8').split('\n');
const toAppend = new Set();
for (const line of errors) {
  if (line.includes("error TS1005: '}' expected.")) {
    const match = line.match(/^(src\/[^:]+\.tsx?)/);
    if (match) toAppend.add(match[1]);
  }
}
for (const file of toAppend) {
  fs.appendFileSync(file, '\n}\n');
  console.log('Appended } to', file);
}
