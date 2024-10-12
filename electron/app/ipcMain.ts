import path from 'node:path'

import { BrowserWindow, ipcMain } from 'electron'

import {
  cacheImage,
  discardPrefetchedImage,
  fetchURLMime,
  prefetchImage,
  SavedImageInfo,
  savePrefetchedImage,
  TmpImgHandle,
} from './imageService'

export const createIPCApi = (windows: WindowsManager): void => {
  ipcMain.on('minimizeWindow', (evn) => {
    const win = windows[windows[evn.sender.id].name]

    win.minimize()
  })

  ipcMain.handle('toggleWindowMaximize', async (evn) => {
    const win = windows[windows[evn.sender.id].name]

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }

    return win.isMaximized()
  })

  ipcMain.on('closeWindow', (evn) => {
    const win = windows[windows[evn.sender.id].name]

    win.close()
  })

  ipcMain.handle('getURLMime', async (_evn, url) => {
    const mime = await fetchURLMime(url)
    return mime
  })

  ipcMain.handle('prefetchImage', async (_evn, url: string): Promise<TmpImgHandle> => {
    const imageHandle = await prefetchImage(url)
    return imageHandle
  })

  ipcMain.handle('cacheImage', async (_evn, file: ArrayBuffer, mimeType: string): Promise<TmpImgHandle> => {
    const imageHandle = cacheImage(file, mimeType)
    return imageHandle
  })

  ipcMain.handle('commitImage', async (_evn, imageHandle: TmpImgHandle): Promise<SavedImageInfo> => {
    // TODO: Where to get dir from?
    const dir = path.join(process.env.APP_ROOT, 'tmp-image-dump')
    const imgInfo = await savePrefetchedImage(imageHandle, dir)
    return imgInfo
  })

  ipcMain.handle('discardImage', async (_evn, imageHandle: TmpImgHandle): Promise<boolean> => {
    await discardPrefetchedImage(imageHandle)
    return true
  })
}

export const addWindowIPCListeners = (win: BrowserWindow): void => {
  win.on('maximize', () => win.webContents.send('windowMaximize'))
  win.on('unmaximize', () => win.webContents.send('windowUnMaximize'))
}
