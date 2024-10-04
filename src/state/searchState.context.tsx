import { createContext, PropsWithChildren, useMemo, useState } from 'react'
import { explodingObject } from 'src/utils/explodingObject'

type SearchStateContextType = {
  data: {
    searchedTags: string[]
  }
  api: {
    setSearchedTags: React.Dispatch<React.SetStateAction<string[]>>
  }
}

export const SearchStateContext = createContext<SearchStateContextType>(
  explodingObject<SearchStateContextType>('SearchStateContext data no provided!'),
)

export const SearchStateContextProvider = (props: PropsWithChildren<Record<any, unknown>>) => {
  const { children } = props
  const [searchedTags, setSearchedTags] = useState<string[]>([])

  const contextData = useMemo(
    () => ({
      data: {
        searchedTags,
      },
      api: {
        setSearchedTags,
      },
    }),
    [searchedTags, setSearchedTags],
  )

  return <SearchStateContext.Provider value={contextData}>{children}</SearchStateContext.Provider>
}
