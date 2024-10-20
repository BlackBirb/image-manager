import { Chip, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Tag } from 'src/db/db'

type SearchTagsProps = {
  tags: Tag[]
  setTags: (newTags: Tag[]) => void
}

export const SearchTags = (props: SearchTagsProps) => {
  const { tags, setTags } = props

  const handleRemoveTag = useCallback(
    (deleteTag: Tag) => {
      if (setTags) {
        setTags(tags.filter((t) => t.name !== deleteTag.name))
      }
    },
    [tags],
  )

  // These will be styled differently from the ones in the AddEditForm Chips
  return (
    <Stack direction="row" spacing={1}>
      {tags?.map((tag) => {
        // new tags might not have an ID!
        return <Chip key={tag.name} label={tag.name} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
