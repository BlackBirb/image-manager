import { ipcRenderer } from 'electron'

export const minimize = () => ipcRenderer.send('minimizeWindow')
export const toggleMaximize = () => ipcRenderer.invoke('toggleWindowMaximize')
export const close = () => ipcRenderer.send('closeWindow')

export const getURLMime = (url: string): Promise<string> => ipcRenderer.invoke('getURLMime', url)
export const fetchImage = (url: string): Promise<string> => ipcRenderer.invoke('fetchImage', url)

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
