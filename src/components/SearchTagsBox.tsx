import { Backdrop, Box, Fade, ListItemButton, ListItemText, Popper, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { db, Tag, TagName } from 'src/db/db'
import { getTagAtIndex, searchTags } from 'src/db/useDb'
import { tag } from 'src/utils/utils'

import { SearchList, SearchListItem, SearchListPaper } from './MiscComponents'
import { SearchInput } from './SearchInput'

type SearchTagsBoxProps = {
  tags: Tag[]
  setTags: (newTags: Tag[]) => void
  allowNew?: boolean
}

export const SearchTagsBox = (props: SearchTagsBoxProps) => {
  const { tags, setTags, allowNew } = props

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
  const filteredTags = useLiveQuery(() => searchTags(searchText), [searchText]) || []

  const handleOnTagClick = useCallback(
    (clickedTag: Tag) => {
      setSearchText('')

      if (tags.includes(clickedTag)) {
        return setTags(tags.filter((t) => t.id !== clickedTag.id))
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
  const handleEnter = useCallback(async () => {
    // We assume they're sorted by best match
    if (listIndex > -1) {
      handleOnTagClick(filteredTags[listIndex])
      return
    }
    // Make a better UI to add tags ?
    if (allowNew) {
      const dateNow = Date.now()
      const newTagAtIndex = await db.tags.add({
        name: searchText,
        createdAt: dateNow,
        updatedAt: dateNow,
      })
      if (newTagAtIndex) {
        const newTag = await getTagAtIndex(newTagAtIndex)
        if (newTag) {
          handleOnTagClick(newTag)
        }
      }
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
                  {filteredTags.map((tag, index) => {
                    return (
                      <SearchListItem key={tag.id}>
                        <ListItemButton
                          selected={listIndex === index}
                          onClick={() => {
                            handleOnTagClick(tag)
                          }}
                        >
                          <ListItemText primary={tag.name} />
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
