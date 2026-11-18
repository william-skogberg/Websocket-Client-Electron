const { app, BrowserWindow, Menu, shell, ipcMain, safeStorage, clipboard } = require('electron');
const fs = require('fs');
const path = require('path');
const storeKeys = new Set(['api_key', 'refresh_token']);
const sessionMemory = new Map();

// Encrypt session values when supported; otherwise keep them only in memory.
function storeFile() { return path.join(app.getPath('userData'), 'session.enc.json'); }
function canPersist() {
  return safeStorage.isEncryptionAvailable() &&
    (process.platform !== 'linux' || safeStorage.getSelectedStorageBackend() !== 'basic_text');
}
function loadStore() {
  if (!canPersist()) return {};
  try { return JSON.parse(fs.readFileSync(storeFile(), 'utf8')); } catch { return {}; }
}
function saveStore(data) {
  fs.mkdirSync(path.dirname(storeFile()), { recursive: true });
  fs.writeFileSync(storeFile(), JSON.stringify(data), { mode: 0o600 });
}

ipcMain.handle('clipboard-read', () => clipboard.readText());
ipcMain.handle('clipboard-write', (_event, value) => { clipboard.writeText(String(value || '')); });

ipcMain.on('session-store', (event, action, key, value) => {
  if (!storeKeys.has(key)) { event.returnValue = null; return; }
  try {
    if (!canPersist()) {
      if (action === 'get') event.returnValue = sessionMemory.get(key) || '';
      else if (action === 'set') { sessionMemory.set(key, String(value || '')); event.returnValue = true; }
      else if (action === 'delete') { sessionMemory.delete(key); event.returnValue = true; }
      else event.returnValue = null;
      return;
    }
    const stored = loadStore();
    if (action === 'get') {
      event.returnValue = stored[key] ? safeStorage.decryptString(Buffer.from(stored[key], 'base64')) : '';
    } else if (action === 'set') {
      stored[key] = safeStorage.encryptString(String(value || '')).toString('base64');
      saveStore(stored); event.returnValue = true;
    } else if (action === 'delete') {
      delete stored[key]; saveStore(stored); event.returnValue = true;
    } else event.returnValue = null;
  } catch { event.returnValue = action === 'get' ? '' : false; }
});
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 720,
    backgroundColor: '#0f1115',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      devTools: true
    }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  if (isDev) win.webContents.openDevTools();
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => { createWindow(); Menu.setApplicationMenu(Menu.buildFromTemplate([{ label:'Edit', submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]}])); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });