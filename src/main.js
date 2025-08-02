const { app, BrowserWindow, ipcMain, clipboard, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize store for persistent data
const store = new Store();

let mainWindow;
let tray;
let clipboardHistory = [];
let isVisible = false;

// Configuration
const MAX_HISTORY_SIZE = 50;
const SHORTCUT_KEY = 'Ctrl+Shift+V'; // Changed to avoid Ubuntu conflicts

// Initialize clipboard history from store
function loadClipboardHistory() {
  try {
    clipboardHistory = store.get('clipboardHistory', []);
  } catch (error) {
    console.error('Error loading clipboard history:', error);
    clipboardHistory = [];
  }
}

// Save clipboard history to store
function saveClipboardHistory() {
  try {
    store.set('clipboardHistory', clipboardHistory);
  } catch (error) {
    console.error('Error saving clipboard history:', error);
  }
}

// Add item to clipboard history
function addToHistory(content, type = 'text') {
  try {
    const timestamp = Date.now();
    const item = {
      id: timestamp,
      content,
      type,
      timestamp,
      preview: type === 'text' ? content.substring(0, 100) : 'Image'
    };

    // Remove duplicate if exists
    clipboardHistory = clipboardHistory.filter(item => item.content !== content);
    
    // Add to beginning
    clipboardHistory.unshift(item);
    
    // Limit history size
    if (clipboardHistory.length > MAX_HISTORY_SIZE) {
      clipboardHistory = clipboardHistory.slice(0, MAX_HISTORY_SIZE);
    }
    
    saveClipboardHistory();
    
    // Notify renderer process
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('clipboard-updated', clipboardHistory);
    }
  } catch (error) {
    console.error('Error adding to history:', error);
  }
}

// Paste item without creating duplicate
function pasteItemWithoutDuplicate(itemId) {
  const item = clipboardHistory.find(item => item.id === itemId);
  if (item) {
    clipboard.writeText(item.content);
    
    // Simulate Ctrl+V to paste into active input field
    setTimeout(() => {
      const { exec } = require('child_process');
      exec('xdotool key ctrl+v', (error) => {
        if (error) {
          console.log('Auto-paste failed, manual Ctrl+V required');
        } else {
          console.log('Auto-paste successful');
        }
      });
    }, 100);
    
    hideWindow();
  }
}

// Monitor clipboard changes
function startClipboardMonitoring() {
  let lastContent = '';
  let isPastingFromManager = false;
  
  try {
    lastContent = clipboard.readText();
    console.log('Initial clipboard content:', lastContent);
  } catch (error) {
    console.error('Error reading clipboard:', error);
  }
  
  console.log('Starting clipboard monitoring...');
  
  setInterval(() => {
    try {
      const currentContent = clipboard.readText();
      if (currentContent !== lastContent && currentContent.trim() !== '' && !isPastingFromManager) {
        console.log('New clipboard content detected:', currentContent.substring(0, 50) + '...');
        lastContent = currentContent;
        addToHistory(currentContent, 'text');
      }
    } catch (error) {
      console.error('Error in clipboard monitoring:', error);
    }
  }, 1000);
  
  // Track when we're pasting from the manager
  ipcMain.on('paste-from-manager', () => {
    isPastingFromManager = true;
    setTimeout(() => {
      isPastingFromManager = false;
    }, 500);
  });
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    transparent: true
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Hide window when it loses focus          
  mainWindow.on('blur', () => {                                             
    if (mainWindow && mainWindow.isVisible()) {
      hideWindow();
    }
  });

  // Prevent window from being closed
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      hideWindow();
    }
  });
}

// Show/hide window
function toggleWindow() {
  if (isVisible) {
    hideWindow();
  } else {
    showWindow();
  }
}

function showWindow() {
  if (!mainWindow) return;
  
  // Position window near cursor using screen bounds
  const { width, height } = mainWindow.getBounds();
  const screenBounds = require('electron').screen.getPrimaryDisplay().workAreaSize;
  
  // Center the window on screen for now (can be enhanced later)
  let x = (screenBounds.width - width) / 2;
  let y = (screenBounds.height - height) / 2;
  
  // Ensure window stays on screen
  x = Math.max(0, Math.min(x, screenBounds.width - width));
  y = Math.max(0, Math.min(y, screenBounds.height - height));
  
  mainWindow.setPosition(x, y);
  mainWindow.show();
  mainWindow.focus();
  isVisible = true;
}

function hideWindow() {
  if (!mainWindow) return;
  mainWindow.hide();
  isVisible = false;
}

// Create system tray
function createTray() {
  // Create a simple icon if the file doesn't exist
  let icon;
  try {
    const iconPath = path.join(__dirname, '../assets/icon.png');
    icon = nativeImage.createFromPath(iconPath);
  } catch (error) {
    // Create a default icon
    icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }
  
  tray = new Tray(icon);
  tray.setToolTip('ClipSync');
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Clipboard History (Ctrl+Shift+V)',
      click: () => showWindow()
    },
    {
      label: 'Test Clipboard Monitoring',
      click: () => {
        const currentContent = clipboard.readText();
        console.log('Current clipboard content:', currentContent);
        if (currentContent.trim() !== '') {
          addToHistory(currentContent, 'text');
          console.log('Added current clipboard content to history');
        }
      }
    },
    {
      label: 'Clear History',
      click: () => {
        clipboardHistory = [];
        saveClipboardHistory();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('clipboard-updated', clipboardHistory);
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        // TODO: Implement settings window
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.on('click', () => toggleWindow());
}

// Register global shortcuts
function registerGlobalShortcuts() {
  // Register Ctrl+Shift+V (changed from Super+V to avoid Ubuntu conflicts)
  const success = globalShortcut.register('Ctrl+Shift+V', () => {
    toggleWindow();
  });
  
  if (success) {
    console.log('Global shortcut Ctrl+Shift+V registered successfully');
  } else {
    console.log('Failed to register global shortcut Ctrl+Shift+V');
  }
}

// IPC handlers
ipcMain.handle('get-clipboard-history', () => {
  return clipboardHistory;
});

ipcMain.handle('paste-item', (event, itemId) => {
  pasteItemWithoutDuplicate(itemId);
});

ipcMain.handle('delete-item', (event, itemId) => {
  clipboardHistory = clipboardHistory.filter(item => item.id !== itemId);
  saveClipboardHistory();
  return clipboardHistory;
});

ipcMain.handle('clear-history', () => {
  clipboardHistory = [];
  saveClipboardHistory();
  return clipboardHistory;
});

ipcMain.on('hide-window', () => {
  hideWindow();
});

// App event handlers
app.whenReady().then(() => {
  try {
    loadClipboardHistory();
    createWindow();
    createTray();
    registerGlobalShortcuts();
    startClipboardMonitoring();
    
    // Send initial clipboard history to renderer
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('clipboard-updated', clipboardHistory);
    }
    
    console.log('Linux Clipboard Manager started successfully');
  } catch (error) {
    console.error('Error starting application:', error);
    // Try to restart critical components
    setTimeout(() => {
      try {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
        }
        if (!tray) {
          createTray();
        }
      } catch (restartError) {
        console.error('Failed to restart components:', restartError);
      }
    }, 1000);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the app, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the app, just log the error
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
}); 