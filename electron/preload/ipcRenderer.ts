import { ipcRenderer } from 'electron'

export const minimize = () => ipcRenderer.send('minimizeWindow')
export const toggleMaximize = () => ipcRenderer.invoke('toggleWindowMaximize')
export const close = () => ipcRenderer.send('closeWindow')
