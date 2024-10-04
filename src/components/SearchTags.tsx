import { Chip, Stack } from '@mui/material'
import { useCallback, useContext } from 'react'
import { SearchStateContext } from 'src/state/searchState.context'
import { removeItemFromArray } from 'src/utils/utils'

export const SearchTags = () => {
  const {
    data: { searchedTags },
    api: { setSearchedTags },
  } = useContext(SearchStateContext)

  const handleRemoveTag = useCallback((deleteTag: string) => {
    setSearchedTags((prevTags) => removeItemFromArray(prevTags, deleteTag))
  }, [])

  return (
    <Stack direction="row" spacing={1}>
      {searchedTags?.map((tag) => {
        return <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
