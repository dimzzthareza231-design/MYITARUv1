const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

code = code.replace(
  /    \}\, \(error\) => \{\n      console\.warn\('Firestore users collection snapshot notice:', error\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}\, \[\]\);/g,
  "    }) : () => {};\n    return () => unsubscribe();\n  }, []);"
);

// Ah, wait. The original code has `}, (error) => { ... });`. So it's 3 arguments to onSnapshot or 2.
// Let's just do a simpler replace.
code = code.replace(/    \}\, \(error\) => \{\n      console\.warn\('Firestore users collection snapshot notice:', error\);\n    \}\);/g, "    }) : () => {};");

fs.writeFileSync('src/contexts/AuthContext.tsx', code);
