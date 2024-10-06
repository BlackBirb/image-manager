import { Backdrop, Box, Fade, ListItemButton, ListItemText, Popper, Stack } from '@mui/material'
import { useCallback, useContext, useRef, useState } from 'react'
import { SearchStateContext } from 'src/state/searchState.context'

import { SearchList, SearchListItem, SearchListPaper } from './MiscComponents'
import { SearchInput } from './SearchInput'

function removeItemFromArray(arr: string[], item: string) {
  return arr.filter((t) => t !== item)
}

// Will come from db.
const mockTags = ['dragon', 'cat', 'dog']

export const SearchTagsBox = () => {
  const {
    api: { setSearchedTags },
  } = useContext(SearchStateContext)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOnTagClick = (clickedTag: string) => {
    setSearchedTags((prevTags) => {
      if (prevTags.find((t) => t === clickedTag)) {
        return removeItemFromArray(prevTags, clickedTag)
      }
      const newTags = [...prevTags]
      newTags.push(clickedTag)
      return newTags
    })
  }

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? 'search-popper' : undefined

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <SearchInput
        placeholder="Search tags"
        value={searchText}
        onChange={setSearchText}
        onClick={handleOpenList}
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
