import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!content.includes("{ id: 'beds', label: 'Bed Management'")) {
  content = content.replace(
    "{ id: 'patients', label: 'Patients', icon: Users },",
    "{ id: 'patients', label: 'Patients', icon: Users },\n        { id: 'beds', label: 'Bed Management', icon: Bed },"
  );
  
  if (!content.includes('import { Bed }')) {
     content = content.replace(
       "import { UserPlus, XCircle } from 'lucide-react';",
       "import { UserPlus, XCircle, Bed } from 'lucide-react';"
     );
  }
  
  fs.writeFileSync('src/components/Sidebar.tsx', content);
}
