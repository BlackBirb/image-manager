import { ipcRenderer } from 'electron'

export const minimize = () => ipcRenderer.send('minimizeWindow')
export const toggleMaximize = () => ipcRenderer.invoke('toggleWindowMaximize')
export const close = () => ipcRenderer.send('closeWindow')

export const onWindowMaximize = (cb: (maximized: boolean) => void) => {
  const onMaximize = () => cb(true)
  const onUnMaximize = () => cb(false)

  ipcRenderer.on('windowMaximize', onMaximize)
  ipcRenderer.on('windowUnMaximize', onUnMaximize)

  // cleanup because react is silly like that
  return () => {
    ipcRenderer.removeListener('windowMaximize', onMaximize)
    ipcRenderer.removeListener('windowUnMaximize', onUnMaximize)
  }
}
