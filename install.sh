#!/bin/bash

# Linux Clipboard Manager Installation Script

echo "🚀 Installing Linux Clipboard Manager..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 16 or higher."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "❌ Could not detect Linux distribution"
    exit 1
fi

echo "📦 Installing system dependencies for $OS..."

# Install system dependencies based on distribution
case $OS in
    *"Ubuntu"*|*"Debian"*)
        sudo apt-get update
        sudo apt-get install -y libxtst-dev libpng++-dev build-essential
        ;;
    *"Fedora"*)
        sudo dnf install -y libXtst-devel libpng-devel gcc-c++
        ;;
    *"Arch"*|*"Manjaro"*)
        sudo pacman -S --needed libxtst libpng base-devel
        ;;
    *"openSUSE"*)
        sudo zypper install libXtst-devel libpng-devel gcc-c++
        ;;
    *)
        echo "⚠️  Unknown distribution: $OS"
        echo "Please install the following packages manually:"
        echo "- libxtst-dev (or libXtst-devel)"
        echo "- libpng++-dev (or libpng-devel)"
        echo "- build-essential (or gcc-c++ or base-devel)"
        ;;
esac

echo "📦 Installing npm dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Installation complete!"
    echo ""
    echo "To start the clipboard manager:"
    echo "  npm start"
    echo ""
    echo "To build the application:"
    echo "  npm run build"
    echo ""
    echo "📋 Features:"
    echo "- Press Super+V to open clipboard history"
    echo "- Press Super+Shift+V for quick paste"
    echo "- Search through your clipboard items"
    echo "- Keyboard navigation with arrow keys"
    echo ""
    echo "🚀 Starting the application..."
    npm start
else
    echo "❌ Failed to install dependencies"
    exit 1
fi 