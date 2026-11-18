const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: async () => ipcRenderer.invoke('clipboard-read'),
    writeText: async (t) => ipcRenderer.invoke('clipboard-write', String(t || ''))
  },
  store: {
    get: (key) => ipcRenderer.sendSync('session-store', 'get', key),
    set: (key, value) => ipcRenderer.sendSync('session-store', 'set', key, value),
    delete: (key) => ipcRenderer.sendSync('session-store', 'delete', key)
  },
  env: { isElectron: true }
});
