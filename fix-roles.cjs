const fs = require('fs');
let content = fs.readFileSync('src/data/roles.ts', 'utf8');
content = content.replace(/export const saveCustomPermissions = \(permissions: Record<string, string\[\]>\) => \{[\s\S]*?};/g, 'export const saveCustomPermissions = (permissions: Record<string, string[]>) => {};');
content = content.replace(/export const getCustomPermissions = \(\): Record<string, string\[\]> => \{[\s\S]*?return \{\};\s*\};/g, 'export const getCustomPermissions = (): Record<string, string[]> => ({});');
fs.writeFileSync('src/data/roles.ts', content);
