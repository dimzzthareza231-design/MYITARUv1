#!/bin/bash
echo "import React, { useState, useRef } from 'react';" > src/components/RME/Modals/InformedConsentModal.tsx
sed -n '23,172p' src/components/RME/Patient360.tsx >> src/components/RME/Modals/InformedConsentModal.tsx
sed -i 's/^function InformedConsentModal/export function InformedConsentModal/' src/components/RME/Modals/InformedConsentModal.tsx
