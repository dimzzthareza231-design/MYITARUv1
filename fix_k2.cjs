const fs = require('fs');
let c = fs.readFileSync('src/components/Finance/KwitansiTab.tsx', 'utf8');

c = c.replace(/          \}\)\s*          <\/div>\s*          <\/>\s*          \) : \(/, 
`          </>\n          ) : (`);

// Wait, the error is at 425:
//   424	          )}
//   425	          </div>
//   426	          </>
//   427	          ) : (

c = c.replace(/          \)\}\n          <\/div>\n          <\/>\n          \) : \(/g, `          )}\n          </>\n          ) : (`);

fs.writeFileSync('src/components/Finance/KwitansiTab.tsx', c);
console.log("Fixed KwitansiTab syntax 2.");
