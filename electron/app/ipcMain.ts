import { BrowserWindow, ipcMain } from 'electron'

import { fetchImage, fetchURLMime } from './imageService'

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

  ipcMain.handle('fetchImage', async (_evn, url) => {
    const mime = await fetchImage(url)
    return mime
  })
}

export const addWindowIPCListeners = (win: BrowserWindow): void => {
  win.on('maximize', () => win.webContents.send('windowMaximize'))
  win.on('unmaximize', () => win.webContents.send('windowUnMaximize'))
}
