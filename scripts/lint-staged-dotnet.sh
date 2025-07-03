#!/bin/bash

# Script to run dotnet format on staged C# files only
# This is called by husky pre-commit hook

# Exit on any error
set -e

# Get list of staged C# files
STAGED_CS_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.cs$' || true)

if [ -z "$STAGED_CS_FILES" ]; then
    echo "No staged C# files found, skipping dotnet format"
    exit 0
fi

echo "Running dotnet format on staged C# files..."
echo "Staged files: $STAGED_CS_FILES"

# Run dotnet format on the solution, but only for the files we care about
# The --include parameter will limit formatting to the staged files
dotnet format --include $(echo $STAGED_CS_FILES | tr ' ' ',') --verbosity minimal

# Add the formatted files back to staging area
for file in $STAGED_CS_FILES; do
    if [ -f "$file" ]; then
        git add "$file"
        echo "Formatted and re-staged: $file"
    fi
done

echo "✅ dotnet format completed successfully"