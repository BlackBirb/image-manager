import { Backdrop, Box, Fade, ListItemButton, ListItemText, Popper, Stack } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { SearchList, SearchListItem, SearchListPaper } from './MiscComponents'
import { SearchInput } from './SearchInput'

type SearchTagsBoxProps = {
  tags: string[]
  setTags: (newTags: string[]) => void
  allowNew?: boolean
}

function removeItemFromArray(arr: string[], item: string) {
  return arr.filter((t) => t !== item)
}

// Will come from db.
const mockTags = ['dragon', 'cat', 'dog']

export const SearchTagsBox = (props: SearchTagsBoxProps) => {
  const { tags, setTags, allowNew } = props
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  // This will probably go to the DB handler who will do the filtering
  // and return the list of tags
  const [searchText, setSearchText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [listIndex, setListIndex] = useState(-1)

  // Probably will be filtered somewhere else. TBD
  const filteredTags = useMemo(() => {
    return mockTags.filter((t) => !tags.includes(t))
  }, [tags])

  const handleOnTagClick = useCallback(
    (clickedTag: string) => {
      setSearchText('')

      if (tags.includes(clickedTag)) {
        return setTags(removeItemFromArray(tags, clickedTag))
      }
      const newTags = [...tags]
      newTags.push(clickedTag)
      return setTags(newTags)
    },
    [tags, setTags],
  )

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  // I will want to make this when we arrow down, to tabIndex select the
  // options in the list. I can probably use the stupid mui autocomplete
  // but i hate it, so will think of something DIY.
  const handleEnter = useCallback(() => {
    // We assume they're sorted by best match
    if (listIndex > -1) {
      handleOnTagClick(filteredTags[listIndex])
      return
    }

    if (allowNew) {
      handleOnTagClick(searchText)
      return
    }
  }, [allowNew, listIndex, searchText, filteredTags, handleOnTagClick])

  const handleOnArrowUpDown = useCallback(
    (direction: 'ArrowUp' | 'ArrowDown') => {
      if (!searchText) return
      if (direction === 'ArrowUp') {
        setListIndex((prevIndex) => {
          if (listIndex > -1) {
            return prevIndex - 1
          }
          return prevIndex
        })
      }
      if (direction === 'ArrowDown') {
        setListIndex((prevIndex) => {
          if (listIndex < filteredTags.length - 1) {
            return prevIndex + 1
          }
          return prevIndex
        })
      }
    },
    [searchText, filteredTags.length, listIndex],
  )

  useEffect(() => {
    setListIndex(-1)
  }, [searchText])

  const open = searchText.length > 0 && Boolean(anchorEl)
  const id = open ? 'search-popper' : undefined

  return (
    <Stack direction="row" alignItems="center">
      <SearchInput
        placeholder="Search tags"
        value={searchText}
        onChange={setSearchText}
        onClick={handleOpenList}
        onEnter={handleEnter}
        onArrowUpDown={handleOnArrowUpDown}
        ref={searchWrapperRef}
        withIcon
      />

      <Backdrop sx={{ backgroundColor: 'transparent', zIndex: 1 }} open={open} onClick={handleCloseSearch} />
      <Popper
        id={id}
        open={open}
        anchorEl={searchWrapperRef.current}
        transition
        placement="bottom-start"
        sx={{
          zIndex: 2,
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box mt={1}>
              <SearchListPaper
                sx={{
                  width: searchWrapperRef?.current?.offsetWidth || 'auto',
                }}
              >
                <SearchList dense>
                  {filteredTags.map((tag, index) => {
                    return (
                      <SearchListItem key={tag}>
                        <ListItemButton
                          selected={listIndex === index}
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
            </Box>
          </Fade>
        )}
      </Popper>
    </Stack>
  )
}
