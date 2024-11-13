import { useMemo } from 'react'
import { saveImage, SaveImageHandleType } from 'src/hooks/useElectronApi'

export const useImageHandle = (pastedImage: File | URL | null): SaveImageHandleType => {
  return useMemo(() => {
    if (!pastedImage) return [() => Promise.resolve(false), () => Promise.resolve(false)]
    return saveImage(pastedImage)
  }, [pastedImage])
}
