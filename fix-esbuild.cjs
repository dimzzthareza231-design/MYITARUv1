const { execSync } = require('child_process');
const fs = require('fs');

let success = false;
for (let i = 0; i < 20; i++) {
  try {
    execSync('npm run build', { stdio: 'pipe' });
    success = true;
    break;
  } catch (err) {
    const output = err.stdout.toString() + err.stderr.toString();
    const match = output.match(/Transform failed with 1 error:\n([^\:]+)/);
    if (match) {
      const file = match[1].replace('/app/applet/', '');
      console.log('Fixing', file);
      fs.appendFileSync(file, '\n}\n');
    } else {
      console.log('Unknown error', output);
      break;
    }
  }
}
if (success) console.log('Successfully built!');
