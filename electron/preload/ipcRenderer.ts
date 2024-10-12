import { ipcRenderer } from 'electron'

import { SavedImageInfo, TmpImgHandle } from '../preload'

export const minimize = () => ipcRenderer.send('minimizeWindow')
export const toggleMaximize = () => ipcRenderer.invoke('toggleWindowMaximize')
export const close = () => ipcRenderer.send('closeWindow')

export const getURLMime = (url: string): Promise<string> => ipcRenderer.invoke('getURLMime', url)
export const prefetchImage = (url: string): Promise<TmpImgHandle> => ipcRenderer.invoke('prefetchImage', url)
export const cacheImage = (file: ArrayBuffer, mimeType: string): Promise<TmpImgHandle> =>
  ipcRenderer.invoke('cacheImage', file, mimeType)
export const commitImage = (handle: TmpImgHandle): Promise<SavedImageInfo> => ipcRenderer.invoke('commitImage', handle)
export const discardImage = (handle: TmpImgHandle): Promise<boolean> => ipcRenderer.invoke('discardImage', handle)

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
