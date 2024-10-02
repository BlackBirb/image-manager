import { ipcRenderer } from "electron"

export const minimize = () => ipcRenderer.send('minimizeWindow')
export const maximize = () => ipcRenderer.send('maximizeWindow')
export const close = () => ipcRenderer.send('closeWindow')
