const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
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
  win.loadFile(path.join(__dirname, isDev ? 'src' : 'dist', 'index.html'));
  if (isDev) win.webContents.openDevTools();
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(() => { createWindow(); Menu.setApplicationMenu(Menu.buildFromTemplate([{ label:'Edit', submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]}])); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });