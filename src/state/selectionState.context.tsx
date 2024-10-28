import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { explodingObject } from 'src/utils/explodingObject'

type SelectionStateContextType = {
  data: {
    selectedImageId: string
  }
  api: {
    setSelectedImageId: React.Dispatch<React.SetStateAction<string>>
  }
}

export const SelectionStateContext = createContext<SelectionStateContextType>(
  explodingObject<SelectionStateContextType>('SelectionStateContext data no provided!'),
)

export const SelectionStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [selectedImageId, setSelectedImageId] = useState('')

  const contextData = useMemo(
    () => ({
      data: {
        selectedImageId,
      },
      api: {
        setSelectedImageId,
      },
    }),
    [selectedImageId, setSelectedImageId],
  )

  return <SelectionStateContext.Provider value={contextData}>{children}</SelectionStateContext.Provider>
}
