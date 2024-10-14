import { BrowserWindow, dialog, ipcMain } from 'electron'

import {
  cacheImage,
  discardPrefetchedImage,
  fetchURLMime,
  prefetchImage,
  SavedImageInfo,
  savePrefetchedImage,
  setOutputPath,
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

  ipcMain.handle('prefetchImage', async (evn, url: string): Promise<TmpImgHandle> => {
    try {
      const imageHandle = await prefetchImage(url)
      return imageHandle
    } catch (err: string) {
      evn.sender.send('error', err)
    }
  })

  ipcMain.handle('cacheImage', async (_evn, file: ArrayBuffer, mimeType: string): Promise<TmpImgHandle> => {
    const imageHandle = cacheImage(file, mimeType)
    return imageHandle
  })

  ipcMain.handle('commitImage', async (_evn, imageHandle: TmpImgHandle): Promise<SavedImageInfo> => {
    const imgInfo = await savePrefetchedImage(imageHandle)
    return imgInfo
  })

  ipcMain.handle('discardImage', async (_evn, imageHandle: TmpImgHandle): Promise<boolean> => {
    await discardPrefetchedImage(imageHandle)
    return true
  })

  ipcMain.handle('openPathChooser', async (_evn): Promise<Electron.OpenDialogReturnValue> => {
    return await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
  })

  ipcMain.on('setImageStorePath', async (evn, imgPath: string): Promise<void> => {
    try {
      await setOutputPath(imgPath)
    } catch (err) {
      evn.sender.send('error', err)
    }
  })
}

export const addWindowIPCListeners = (win: BrowserWindow): void => {
  win.on('maximize', () => win.webContents.send('windowMaximize'))
  win.on('unmaximize', () => win.webContents.send('windowUnMaximize'))
}
