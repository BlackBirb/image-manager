/// <reference types="vite/client" />

type ElectronAPI = import('../electron/preload').ElectronAPI

interface Window {
  api: ElectronAPI
}
