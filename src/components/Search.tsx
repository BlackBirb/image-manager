import { Stack } from '@mui/material'
import { SearchTags } from 'src/components//SearchTags'
import { SearchTagsBox } from 'src/components/SearchTagsBox'

export const Search = () => {
  return (
    <Stack alignItems="center" spacing={2}>
      <SearchTagsBox />
      <SearchTags />
    </Stack>
  )
}
