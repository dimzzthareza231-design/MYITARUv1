import React, { useState } from 'react';
import { Save, Bell, Shield, User, Database, Globe, Smartphone, HelpCircle } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-sm text-white/40">Configure application preferences and system defaults</p>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-64 shrink-0 glass-panel border border-white/5 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
          >
            <User className="w-4 h-4" /> Profile & Account
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
          >
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
          >
            <Shield className="w-4 h-4" /> Security & Privacy
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'system' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
          >
            <Database className="w-4 h-4" /> Data & Integration
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 glass-panel border border-white/5 p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Profile Details</h2>
                <p className="text-sm text-white/40 mb-6">Update your personal information and contact details.</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/60 mb-1 block">First Name</label>
                      <input type="text" className="w-full glass-input p-2.5 text-sm" defaultValue="Budi" />
                    </div>
                    <div>
                      <label className="text-xs text-white/60 mb-1 block">Last Name</label>
                      <input type="text" className="w-full glass-input p-2.5 text-sm" defaultValue="Santoso" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Email Address</label>
                    <input type="email" className="w-full glass-input p-2.5 text-sm" defaultValue="budi.santoso@myitaru.com" />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Phone Number</label>
                    <input type="tel" className="w-full glass-input p-2.5 text-sm" defaultValue="+62 812 3456 7890" />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <button className="btn-primary">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Notification Preferences</h2>
                <p className="text-sm text-white/40 mb-6">Choose how you want to be notified about important events.</p>
                <div className="space-y-4">
                  {[
                    { title: 'New Patient Registration', desc: 'Get notified when a new patient is registered in the system.' },
                    { title: 'Critical Lab Results', desc: 'Immediate alerts for highly abnormal laboratory results.' },
                    { title: 'System Updates', desc: 'Notifications about MYITARU platform updates and maintenance.' },
                    { title: 'Security Alerts', desc: 'Alerts for failed logins and unauthorized access attempts.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <div className="text-sm font-bold text-white">{item.title}</div>
                        <div className="text-xs text-white/40">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-emerald"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'security' || activeTab === 'system') && (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/40">
              <Shield className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-white mb-2">Advanced Configuration</h3>
              <p className="max-w-md text-sm">These settings are managed centrally by the Hospital IT Administrator. Contact your system admin to request changes to these parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
