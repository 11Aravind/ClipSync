#!/bin/bash

echo "🔧 Installing dependencies for auto-paste functionality..."

# Check if xdotool is installed
if ! command -v xdotool &> /dev/null; then
    echo "📦 Installing xdotool for auto-paste functionality..."
    
    # Detect Linux distribution
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
    else
        echo "❌ Could not detect Linux distribution"
        exit 1
    fi
    
    # Install xdotool based on distribution
    case $OS in
        *"Ubuntu"*|*"Debian"*)
            sudo apt-get update
            sudo apt-get install -y xdotool
            ;;
        *"Fedora"*)
            sudo dnf install -y xdotool
            ;;
        *"Arch"*|*"Manjaro"*)
            sudo pacman -S --needed xdotool
            ;;
        *"openSUSE"*)
            sudo zypper install xdotool
            ;;
        *)
            echo "⚠️  Unknown distribution: $OS"
            echo "Please install xdotool manually:"
            echo "Ubuntu/Debian: sudo apt-get install xdotool"
            echo "Fedora: sudo dnf install xdotool"
            echo "Arch: sudo pacman -S xdotool"
            ;;
    esac
else
    echo "✅ xdotool is already installed"
fi

echo "✅ Dependencies installed successfully!"
echo ""
echo "🎉 Auto-paste functionality is now available!"
echo "When you select an item from clipboard history and press Enter,"
echo "it will automatically paste into the active input field." 