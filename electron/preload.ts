import { contextBridge } from "electron";

import * as ipcRendererApi from './preload/ipcRenderer'

contextBridge.exposeInMainWorld('api', {
  ...ipcRendererApi
})