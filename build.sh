#!/usr/bin/env bash
set -euo pipefail

ZIP_FILE="REALTYPIXELWORKS_GITHUB_READY_SMALL.zip"

rm -rf dist
mkdir -p dist
unzip -q "$ZIP_FILE" -d dist

# Apply latest website fixes over the extracted project.
cp contact.html dist/contact.html
cp portfolio.html dist/portfolio.html
cp services.html dist/services.html
mkdir -p dist/assets/js dist/assets/css
cp assets/js/script.js dist/assets/js/script.js
cat assets/css/fix.css >> dist/assets/css/style.css
cp sw.js dist/sw.js

echo "RealtyPixelWorks build ready in dist/"
