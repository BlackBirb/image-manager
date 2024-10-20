import { Chip, Stack } from '@mui/material'
import { useCallback } from 'react'
import { Tag } from 'src/db/db'

type SearchTagsProps = {
  tags: Tag[]
  deleteTag: (index: number) => void
}

export const SearchTags = (props: SearchTagsProps) => {
  const { tags, deleteTag } = props

  const handleRemoveTag = useCallback(
    (deletedTag: Tag) => {
      deleteTag(tags.findIndex((t) => t.name === deletedTag.name))
    },
    [tags, deleteTag],
  )

  return (
    <Stack direction="row" spacing={1}>
      {tags?.map((tag) => {
        // new tags might not have an ID!
        return <Chip key={tag.name} label={tag.name} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
