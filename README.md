# Linux Clipboard Manager

A comprehensive clipboard manager for Linux that replicates the full functionality of Windows' clipboard history. Built with Electron, it provides a seamless clipboard experience on Linux with support for storing clipboard history, managing copied content, and accessing it with keyboard shortcuts.

## Features

- **Clipboard History**: Automatically stores up to 50 clipboard items
- **Global Shortcuts**: 
  - `Super+V` (Windows key + V) to open clipboard history
  - `Super+Shift+V` for quick paste of the most recent item
- **Search Functionality**: Search through your clipboard history
- **Keyboard Navigation**: Use arrow keys to navigate and Enter to paste
- **System Tray**: Always accessible from the system tray
- **Persistent Storage**: Your clipboard history is saved between sessions
- **Modern UI**: Clean, modern interface with dark mode support
- **Auto-hide**: Window automatically hides when it loses focus

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Linux distribution with desktop environment

### Installation Steps

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd linux-clipboard-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install system dependencies** (required for global shortcuts)
   ```bash
   # Ubuntu/Debian
   sudo apt-get install libxtst-dev libpng++-dev
   
   # Fedora
   sudo dnf install libXtst-devel libpng-devel
   
   # Arch Linux
   sudo pacman -S libxtst libpng
   ```

4. **Start the application**
   ```bash
   npm start
   ```

## Usage

### Basic Usage

1. **Launch the application**: Run `npm start` or double-click the executable
2. **Copy items**: Copy text from any application (Ctrl+C)
3. **Access history**: Press `Super+V` (Windows key + V) to open clipboard history
4. **Paste items**: Click on any item in the history to paste it
5. **Quick paste**: Press `Super+Shift+V` to quickly paste the most recent item

### Advanced Features

- **Search**: Type in the search box to filter clipboard items
- **Keyboard Navigation**: 
  - Use arrow keys to navigate through items
  - Press Enter to paste the selected item
  - Press Delete to remove the selected item
  - Press Escape to clear selection
- **Double-click**: Double-click an item to copy it to clipboard without pasting
- **Delete items**: Click the trash icon next to any item to delete it
- **Clear all**: Click the clear button in the header to remove all history

### System Tray

The application runs in the system tray and provides:
- Quick access to clipboard history
- Option to clear all history
- Settings menu (coming soon)
- Quit option

## Building

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

This will create an AppImage in the `dist` folder that can be distributed and installed on other Linux systems.

## Configuration

### Customizing Shortcuts

You can modify the keyboard shortcuts by editing `src/main.js`:

```javascript
// Change the main shortcut (default: Super+V)
globalShortcut.register('Super+V', () => {
  toggleWindow();
});

// Change the quick paste shortcut (default: Super+Shift+V)
globalShortcut.register('Super+Shift+V', () => {
  // Quick paste functionality
});
```

### Adjusting History Size

Modify the `MAX_HISTORY_SIZE` constant in `src/main.js`:

```javascript
const MAX_HISTORY_SIZE = 50; // Change this value
```

## Troubleshooting

### Global Shortcuts Not Working

1. **Check permissions**: Ensure the application has permission to register global shortcuts
2. **Desktop environment**: Some desktop environments may block global shortcuts
3. **Install dependencies**: Make sure all system dependencies are installed

### Application Not Starting

1. **Check Node.js version**: Ensure you have Node.js 16 or higher
2. **Install dependencies**: Run `npm install` again
3. **Check system dependencies**: Install required system packages

### Performance Issues

1. **Reduce history size**: Lower the `MAX_HISTORY_SIZE` value
2. **Clear history**: Use the clear all function to remove old items
3. **Restart application**: Close and reopen the application

## Development

### Project Structure

```
linux-clipboard-manager/
├── src/
│   ├── main.js              # Main Electron process
│   └── renderer/
│       ├── index.html       # Main window HTML
│       ├── styles.css       # Styling
│       └── renderer.js      # Renderer process logic
├── assets/
│   └── icon.png            # Application icon
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Uses [robotjs](https://robotjs.io/) for system automation
- Inspired by Windows 10 clipboard history feature

## Support

If you encounter any issues or have feature requests, please open an issue on the project repository. 