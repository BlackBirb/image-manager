import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { SaveImageHandleType } from 'src/hooks/useElectronApi'
import { useImageHandle } from 'src/hooks/useImageHandle'
import { explodingObject } from 'src/utils/explodingObject'

type ClipboardStateContextType = {
  data: {
    pastedImage: File | URL | null
    imagePreviewUrl?: string | null
    imageHandle: SaveImageHandleType
  }
  api: {
    setPastedImage: React.Dispatch<React.SetStateAction<File | URL | null>>
  }
}

export const ClipboardStateContext = createContext<ClipboardStateContextType>(
  explodingObject<ClipboardStateContextType>('ClipboardStateContext data no provided!'),
)

export const ClipboardStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [pastedImage, setPastedImage] = useState<File | URL | null>(null)

  const imageHandle = useImageHandle(pastedImage)

  const imagePreviewUrl = useMemo(() => {
    if (!pastedImage) return
    let imageBlob = null
    try {
      if (pastedImage instanceof File) imageBlob = URL.createObjectURL(pastedImage)
      // Apparently it works? I expected cors but no, all the sources I checked work fine
      else imageBlob = pastedImage.href
    } catch {
      console.error('Failed to create preview of the pasted file!')
    }
    return imageBlob
  }, [pastedImage])

  // const {
  //   data: { contentIdToEdit, contentDataToEdit },
  //   api: { setContentIdToEdit },
  // } = useContext(SelectionStateContext)

  // check if the imageHandle hash is the same and if yes.
  // imageHandle.commit returns info.hash
  // getImage and if image exists setContentIdToEdit the id
  // and set pastedImage to null
  // call discard to remove the image from memory

  const contextData = useMemo(
    () => ({
      data: {
        pastedImage,
        imagePreviewUrl,
        imageHandle,
      },
      api: {
        setPastedImage,
      },
    }),
    [imagePreviewUrl, pastedImage, imageHandle, setPastedImage],
  )

  return <ClipboardStateContext.Provider value={contextData}>{children}</ClipboardStateContext.Provider>
}
