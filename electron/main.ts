import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, BrowserWindow } from 'electron'

import { initialSetup } from './app/initialSetup'
import { addWindowIPCListeners, createIPCApi } from './app/ipcMain'
import { getPersistentStore } from './app/persistentStore'
import { createProtocolHandlers } from './app/protocol'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

process.env.ELECTRON_ROOT = path.join(process.env.APP_ROOT, 'electron')
process.env.ELECTRON_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
process.env.REACT_ROOT = path.join(process.env.APP_ROOT, 'src')
process.env.RENDERED_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : process.env.RENDERED_DIST

process.env.STORAGE_PATH = path.join(app.getPath('userData'), 'storage')

const windows: WindowsManager = {}

type IDontLikeItBeingRed = {
  env: { DEV: boolean }
}

const createWindow = async (name: string, url: string | null = null): Promise<BrowserWindow> => {
  if (name in windows) throw new Error("Idk honestly we'll worry when we get here")

  const persistentStore = await getPersistentStore()
  if (!persistentStore[name]) {
    // Defaults
    persistentStore[name] = {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
      isMaximized: false,
    }
  }

  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(process.env.ELECTRON_DIST, 'preload.mjs'),
    },
    title: name,
    x: persistentStore[name].x,
    y: persistentStore[name].y,
    width: persistentStore[name].width,
    height: persistentStore[name].height,
    frame: false,
    show: false,
  })

  if (persistentStore[name].isMaximized) win.maximize()

  if (url) {
    win.loadURL(url)
  } else if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.RENDERED_DIST, 'index.html'))
  }

  const saveWindowPosition = () => {
    persistentStore[name].isMaximized = win.isMaximized()

    if (persistentStore[name].isMaximized) return

    const bounds = win.getBounds()
    persistentStore[name] = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    }
  }
  win.on('resized', saveWindowPosition)
  win.on('moved', saveWindowPosition)
  win.on('maximize', saveWindowPosition)
  win.on('unmaximize', saveWindowPosition)

  const windowShown = new Promise((resolve) => {
    win.once('ready-to-show', () => {
      win.show()
      resolve(true)
    })
  })

  // fight me
  if (((<unknown>import.meta) as IDontLikeItBeingRed).env.DEV) {
    win.webContents.openDevTools() // I need this Black!
  } else {
    // Prevent opening new windows by rendered in PROD
    win.webContents.setWindowOpenHandler(() => ({
      action: 'deny',
    }))
  }

  await windowShown

  windows[name] = win
  windows[win.id] = {
    name,
  }

  addWindowIPCListeners(win)

  return win
}

app.on('window-all-closed', () => {
  app.quit()
  for (const winName in windows) {
    delete windows[winName]
  }
})

initialSetup()
  .then(() => Promise.all([app.whenReady(), getPersistentStore()]))
  .then(() => {
    createWindow('main')
    createIPCApi(windows)
    createProtocolHandlers()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow('main')
      }
    })
  })
