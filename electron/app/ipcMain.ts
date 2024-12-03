import { BrowserWindow, dialog, ipcMain, nativeImage, clipboard } from 'electron'

import {
  cacheImage,
  discardPrefetchedImage,
  fetchURLMime,
  prefetchImage,
  SavedImageInfo,
  savePrefetchedImage,
  setOutputPath,
  TmpImgHandle,
  resolveImageFile,
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

  ipcMain.handle('getURLMime', async (evn, url) => {
    try {
      const mime = await fetchURLMime(url)
      return mime
    } catch (err) {
      evn.sender.send('error', err)
      return null
    }
  })

  ipcMain.handle('prefetchImage', async (evn, url: string): Promise<TmpImgHandle | null> => {
    try {
      const imageHandle = await prefetchImage(url)
      return imageHandle
    } catch (err) {
      evn.sender.send('error', err)
      return null
    }
  })

  ipcMain.handle('cacheImage', async (evn, file: ArrayBuffer, mimeType: string): Promise<TmpImgHandle | null> => {
    try {
      const imageHandle = cacheImage(file, mimeType)
      return imageHandle
    } catch (err) {
      evn.sender.send('error', err)
      return null
    }
  })

  ipcMain.handle('commitImage', async (evn, imageHandle: TmpImgHandle): Promise<SavedImageInfo | false> => {
    try {
      const imgInfo = await savePrefetchedImage(imageHandle)
      return imgInfo
    } catch (err) {
      evn.sender.send('error', err)
      return false
    }
  })

  ipcMain.handle('discardImage', async (evn, imageHandle: TmpImgHandle): Promise<boolean> => {
    try {
      await discardPrefetchedImage(imageHandle)
      return true
    } catch (err) {
      evn.sender.send('error', err)
      return false
    }
  })

  ipcMain.on('copyImageClipboard', (_evn, imageHash, ext) => {
    const imgPath = resolveImageFile(imageHash, ext, false)
    // TODO: This will blow up on non-images (gifs/videos)
    const image = nativeImage.createFromPath(imgPath)
    clipboard.write({
      image,
    })
  })

  ipcMain.handle('openPathChooser', async (_evn): Promise<Electron.OpenDialogReturnValue> => {
    return await dialog.showOpenDialog({
      properties: ['openDirectory'],
    })
  })

  ipcMain.handle('setImageStorePath', async (evn, imgPath: string): Promise<boolean> => {
    try {
      await setOutputPath(imgPath)
      return true
    } catch (err) {
      evn.sender.send('error', err)
      return false
    }
  })
}

export const addWindowIPCListeners = (win: BrowserWindow): void => {
  win.on('maximize', () => win.webContents.send('windowMaximize'))
  win.on('unmaximize', () => win.webContents.send('windowUnMaximize'))
}
