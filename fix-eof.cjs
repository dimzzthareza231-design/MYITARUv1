const fs = require('fs');
const errors = fs.readFileSync('lint_errors.txt', 'utf8').split('\n');
const toAppend = new Set();
for (const line of errors) {
  if (line.includes("error TS1005: '}' expected.")) {
    const file = line.match(/(src\/[^:]+)/)[1];
    toAppend.add(file);
  }
}
for (const file of toAppend) {
  fs.appendFileSync(file, '\n}\n');
  console.log('Appended } to', file);
}
