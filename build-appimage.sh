#!/bin/bash

echo "🚀 Building ClipSync AppImage..."

# Check if electron-builder is installed
if ! command -v electron-builder &> /dev/null; then
    echo "📦 Installing electron-builder..."
    npm install -g electron-builder
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf out/

# Build the AppImage
echo "🔨 Building AppImage..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ AppImage built successfully!"
    echo ""
    echo "📁 AppImage location: dist/"
    echo "📋 Files created:"
    ls -la dist/
    echo ""
    echo "🎉 Your ClipSync is ready for distribution!"
    echo ""
    echo "📦 To install on other systems:"
    echo "1. Copy the .AppImage file to the target system"
    echo "2. Make it executable: chmod +x ClipSync-*.AppImage"
    echo "3. Run it: ./ClipSync-*.AppImage"
    echo ""
    echo "📋 Features included:"
    echo "- Global shortcut (Ctrl+Shift+V)"
    echo "- System tray integration"
    echo "- Auto-paste functionality"
    echo "- Search and keyboard navigation"
    echo "- Persistent clipboard history"
else
    echo "❌ Failed to build AppImage"
    exit 1
fi 