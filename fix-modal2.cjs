const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalRecords.tsx', 'utf8');

const replacementStr = `
      {isModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <Patient360 
            patient={activePatient} 
            onBack={() => setIsModalOpen(false)} 
          />
        </div>
      )}
    </div>
  );
}
`;

code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*\);\s*}\s*$/, `        </div>\n      </div>\n${replacementStr}`);

fs.writeFileSync('src/components/MedicalRecords.tsx', code);
