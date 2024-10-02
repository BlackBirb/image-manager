import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { getPersistentStore } from './app/persistentStore'
import { initialSetup } from './app/initialSetup'
import { createIPCApi } from './app/ipcMain'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

process.env.ELECTRON_ROOT = path.join(process.env.APP_ROOT, 'electron')
process.env.ELECTRON_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
process.env.REACT_ROOT = path.join(process.env.APP_ROOT, 'src')
process.env.RENDERED_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : process.env.RENDERED_DIST

process.env.STORAGE_PATH = path.join(app.getPath('userData'), 'storage')

const windows: WindowsManager = {}

const createWindow = async (name: string, url: string | null = null) => {
  if(name in windows)
    throw new Error("Idk honestly we'll worry when we get here")

  const persistentStore = await getPersistentStore()
  if(!persistentStore[name]) {
    // Defaults
    persistentStore[name] = {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
      isMaximized: false
    }
  }

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(process.env.ELECTRON_DIST, 'preload.mjs')
    },
    title: name,
    x: persistentStore[name].x,
    y: persistentStore[name].y,
    width: persistentStore[name].width,
    height: persistentStore[name].height,
    frame: false,
    show: false
  })

  if(persistentStore[name].isMaximized)
    win.maximize()

  if(url) {
    win.loadURL(url)
  } else if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.RENDERED_DIST, 'index.html'))
  }

  win.on('resize', () => {
    persistentStore[name].isMaximized = win.isMaximized()

    if(persistentStore[name].isMaximized) return

    const bounds = win.getBounds()
    persistentStore[name] = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    }
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  if(import.meta.env.DEV) {
    win.webContents.openDevTools()
  } else {
    // Prevent opening new windows by rendered in PROD
    win.webContents.setWindowOpenHandler(() => ({
      action: 'deny'
    }))
  }

  windows[name] = win
}

app.on('window-all-closed', () => {
  app.quit()
  for(const winName in windows) {
    delete windows[winName]
  }
})

initialSetup()
  .then(() =>
    Promise.all([
      app.whenReady(),
      getPersistentStore()
    ])
  )
  .then(() => {
    createWindow('main')
    createIPCApi(windows)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow('main')
      }
    })
  })
