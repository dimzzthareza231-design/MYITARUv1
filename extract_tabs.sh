#!/bin/bash
# Extract imports
head -n 22 src/components/RME/Patient360.tsx > src/components/RME/PatientTabs.tsx
# Add export to functions
sed -n '590,2078p' src/components/RME/Patient360.tsx >> src/components/RME/PatientTabs.tsx
sed -i 's/^function /export function /' src/components/RME/PatientTabs.tsx
