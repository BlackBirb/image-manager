import { Stack } from '@mui/material'
import { SearchTags } from 'src/components/SearchTags'
import { SearchTagsBox } from 'src/components/SearchTagsBox'
import { Tag } from 'src/db/db'

type TagsInputProps = {
  tags: Tag[]
  addTag: (newTag: Tag) => void
  deleteTag: (index: number) => void
}

export const TagsInput = (props: TagsInputProps) => {
  return (
    <Stack alignItems="left" spacing={2}>
      <SearchTagsBox {...props} allowNew />
      <SearchTags {...props} />
    </Stack>
  )
}
