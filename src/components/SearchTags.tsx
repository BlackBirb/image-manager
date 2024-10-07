import { Chip, Stack } from '@mui/material'
import { useCallback } from 'react'
import { removeItemFromArray } from 'src/utils/utils'

type SearchTagsProps = {
  tags: string[]
  setTags: (newTags: string[]) => void
}

export const SearchTags = (props: SearchTagsProps) => {
  const { tags, setTags } = props

  const handleRemoveTag = useCallback(
    (deleteTag: string) => {
      setTags(removeItemFromArray(tags, deleteTag))
    },
    [tags],
  )

  return (
    <Stack direction="row" spacing={1}>
      {tags?.map((tag) => {
        return <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
      })}
    </Stack>
  )
}
