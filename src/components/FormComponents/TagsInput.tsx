import { Chip, ListItemButton, ListItemText, Popover, Stack, Typography } from '@mui/material'
import { SearchInput } from '../SearchInput'
import { useCallback, useRef, useState } from 'react'
import { SearchList, SearchListItem, SearchListPaper } from '../MiscComponents'
import { removeItemFromArray } from 'src/utils/utils'

const mockTags = ['dragon', 'cat', 'dog']

type TagsInputProps = {
  tags: string[]
  setTags: (newTags: string[]) => void
}

export const TagsInput = (props: TagsInputProps) => {
  const { tags, setTags } = props
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [searchTags, setSearchTags] = useState('')

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleOnTagClick = useCallback((clickedTag: string) => {
    let newTags = [...tags]
    if (newTags.find((t) => t === clickedTag)) {
      newTags = removeItemFromArray(newTags, clickedTag)
    } else {
      newTags.push(clickedTag)
    }
    setTags(newTags)
  }, [])

  const handleOnRemoveTag = useCallback((tag: string) => {
    let newTags = [...tags]
    if (newTags.find((t) => t === tag)) {
      newTags = removeItemFromArray(newTags, tag)
    }
    setTags(newTags)
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? 'search-popper' : undefined
  return (
    <Stack>
      <SearchInput
        value={searchTags}
        onChange={setSearchTags}
        placeholder="Search tags"
        onClick={handleOpenList}
        ref={searchWrapperRef}
      />
      <Stack direction="row" spacing={1}>
        {tags.map((t) => {
          return <Chip key={t} label={t} onDelete={() => handleOnRemoveTag(t)} />
        })}
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={searchWrapperRef.current}
        onClose={handleCloseSearch}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <SearchListPaper
          sx={{
            minWidth: 200,
          }}
        >
          <SearchList dense>
            {mockTags.map((tag) => {
              return (
                <SearchListItem key={tag}>
                  <ListItemButton
                    onClick={() => {
                      handleOnTagClick(tag)
                    }}
                  >
                    <ListItemText primary={tag} />
                  </ListItemButton>
                </SearchListItem>
              )
            })}
          </SearchList>
        </SearchListPaper>
      </Popover>
    </Stack>
  )
}
