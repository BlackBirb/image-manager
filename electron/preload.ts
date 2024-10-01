import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('minimizeWindow')
})