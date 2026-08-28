#!/bin/bash
for file in $(grep -rl "alert(" src/components/); do
    echo "Fixing $file..."
    # If the file doesn't have useToast, inject it
    if ! grep -q "useToast" "$file"; then
        sed -i '1i import { useToast } from "../contexts/ToastContext";' "$file"
        # We need to inject const toast = useToast(); inside the functional component.
        # This might be tricky automatically. I will just do it manually for important files.
    fi
done
