import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-white">{activeDoctor?.name || 'Dr. Unknown'}</div>
              <div className="text-[10px] text-white/40 uppercase">{activeDoctor?.department || 'General'}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">{activeDoctor?.initials || 'DR'}</span>
            </div>
          </div>`;

const headerRightSide = `          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
            >
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-white">{activeUser?.name || 'Unknown User'}</div>
                <div className="text-[10px] text-white/40 uppercase">{activeUser?.role || 'Staff'} • {activeUser?.department || 'General'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">{activeUser?.initials || '??'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/40 hidden md:block" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/5 bg-white/5">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Change Shift / User</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {users.map((u) => (
                      <button 
                        key={u.id}
                        onClick={() => { setActiveUser(u); setShowUserMenu(false); }}
                        className={\`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors \${activeUser?.id === u.id ? 'bg-primary-emerald/10 border-primary-emerald/20 border' : 'hover:bg-white/5 border border-transparent'}\`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white/60">{u.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={\`text-sm font-semibold truncate \${activeUser?.id === u.id ? 'text-primary-emerald' : 'text-white'}\`}>{u.name}</div>
                          <div className="text-[10px] text-white/40 truncate">{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, headerRightSide);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced activeDoctor string successfully');
} else {
  console.log('Target string not found in App.tsx');
}
