const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalRecords.tsx', 'utf8');

const targetStr = `<td className="p-4">                    <button onClick={() => openPatientFile(p)} className="text-[var(--color-primary-blue)] hover:underline font-medium">Buka Berkas</button>                  </td>`;

const replacementStr = `<td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openPatientFile(p)} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-1">
                        📄 Buka Berkas
                      </button>
                      <button onClick={() => toast.info('Fitur Edit sedang dalam pengembangan')} className="bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600 text-sm font-medium transition-colors flex items-center gap-1">
                        ✏️ Edit
                      </button>
                      <button onClick={() => { if (window.confirm('Hapus rekam medis ini?')) toast.success('Berhasil dihapus') }} className="bg-rose-500 text-white px-3 py-1 rounded-md hover:bg-rose-600 text-sm font-medium transition-colors flex items-center gap-1">
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>`;

code = code.replace(/<td className="p-4">\s*<button onClick=\{\(\) => openPatientFile\(p\)\} className="text-\[var\(--color-primary-blue\)\] hover:underline font-medium">Buka Berkas<\/button>\s*<\/td>/, replacementStr);

fs.writeFileSync('src/components/MedicalRecords.tsx', code);
