import {
  Backdrop,
  Box,
  Chip,
  Fade,
  IconButton,
  InputBase,
  InputBaseProps,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Stack,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useCallback, useContext, useRef, useState } from 'react'
import { SearchStateContext } from 'src/state/searchState.context'

const SearchBoxx = styled(InputBase, {
  name: 'SearchBoxx',
})<InputBaseProps>(() => ({
  width: '300px',
  zIndex: 2,
}))

const SearchList = styled(List, {
  name: 'SearchList',
})<InputBaseProps>(() => ({
  width: '100%',
  zIndex: 2,
  padding: 0,
}))

const SearchListItem = styled(ListItem, {
  name: 'SearchListItem',
})<InputBaseProps>(({ theme }) => ({
  '&.MuiListItem-root': {
    padding: 0,
    '&>.MuiButtonBase-root': {
      padding: theme.spacing(0.5),
    },
  },
}))

const SearchListPaper = styled(Paper, {
  name: 'SearchListPaper',
})<InputBaseProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  maxHeight: '300px',
}))

function removeItemFromArray(arr: string[], item: string) {
  return arr.filter((t) => t !== item)
}

const mockTags = ['dragon', 'cat', 'dog']

export const SearchBox = () => {
  const {
    api: { setSearchedTags },
  } = useContext(SearchStateContext)
  const searchWrapperRef = useRef<HTMLElement>(null)
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

  const handleRemoveTag = useCallback((deleteTag: string) => {
    setSearchedTags((prevTags) => removeItemFromArray(prevTags, deleteTag))
  }, [])

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const open = Boolean(anchorEl)
  const id = open ? 'search-popper' : undefined

  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchText(event?.target?.value)
  }, [])

  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Box ref={searchWrapperRef} onClick={handleOpenList}>
        <SearchBoxx
          placeholder="Search tags"
          inputProps={{ 'aria-label': 'Search tags' }}
          value={searchText}
          onChange={handleOnChange}
        />
        <IconButton type="button" aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>

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
          </Fade>
        )}
      </Popper>
    </Stack>
  )
}
