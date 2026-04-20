#!/bin/bash
# Eye in the Sky DMG Packager (High Signal Version)

echo "Orbital construction initiated..."

# Prepare Icon Asset Catalog
mkdir -p EyeInTheSky.iconset
sips -z 16 16     icon.png --out EyeInTheSky.iconset/icon_16x16.png
sips -z 32 32     icon.png --out EyeInTheSky.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out EyeInTheSky.iconset/icon_32x32.png
sips -z 64 64     icon.png --out EyeInTheSky.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out EyeInTheSky.iconset/icon_128x128.png
sips -z 256 256   icon.png --out EyeInTheSky.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out EyeInTheSky.iconset/icon_256x256.png
sips -z 512 512   icon.png --out EyeInTheSky.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out EyeInTheSky.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out EyeInTheSky.iconset/icon_512x512@2x.png

iconutil -c icns EyeInTheSky.iconset
mv EyeInTheSky.icns EyeInTheSky.app/Contents/Resources/ 2>/dev/null || echo "Icon generated (skipping app bundle injection for web-stack)"

# Create distribution DMG
mkdir -p dist
hdiutil create -volname "Eye in the Sky" -srcfolder . -ov -format UDZO dist/EyeInTheSky.dmg

# Cleanup
rm -rf EyeInTheSky.iconset
echo "Deployment package finalized at dist/EyeInTheSky.dmg"
