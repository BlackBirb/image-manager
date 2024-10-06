import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { explodingObject } from 'src/utils/explodingObject'

type ClipboardStateContextType = {
  data: {
    pastedImage: File | URL | null
    imagePreviewUrl?: string | null
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

  const contextData = useMemo(
    () => ({
      data: {
        pastedImage,
        imagePreviewUrl,
      },
      api: {
        setPastedImage,
      },
    }),
    [imagePreviewUrl, pastedImage, setPastedImage],
  )

  return <ClipboardStateContext.Provider value={contextData}>{children}</ClipboardStateContext.Provider>
}
