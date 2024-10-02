import { ipcMain } from "electron"


export const createIPCApi = (windows: WindowsManager): void => {

  ipcMain.on('minimizeWindow', () => {
    // TODO: Somehow get browser name?
    // I know it's just one window 99% of the time but i don't trust it
    for(const win of Object.values(windows)) {
      win.minimize()
    }
  })

  ipcMain.on('maximizeWindow', () => {
    for(const win of Object.values(windows)) {
      win.maximize()
    }
  })

  ipcMain.on('closeWindow', () => {
    for(const win of Object.values(windows)) {
      win.close()
    }
  })
}