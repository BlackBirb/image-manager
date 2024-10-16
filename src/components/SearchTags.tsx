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
      setTags(tags.filter((t) => t.id !== deleteTag.id))
    },
    [tags],
  )

  return (
    <Stack direction="row" spacing={1}>
      {tags?.map((tag) => {
        return <Chip key={tag.id} label={tag.name} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
