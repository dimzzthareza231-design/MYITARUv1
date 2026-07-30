import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!content.includes('import { FlaskConical }')) {
  content = content.replace(
    "import { UserPlus, XCircle, Bed } from 'lucide-react';",
    "import { UserPlus, XCircle, Bed, FlaskConical } from 'lucide-react';"
  );
  fs.writeFileSync('src/components/Sidebar.tsx', content);
}
