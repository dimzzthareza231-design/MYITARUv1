#!/bin/bash
# ProfessionalTable.tsx
sed -i "s/alert('✅ Data berhasil diexport ke CSV')/alert('✅ Data berhasil diexport ke CSV')/g" src/components/ProfessionalTable.tsx # Just replacing string is hard, I will do it with multi_edit_file later if necessary. 
