import { contextBridge } from 'electron'

import * as ipcRendererApi from './preload/ipcRenderer'

const api = {
  ...ipcRendererApi,
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
