/// <reference types="vite/client" />

// Idk how but there should be a way to derive this from preload.ts
interface ElectronAPI {
  minimize: () => void
  maximize: () => void
  close: () => void
}

interface Window {
  api: ElectronAPI
}
