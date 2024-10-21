import { Backdrop, Box, Fade, ListItemButton, ListItemText, Popper, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SearchList, SearchListItem, SearchListPaper } from 'src/components/MiscComponents'
import { SearchInput } from 'src/components/SearchInput'
import { TagName } from 'src/db/db'
import { searchTags } from 'src/db/useDb'
import { tag } from 'src/utils/utils'

type FormSearchTagProps = {
  onAddTag: (newTag: TagName) => void
}

// This will be styled differently from the Main Search of tags
export const FormSearchTag = (props: FormSearchTagProps) => {
  const { onAddTag } = props

  const [isFocused, setIsFocused] = useState(false)
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  // This will probably go to the DB handler who will do the filtering
  // and return the list of tags
  const [searchText, setSearchTextState] = useState<TagName>('' as TagName)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [listIndex, setListIndex] = useState(-1)

  const setSearchText = (str: string) => setSearchTextState(tag(str))

  // Can't really make it a memo, cuz it kinda is but eslint complains.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredTags = useLiveQuery(() => searchTags(searchText), [searchText])?.map((item) => item.name) || []

  const handleOnTagClick = useCallback(
    (clickedTag: TagName) => {
      setSearchText('')
      onAddTag(clickedTag)
    },
    [onAddTag],
  )

  const handleOpenList = useCallback(() => {
    setAnchorEl(searchWrapperRef.current)
  }, [])

  const handleCloseSearch = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleEnter = useCallback(async () => {
    // We assume they're sorted by best match
    if (listIndex > -1) {
      handleOnTagClick(filteredTags[listIndex])
      return
    }

    // avoid adding empty "custom" tags
    if (searchText.length < 1) return

    // enter can select top result if it matches or new ones aren't allowed
    if (filteredTags[0] && filteredTags[0] === searchText) {
      return handleOnTagClick(filteredTags[0])
    }

    handleOnTagClick(searchText)
  }, [listIndex, searchText, filteredTags, handleOnTagClick])

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

  const open = isFocused && Boolean(anchorEl)
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
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
                  {filteredTags.map((itemTag, index) => {
                    return (
                      <SearchListItem key={itemTag}>
                        <ListItemButton
                          selected={listIndex === index}
                          onClick={() => {
                            handleOnTagClick(itemTag)
                          }}
                        >
                          <ListItemText primary={itemTag} />
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
