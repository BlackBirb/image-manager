declare namespace NodeJS {
  interface ProcessEnv {
    /** ~/ */
    APP_ROOT: string,
    /** ~/electron */
    ELECTRON_ROOT: string,
    /** ~/src */
    REACT_ROOT: string
    /** ~/dist */
    RENDERED_DIST: string
  }
}

interface Window {
  ipcRenderer: import('electron').IpcRenderer
}