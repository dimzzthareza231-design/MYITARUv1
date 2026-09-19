#!/bin/bash
sed -i '/import { OverviewTab/a import { GeneralConsentTab, HakPasienTab, AsesmenMedisTab, AsesmenKeperawatanTab, InformedConsentTab, LaporanOperasiTab, LaporanAnestesiTab, HasilPenunjangTab, DischargeSummaryTab } from "./PatientTabsInap";' src/components/RME/Patient360.tsx
