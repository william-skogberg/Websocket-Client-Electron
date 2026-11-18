const { contextBridge, clipboard, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: async () => clipboard.readText(),
    writeText: async (t) => clipboard.writeText(String(t || ''))
  },
  store: {
    get: (key) => ipcRenderer.sendSync('session-store', 'get', key),
    set: (key, value) => ipcRenderer.sendSync('session-store', 'set', key, value),
    delete: (key) => ipcRenderer.sendSync('session-store', 'delete', key)
  },
  env: { isElectron: true }
});
