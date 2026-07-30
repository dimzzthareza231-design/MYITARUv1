import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!content.includes("{ id: 'forms', label: 'Forms & Workflows'")) {
  content = content.replace(
    "{ id: 'records', label: 'Records', icon: FileText },",
    "{ id: 'records', label: 'Records', icon: FileText },\n        { id: 'forms', label: 'Forms & Workflows', icon: FileText },"
  );
  fs.writeFileSync('src/components/Sidebar.tsx', content);
}
