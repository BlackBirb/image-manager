declare namespace NodeJS {
  interface ProcessEnv {
    /** ~/ */
    APP_ROOT: string

    /** ~/electron */
    ELECTRON_ROOT: string

    /** ~/dist-electron */
    ELECTRON_DIST: string

    /** ~/src */
    REACT_ROOT: string

    /** ~/dist */
    RENDERED_DIST: string

    /** ~/public | RENDERED_DIST */
    VITE_PUBLIC: string

    /** %appdata%/~/storage */
    STORAGE_PATH: string
  }
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
}

type BrowserWindowSettings = {
  name: string
}

// It works, fight me
interface WindowsManager {
  [id: number]: BrowserWindowSettings
  [key: string]: import('electron').BrowserWindow
}
