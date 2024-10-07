import { Backdrop, Box, Fade, ListItemButton, ListItemText, Popper, Stack } from '@mui/material'
import { useCallback, useRef, useState } from 'react'

import { SearchList, SearchListItem, SearchListPaper } from './MiscComponents'
import { SearchInput } from './SearchInput'

type SearchTagsBoxProps = {
  tags: string[]
  setTags: (newTags: string[]) => void,
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
  const [searchText, setSearchText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOnTagClick = (clickedTag: string) => {
    setSearchText('')

    if (tags.includes(clickedTag)) {
      return setTags(removeItemFromArray(tags, clickedTag))
    }
    const newTags = [...tags]
    newTags.push(clickedTag)
    return setTags(newTags)
  }

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleEnter = () => {
    console.log(allowNew, mockTags[0])
    if(allowNew) {
      handleOnTagClick(searchText)
      return
    }
    // We assyme they're sorted by best match
    handleOnTagClick(mockTags[0])
  }

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
            </Box>
          </Fade>
        )}
      </Popper>
    </Stack>
  )
}
