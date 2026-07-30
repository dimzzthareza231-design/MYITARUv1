import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports
if (!content.includes('ChevronDown')) {
  content = content.replace(
    "import { Wifi, WifiOff, RefreshCw } from 'lucide-react';",
    "import { Wifi, WifiOff, RefreshCw, ChevronDown } from 'lucide-react';\nimport { motion, AnimatePresence } from 'motion/react';"
  );
}

// Add state and context
if (!content.includes('showUserMenu')) {
  content = content.replace(
    "const { activeDoctor } = useHospital();",
    "const { activeUser, users, setActiveUser } = useHospital();\n  const [showUserMenu, setShowUserMenu] = useState(false);"
  );
  // Also check if activeDoctor is still there just in case it wasn't replaced but just omitted.
  // Actually, I just replaced activeDoctor inside the JSX, but the hook destructuring was still `const { activeDoctor } = useHospital();`
}

fs.writeFileSync('src/App.tsx', content);
