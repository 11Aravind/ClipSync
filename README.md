# ClipSync

ClipSync is a comprehensive clipboard manager for Linux that replicates the full functionality of Windows' clipboard history. Built with Electron, it provides a seamless clipboard experience on Linux with support for storing clipboard history, managing copied content, and accessing it with keyboard shortcuts.

## ✨ Features

- **📋 Clipboard History**: Automatically stores up to 50 clipboard items
- **⌨️ Global Shortcuts**: 
  - `Ctrl+Shift+V` to open clipboard history
  - Auto-paste functionality into active input fields
- **🔍 Search Functionality**: Search through your clipboard history
- **🎯 Keyboard Navigation**: Use arrow keys to navigate and Enter to paste
- **🖱️ System Tray**: Always accessible from the system tray
- **💾 Persistent Storage**: Your clipboard history is saved between sessions
- **🎨 Modern UI**: Clean, modern interface with dark mode support
- **⚡ Auto-hide**: Window automatically hides when it loses focus
- **🔒 Privacy-focused**: No internet required, all data stored locally

## 🚀 Installation

### **Quick Install (Recommended)**

#### **Option 1: System Installation**
```bash
# Download and install ClipSync
git clone <repository-url>
cd CopyPast
sudo ./install-system.sh
```

#### **Option 2: AppImage (Portable)**
```bash
# Build AppImage
./build-appimage.sh

# Run AppImage
chmod +x dist/ClipSync-*.AppImage
./dist/ClipSync-*.AppImage
```

#### **Option 3: Development Mode**
```bash
# Clone repository
git clone <repository-url>
cd CopyPast

# Install dependencies
npm install

# Start in development mode
npm start
```

### **Prerequisites**

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Linux distribution** with desktop environment
- **System dependencies** for global shortcuts

### **System Dependencies**

Install required packages for global shortcuts:

```bash
# Ubuntu/Debian
sudo apt-get install libxtst-dev libpng++-dev

# Fedora
sudo dnf install libXtst-devel libpng-devel

# Arch Linux
sudo pacman -S libxtst libpng

# openSUSE
sudo zypper install libXtst-devel libpng-devel
```

## 📖 Usage

### **Basic Usage**

1. **Launch ClipSync**: 
   - Press `Ctrl+Shift+V` anywhere, OR
   - Search for "ClipSync" in Applications menu, OR
   - Click the ClipSync icon in system tray

2. **Copy items**: Copy text from any application (Ctrl+C)

3. **Access history**: Press `Ctrl+Shift+V` to open clipboard history

4. **Paste items**: Click on any item in the history to paste it

5. **Auto-paste**: Items automatically paste into active input fields

### **Advanced Features**

- **🔍 Search**: Type in the search box to filter clipboard items
- **⌨️ Keyboard Navigation**: 
  - Use arrow keys to navigate through items
  - Press Enter to paste the selected item
  - Press Delete to remove the selected item
  - Press Escape to clear selection
- **🖱️ Double-click**: Double-click an item to copy it to clipboard without pasting
- **🗑️ Delete items**: Click the trash icon next to any item to delete it
- **🖱️ System Tray**: Right-click tray icon for menu options

### **System Tray**

The application runs in the system tray and provides:
- **Show Clipboard History** - Quick access
- **Test Clipboard Monitoring** - Debug clipboard detection
- **Clear History** - Remove all clipboard items
- **Settings** - Configuration options (coming soon)
- **Quit** - Exit application

## 🛠️ Building

### **Development Build**

```bash
npm run dev
```

### **Production Build**

```bash
npm run build
```

This will create an AppImage in the `dist` folder that can be distributed and installed on other Linux systems.

### **Build AppImage**

```bash
./build-appimage.sh
```

Creates a portable AppImage that works on any Linux distribution.

## ⚙️ Configuration

### **Customizing Shortcuts**

You can modify the keyboard shortcuts by editing `src/main.js`:

```javascript
// Change the main shortcut (default: Ctrl+Shift+V)
globalShortcut.register('Ctrl+Shift+V', () => {
  toggleWindow();
});
```

### **Adjusting History Size**

Modify the `MAX_HISTORY_SIZE` constant in `src/main.js`:

```javascript
const MAX_HISTORY_SIZE = 50; // Change this value
```

### **System Integration**

After installation, ClipSync integrates with your system:
- **Applications Menu**: Search for "ClipSync"
- **Global Shortcut**: `Ctrl+Shift+V` works system-wide
- **System Tray**: Always accessible icon
- **Desktop Entry**: Professional installation

## 🔧 Troubleshooting

### **Global Shortcuts Not Working**

1. **Check permissions**: Ensure the application has permission to register global shortcuts
2. **Desktop environment**: Some desktop environments may block global shortcuts
3. **Install dependencies**: Make sure all system dependencies are installed
4. **Try alternative shortcuts**: Some shortcuts may conflict with system shortcuts

### **Application Not Starting**

1. **Check Node.js version**: Ensure you have Node.js 16 or higher
2. **Install dependencies**: Run `npm install` again
3. **Check system dependencies**: Install required system packages
4. **Sandbox issues**: The app runs with `--no-sandbox` flag

### **Clipboard Items Not Showing**

1. **Check clipboard monitoring**: Look for console logs about clipboard detection
2. **Test clipboard**: Copy some text and check if it appears
3. **Restart application**: Close and reopen the application
4. **Check permissions**: Ensure clipboard access is allowed

### **Performance Issues**

1. **Reduce history size**: Lower the `MAX_HISTORY_SIZE` value
2. **Clear history**: Use the clear function to remove old items
3. **Restart application**: Close and reopen the application
4. **Check system resources**: Monitor memory and CPU usage

## 🛠️ Development

### **Project Structure**

```
CopyPast/
├── src/
│   ├── main.js              # Main Electron process
│   └── renderer/
│       ├── index.html       # Main window HTML
│       ├── styles.css       # Styling
│       └── renderer.js      # Renderer process logic
├── assets/
│   └── icon.png            # Application icon (logo1.png)
├── package.json            # Dependencies and scripts
├── install-system.sh       # System installation script
├── build-appimage.sh       # AppImage build script
└── README.md              # This file
```

### **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Building for Distribution**

```bash
# Build AppImage
./build-appimage.sh

# Install system-wide
sudo ./install-system.sh

# Development mode
npm start
```

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Uses [electron-store](https://github.com/sindresorhus/electron-store) for persistent storage
- Inspired by Windows 10 clipboard history feature

## 📞 Support

If you encounter any issues or have feature requests, please open an issue on the project repository.

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd CopyPast

# Install system-wide
sudo ./install-system.sh

# Or run in development mode
npm start
```

**ClipSync** - Your Windows-like clipboard experience on Linux! 🎉 