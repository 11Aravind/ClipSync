#!/bin/bash

echo "🚀 Installing ClipSync..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /opt/clipsync
mkdir -p /usr/share/applications
mkdir -p /usr/share/icons/hicolor/256x256/apps

# Copy application files
echo "📦 Copying application files..."
cp -r src/ /opt/clipsync/
cp package.json /opt/clipsync/
cp -r node_modules/ /opt/clipsync/

# Create executable script
echo "🔧 Creating executable..."
cat > /usr/bin/clipsync << 'EOF'
#!/bin/bash
cd /opt/clipsync
exec electron . --no-sandbox "$@"
EOF

chmod +x /usr/bin/clipsync

# Copy desktop entry
echo "📋 Installing desktop entry..."
cp linux-clipboard-manager.desktop /usr/share/applications/

# Copy icon (if exists)
if [ -f "assets/icon.png" ]; then
    echo "🎨 Installing icon..."
    cp assets/icon.png /usr/share/icons/hicolor/256x256/apps/clipsync.png
fi

# Update desktop database
echo "🔄 Updating desktop database..."
update-desktop-database /usr/share/applications

echo "✅ Installation complete!"
echo ""
echo "🎉 ClipSync is now installed system-wide!"
echo ""
echo "📋 Usage:"
echo "- Press Ctrl+Shift+V to open clipboard history"
echo "- Look for the ClipSync icon in your system tray"
echo "- Right-click tray icon for menu options"
echo ""
echo "📦 To uninstall:"
echo "sudo rm -rf /opt/clipsync"
echo "sudo rm /usr/bin/clipsync"
echo "sudo rm /usr/share/applications/linux-clipboard-manager.desktop"
echo "sudo rm /usr/share/icons/hicolor/256x256/apps/clipsync.png" 