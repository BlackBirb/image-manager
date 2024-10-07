import { Stack } from '@mui/material'
import { SearchTagsBox } from '../SearchTagsBox'
import { SearchTags } from '../SearchTags'


type TagsInputProps = {
  tags: string[]
  setTags: (newTags: string[]) => void
}

export const TagsInput = (props: TagsInputProps) => {
  const { tags, setTags } = props

  return (
    <Stack alignItems="left" spacing={2}>
      <SearchTagsBox
        tags={tags}
        setTags={setTags}
        allowNew
      />
      <SearchTags
        tags={tags}
        setTags={setTags}
      />
    </Stack>
  )
}
