/// <reference types="vite/client" />

type ElectronAPI = import('../electron/preload').ElectronAPI

interface Window {
  api: ElectronAPI
}

// A bit pain but works
namespace IElectronAPI {
  type ImageSize = import('../electron/preload').ImageSize
  type SavedImageInfo = import('../electron/preload').SavedImageInfo
  type TmpImgHandle = import('../electron/preload').TmpImgHandle
}
