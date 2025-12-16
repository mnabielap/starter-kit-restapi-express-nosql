#!/bin/sh
set -e

echo "--- Starting Express REST API (NoSQL) ---"

# Check if dist/index.js exists (result of npm run build)
if [ ! -f "dist/index.js" ]; then
  echo "Error: Build not found. Running build..."
  npm run build
fi

# Run the compiled JavaScript file
exec node dist/index.js