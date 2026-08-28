const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalRecords.tsx', 'utf8');

const targetStr = `        </div>
      </div>
      
    </div>
  );
}`;

const targetStr2 = `        </div>
      </div>
          
    </div>
  );
}`;

const replacementStr = `        </div>
      </div>
      
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
}`;

code = code.replace(targetStr, replacementStr);
code = code.replace(targetStr2, replacementStr);

fs.writeFileSync('src/components/MedicalRecords.tsx', code);
console.log('replaced');
