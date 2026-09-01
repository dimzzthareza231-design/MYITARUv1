#!/bin/bash
# We want to keep lines 1 to 22 (imports), then add new imports, then keep lines 173 to 588.
head -n 22 src/components/RME/Patient360.tsx > src/components/RME/Patient360_new.tsx
echo "import { InformedConsentModal } from './Modals/InformedConsentModal';" >> src/components/RME/Patient360_new.tsx
echo "import { OverviewTab, TriaseTab, FisikTab, SoapTab, KodeTab, CPOETab, LegalTab, AuditTab, ProblemListTab, MedicationsTab, AllergiesTab, VitalsTab, EncountersTab, TimelineTab } from './PatientTabs';" >> src/components/RME/Patient360_new.tsx
sed -n '173,588p' src/components/RME/Patient360.tsx >> src/components/RME/Patient360_new.tsx
mv src/components/RME/Patient360_new.tsx src/components/RME/Patient360.tsx
