import { BrowserWindow, ipcMain } from 'electron'

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
}

export const addWindowIPCListeners = (win: BrowserWindow): void => {
  win.on('maximize', () => win.webContents.send('windowMaximize'))
  win.on('unmaximize', () => win.webContents.send('windowUnMaximize'))
}
