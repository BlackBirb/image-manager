import { Stack } from '@mui/material'
import { useContext } from 'react'
import { SearchTags } from 'src/components/SearchTags'
import { SearchTagsBox } from 'src/components/SearchTagsBox'
import { SearchStateContext } from 'src/state/searchState.context'

export const Search = () => {
  const {
    data: { searchedTags },
    api: { setSearchedTags },
  } = useContext(SearchStateContext)

  return (
    <Stack spacing={2}>
      <SearchTagsBox tags={searchedTags} setTags={setSearchedTags} />
      <SearchTags tags={searchedTags} setTags={setSearchedTags} />
    </Stack>
  )
}
