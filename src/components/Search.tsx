import { Stack } from '@mui/material'
import { useContext } from 'react'
import { SearchTags } from 'src/components/SearchTags'
import { SearchTagsBox } from 'src/components/SearchTagsBox'
import { Tag } from 'src/db/db'
import { SearchStateContext } from 'src/state/searchState.context'

export const Search = () => {
  const {
    data: { searchedTags },
    api: { setSearchedTags },
  } = useContext(SearchStateContext)

  const addTag = (tag: Tag) => {
    const newTags = [...searchedTags]
    newTags.push(tag)
    return setSearchedTags(newTags)
  }

  const deleteTag = (idx: number) => {
    const newTags = [...searchedTags]
    newTags.splice(idx, 1)
    return setSearchedTags(newTags)
  }

  return (
    <Stack>
      <SearchTagsBox tags={searchedTags} addTag={addTag} deleteTag={deleteTag} />
      <SearchTags tags={searchedTags} deleteTag={deleteTag} />
    </Stack>
  )
}
