import { SavedImageInfo } from 'electron/preload'
import { useEffect, useState } from 'react'

export const useElectronApi = (): ElectronAPI => window.api

export const useWindowMaximize = (): [boolean | null, () => Promise<void>] => {
  // this still doesn't know if it's maximized or not on launch...
  const [isMaximized, setIsMaximized] = useState(false)

  // This is hell, I miss my singals from vue
  useEffect(() => window.api.onWindowMaximize((evn) => setIsMaximized(evn)))

  const toggleMaximize = async () => setIsMaximized(await window.api.toggleMaximize())
  return [isMaximized, toggleMaximize]
}

export type SaveImageHandleType = [() => Promise<SavedImageInfo | false>, () => Promise<boolean>]

export const saveImage = (img: URL | File): SaveImageHandleType => {
  let handlePromise: Promise<IElectronAPI.TmpImgHandle | null> | null = null
  if (img instanceof URL) {
    handlePromise = window.api.prefetchImage(img.href)
  } else {
    handlePromise = img.arrayBuffer().then((arrBuff) => window.api.cacheImage(arrBuff, img.type))
  }

  const commit = async () => {
    const imageHandle = await handlePromise
    // it could return null from commitImage anyways
    if (!imageHandle) return false
    return window.api.commitImage(imageHandle)
  }

  const discard = async () => {
    const imageHandle = await handlePromise
    if (!imageHandle) return false
    return window.api.discardImage(imageHandle)
  }

  return [commit, discard]
}
