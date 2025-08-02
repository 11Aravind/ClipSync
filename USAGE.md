# Linux Clipboard Manager - Usage Guide

## Quick Start

1. **Install and Run**:
   ```bash
   npm install
   npm start
   ```

2. **Use the Clipboard Manager**:
   - Copy text from any application (Ctrl+C)
   - Press `Super+V` (Windows key + V) to open clipboard history
   - Click on any item to copy it back to clipboard
   - Use the search box to find specific items

## Features

### ✅ Working Features

- **Clipboard History**: Automatically stores copied text
- **Global Shortcut**: `Super+V` to open clipboard history
- **Search**: Filter clipboard items by typing
- **Keyboard Navigation**: Use arrow keys to navigate
- **System Tray**: Always accessible from system tray
- **Persistent Storage**: History saved between sessions
- **Modern UI**: Clean interface with dark mode support
- **Auto-hide**: Window hides when it loses focus

### 🔧 Current Limitations

- **Auto-paste**: Currently only copies to clipboard (manual Ctrl+V required)
- **Image Support**: Text-only clipboard items (images coming soon)
- **Advanced Shortcuts**: Some advanced shortcuts need additional setup

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Super+V` | Open clipboard history |
| `Super+Shift+V` | Quick copy of most recent item |
| `↑/↓` | Navigate through items |
| `Enter` | Copy selected item |
| `Delete` | Remove selected item |
| `Escape` | Clear selection |

## System Tray

Right-click the tray icon to access:
- Show Clipboard History
- Clear History
- Settings (coming soon)
- Quit

## Troubleshooting

### Global Shortcuts Not Working

1. **Check permissions**: Some desktop environments block global shortcuts
2. **Try alternative shortcuts**: You can modify shortcuts in `src/main.js`
3. **Desktop environment**: GNOME, KDE, and XFCE should work

### Application Not Starting

1. **Sandbox issues**: The app runs with `--no-sandbox` flag
2. **Dependencies**: Run `npm install` again
3. **Node.js version**: Ensure you have Node.js 16+

### Performance

- **History size**: Limited to 50 items by default
- **Memory usage**: Minimal impact on system resources
- **Startup**: Runs in background, starts with system (optional)

## Configuration

### Modifying Settings

Edit `config.json` to customize:
- Maximum history size
- Keyboard shortcuts
- Window settings
- UI preferences

### Building for Distribution

```bash
npm run build
```

This creates an AppImage that can be shared and installed on other Linux systems.

## Development

### Project Structure

```
src/
├── main.js              # Main Electron process
└── renderer/
    ├── index.html       # UI structure
    ├── styles.css       # Styling
    └── renderer.js      # UI logic
```

### Adding Features

1. **Auto-paste**: Implement system-level key simulation
2. **Image support**: Add clipboard image handling
3. **Rich text**: Support formatted text
4. **Cloud sync**: Add cloud storage integration

## Support

The application is designed to work on most Linux distributions with desktop environments like GNOME, KDE, XFCE, and others.

For issues or feature requests, please check the main README.md file. 