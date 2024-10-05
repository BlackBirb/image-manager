import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { explodingObject } from 'src/utils/explodingObject'

type ClipboardStateContextType = {
  data: {
    pastedImage: File | null
  }
  api: {
    setPastedImage: React.Dispatch<React.SetStateAction<File | null>>
  }
}

export const ClipboardStateContext = createContext<ClipboardStateContextType>(
  explodingObject<ClipboardStateContextType>('ClipboardStateContext data no provided!'),
)

export const ClipboardStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [pastedImage, setPastedImage] = useState<File | null>(null)

  const contextData = useMemo(
    () => ({
      data: {
        pastedImage,
      },
      api: {
        setPastedImage,
      },
    }),
    [pastedImage, setPastedImage],
  )

  return <ClipboardStateContext.Provider value={contextData}>{children}</ClipboardStateContext.Provider>
}
