import React from 'react';

interface SmartTabsProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export default function SmartTabs({ tabs, active, onChange }: SmartTabsProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-2 mb-4 border border-slate-700 overflow-x-auto shadow-md">
      <div className="flex gap-1 min-w-max">
        {tabs.map(t => (
          <button key={t} onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              active === t ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
