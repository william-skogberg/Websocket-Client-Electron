const { contextBridge, clipboard } = require('electron');

const memoryStore = new Map();

contextBridge.exposeInMainWorld('electron', {
  clipboard: {
    readText: async () => clipboard.readText(),
    writeText: async (t) => clipboard.writeText(String(t || ''))
  },
  store: {
    get: (k) => memoryStore.get(k),
    set: (k, v) => memoryStore.set(k, v),
    delete: (k) => memoryStore.delete(k)
  },
  env: { isElectron: true }
});