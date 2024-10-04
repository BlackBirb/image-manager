import { Stack } from '@mui/material'
import { SearchTags } from 'src/components//SearchTags'
import { SearchBox } from 'src/components/SearchBox'

export const Search = () => {
  return (
    <Stack alignItems="center" spacing={2}>
      <SearchBox />
      <SearchTags />
    </Stack>
  )
}
