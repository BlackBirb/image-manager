import { Stack } from '@mui/material'
import { useContext } from 'react'
import { SearchTags } from 'src/components/SearchComponents/SearchTags'
import { SearchTagsBox } from 'src/components/SearchComponents/SearchTagsBox'
import { SearchStateContext } from 'src/state/searchState.context'

export const Search = () => {
  const {
    data: { searchedTags },
    api: { setSearchedTags },
  } = useContext(SearchStateContext)

  return (
    <Stack>
      <SearchTagsBox tags={searchedTags} setTags={setSearchedTags} />
      <SearchTags tags={searchedTags} setTags={setSearchedTags} />
    </Stack>
  )
}
