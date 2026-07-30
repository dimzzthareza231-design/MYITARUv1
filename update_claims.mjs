import fs from 'fs';
let content = fs.readFileSync('src/components/Claims.tsx', 'utf8');

// Add icons to import
content = content.replace(
  "import { Search, Plus, FileText, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';",
  "import { Search, Plus, FileText, CheckCircle2, Clock, XCircle, AlertTriangle, Printer } from 'lucide-react';"
);

// Add selectedClaim state
content = content.replace(
  "  const [searchQuery, setSearchQuery] = useState('');",
  "  const [searchQuery, setSearchQuery] = useState('');\n  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);"
);

// Add onClick to table row
content = content.replace(
  '<motion.tr \n                    initial={{ opacity: 0 }}\n                    animate={{ opacity: 1 }}\n                    exit={{ opacity: 0 }}\n                    key={claim.id} \n                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"\n                  >',
  '<motion.tr \n                    initial={{ opacity: 0 }}\n                    animate={{ opacity: 1 }}\n                    exit={{ opacity: 0 }}\n                    key={claim.id} \n                    onClick={() => setSelectedClaim(claim)}\n                    className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"\n                  >'
);

const modalCode = `
      <AnimatePresence>
      {selectedClaim && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel p-8 w-full max-w-2xl mx-4 border border-white/10 shadow-2xl relative"
          >
            <button onClick={() => setSelectedClaim(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <XCircle className="w-6 h-6" />
            </button>
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">INSURANCE CLAIM</h2>
                <div className="text-white/60 font-mono">{selectedClaim.id}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white">MYITARU Hospital</div>
                <div className="text-sm text-white/40">123 Health Avenue, Jakarta</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Patient Details</div>
                <div className="text-lg font-bold text-white">{selectedClaim.patientName}</div>
                <div className="text-sm text-white/60">Patient ID: {selectedClaim.patientId}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Claim Details</div>
                <div className="text-sm text-white">Provider: <span className="font-bold text-primary-blue">{selectedClaim.provider}</span></div>
                <div className="text-sm text-white">Date Submitted: <span className="font-mono">{selectedClaim.date}</span></div>
                <div className="text-sm text-white mt-2">
                  Status: 
                  <span className={cn(
                      "ml-2 px-2 py-1 rounded text-xs font-bold border",
                      selectedClaim.status === 'Approved' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      selectedClaim.status === 'Pending' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                    {selectedClaim.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 rounded-lg overflow-hidden mb-8">
              <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                <span className="text-sm font-bold text-white/60 uppercase tracking-wider">Claimed Amount</span>
                <span className="text-xl font-bold text-white font-mono">Rp {selectedClaim.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="p-4 bg-black/40">
                <div className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">Additional Notes</div>
                <p className="text-sm text-white/80">{selectedClaim.notes || 'No additional notes provided for this claim.'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => window.print()} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Printer className="w-4 h-4" /> Print Claim Record
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
`;

content = content.replace(
  "    </div>\n  );\n}",
  modalCode
);

fs.writeFileSync('src/components/Claims.tsx', content);
