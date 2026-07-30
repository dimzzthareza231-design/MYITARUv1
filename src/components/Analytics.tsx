import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BarChart3, TrendingUp, Users, Activity } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Analytics() {
  const { patients, records, doctors, nurses } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');

  const visitData = [
    { month: 'Jan', patients: 400 },
    { month: 'Feb', patients: 300 },
    { month: 'Mar', patients: 550 },
    { month: 'Apr', patients: 450 },
    { month: 'May', patients: 700 },
    { month: 'Jun', patients: 650 },
  ];

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Hospital Analytics</h1>
          <p className="text-sm text-white/40">Detailed reports and performance metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider">Total Patients</h3>
          </div>
          <div className="text-3xl font-bold text-white">{patients.length.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider">Total Records</h3>
          </div>
          <div className="text-3xl font-bold text-white">{records.length.toLocaleString()}</div>
        </div>
        <div className="glass-panel p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-sm font-bold uppercase tracking-wider">Active Staff</h3>
          </div>
          <div className="text-3xl font-bold text-white">{doctors.length + nurses.length}</div>
        </div>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden border border-white/5 min-h-0">
        <div className="p-4 border-b border-white/5 flex gap-4 shrink-0 justify-between items-center">
          <h2 className="text-lg font-bold text-white">Doctor Performance Table</h2>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by Doctor Name or Dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-white/40 sticky top-0 bg-panel/95 backdrop-blur-md">
                <th className="p-4 font-bold">Doctor ID</th>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Department</th>
                <th className="p-4 font-bold">Patients Handled</th>
                <th className="p-4 font-bold">Avg Consultation Time</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc, idx) => {
                const patientsHandled = Math.floor(Math.random() * 500) + 50;
                const avgTime = Math.floor(Math.random() * 20) + 10;
                return (
                <tr key={doc.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4 text-sm font-medium text-white/80">{doc.id}</td>
                  <td className="p-4">
                    <div className="text-sm text-white font-medium">{doc.name}</div>
                  </td>
                  <td className="p-4 text-sm text-white/60">{doc.department}</td>
                  <td className="p-4 text-sm text-white/80">{patientsHandled}</td>
                  <td className="p-4 text-sm text-white/80">{avgTime} mins</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-bold border",
                      doc.status === 'On Duty' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      "bg-white/5 text-white/40 border-white/10"
                    )}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
