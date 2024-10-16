import { Stack } from '@mui/material'
import { SearchTags } from 'src/components/SearchTags'
import { SearchTagsBox } from 'src/components/SearchTagsBox'
import { Tag } from 'src/db/db'

type TagsInputProps = {
  tags: Tag[]
  setTags: (newTags: Tag[]) => void
}

export const TagsInput = (props: TagsInputProps) => {
  const { tags, setTags } = props

  return (
    <Stack alignItems="left" spacing={2}>
      <SearchTagsBox tags={tags} setTags={setTags} allowNew />
      <SearchTags tags={tags} setTags={setTags} />
    </Stack>
  )
}
