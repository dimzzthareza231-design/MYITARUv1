const fs = require('fs');

// Fix AIFeatures.tsx
let ai = fs.readFileSync('src/components/RME/AIFeatures.tsx', 'utf8');
ai = ai.replace("toast.info('🎤 Mulai berbicara...', { duration: 3000 });", "toast('🎤 Mulai berbicara...', { duration: 3000, icon: 'ℹ️' });");
fs.writeFileSync('src/components/RME/AIFeatures.tsx', ai);

// Fix ModalAlergi.tsx
let modal = fs.readFileSync('src/components/RME/Modals/ModalAlergi.tsx', 'utf8');
modal = modal.replace("allergen,", "allergen: alergen,");
fs.writeFileSync('src/components/RME/Modals/ModalAlergi.tsx', modal);
