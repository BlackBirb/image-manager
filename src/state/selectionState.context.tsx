import { useLiveQuery } from 'dexie-react-hooks'
import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { Content } from 'src/db/db'
import { getContentWithId } from 'src/db/useDB'
import { explodingObject } from 'src/utils/explodingObject'

type SelectionStateContextType = {
  data: {
    selectedImageId: string
    contentIdToEdit: string
    contentDataToEdit: Content | undefined
  }
  api: {
    setSelectedImageId: React.Dispatch<React.SetStateAction<string>>
    setContentIdToEdit: React.Dispatch<React.SetStateAction<string>>
  }
}

export const SelectionStateContext = createContext<SelectionStateContextType>(
  explodingObject<SelectionStateContextType>('SelectionStateContext data no provided!'),
)

export const SelectionStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [selectedImageId, setSelectedImageId] = useState('')
  const [contentIdToEdit, setContentIdToEdit] = useState('')

  const contentDataToEdit = useLiveQuery(() => getContentWithId(contentIdToEdit), [contentIdToEdit])
  console.log('contentDataToEdit: ', contentDataToEdit)

  const contextData = useMemo(
    () => ({
      data: {
        selectedImageId,
        contentIdToEdit,
        contentDataToEdit,
      },
      api: {
        setSelectedImageId,
        setContentIdToEdit,
      },
    }),
    [selectedImageId, contentIdToEdit, contentDataToEdit, setSelectedImageId, setContentIdToEdit],
  )

  return <SelectionStateContext.Provider value={contextData}>{children}</SelectionStateContext.Provider>
}
