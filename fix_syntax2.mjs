import fs from 'fs';
let content = fs.readFileSync('src/components/PatientManagement.tsx', 'utf8');

const targetStr = `              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}`;

const replaceStr = `              <div key={patient.id} className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedPatientId(patient.id)}`;

content = content.replace(targetStr, replaceStr);

const endStr = `              {listMode === 'triage' && selectedPatientId === patient.id && (
                <div className="px-3 pb-3 pt-1 text-[10px] text-white/60">
                  <div className="font-bold text-orange-400 mb-1">AI Triage Flags:</div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {(patient as any).triageReasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                  <button className="mt-2 w-full py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold hover:bg-orange-500/20 transition-colors">
                    Prioritize for Bed Assignment
                  </button>
                </div>
              )}`;

const newEndStr = endStr + `\n              </div>`;

content = content.replace(endStr, newEndStr);

fs.writeFileSync('src/components/PatientManagement.tsx', content);
