import { ipcMain } from 'electron'

export const createIPCApi = (windows: WindowsManager): void => {
  ipcMain.on('minimizeWindow', (evn) => {
    const win = windows[windows[evn.sender.id].name]

    win.minimize()
  })

  ipcMain.handle('toggleWindowMaximize', async (evn) => {
    const win = windows[windows[evn.sender.id].name]

    if (win.isMaximized()) {
      win.maximize()
    } else {
      win.restore()
    }

    return win.isMaximized()
  })

  ipcMain.on('closeWindow', (evn) => {
    const win = windows[windows[evn.sender.id].name]

    win.close()
  })
}
