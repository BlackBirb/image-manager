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
      setTags(tags.filter((t) => t.id !== deleteTag.id || t.name !== deleteTag.name))
    },
    [tags],
  )

  return (
    <Stack direction="row" spacing={1}>
      {tags?.map((tag) => {
        // new tags might not have an ID!
        return <Chip key={tag.id || tag.name} label={tag.name} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
