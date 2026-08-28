const fs = require('fs');

const errors = fs.readFileSync('lint_errors.txt', 'utf8').split('\n');

const fileLines = {};

for (const line of errors) {
  const match = line.match(/(src\/[^:]+)\((\d+),\d+\): error (TS1128|TS1005|TS1472|TS1381|TS1382)/);
  if (match) {
    const file = match[1];
    const lineNum = parseInt(match[2], 10) - 1; // zero-indexed
    
    if (!fileLines[file]) {
      fileLines[file] = fs.readFileSync(file, 'utf8').split('\n');
    }
    
    const code = fileLines[file][lineNum];
    if (code !== undefined) {
       // Replace rogue `);` or `)` or `}` that shouldn't be there.
       if (code.trim() === ');' || code.trim() === '); }' || code.trim() === ')' || code.trim() === '}' || code.trim() === '};' || code.trim() === ']' || code.trim() === '];') {
           fileLines[file][lineNum] = ''; // blank it out
       }
       else if (code.includes(');')) {
           // sometimes it's like `      );`
           fileLines[file][lineNum] = code.replace(/\);\s*$/, '');
       }
    }
  }
}

for (const [file, lines] of Object.entries(fileLines)) {
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Fixed', file);
}
