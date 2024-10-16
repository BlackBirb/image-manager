import { Search as SearchIcon } from '@mui/icons-material'
import { Box, IconButton, InputBase, InputBaseProps, styled } from '@mui/material'
import { forwardRef, useCallback } from 'react'

const SearchInputBox = styled(InputBase, {
  name: 'SearchInput',
})<InputBaseProps>(() => ({
  width: '300px',
  zIndex: 2,
}))

type SearchInputProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onClick?: () => void
  onEnter?: () => void
  onFocus?: () => void
  onBlur?: () => void
  onArrowUpDown?: (direction: 'ArrowUp' | 'ArrowDown') => void
  withIcon?: boolean
}

export const SearchInput = forwardRef((props: SearchInputProps, ref: React.ForwardedRef<HTMLDivElement | null>) => {
  const { value, placeholder, onChange, onClick, onEnter, onFocus, onBlur, onArrowUpDown, withIcon } = props

  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(event?.target?.value)
    },
    [onChange],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        if (!onEnter) return
        onEnter()
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        if (!onArrowUpDown) return
        onArrowUpDown(event.key)
      }
    },
    [onEnter, onArrowUpDown],
  )

  return (
    <Box ref={ref} onClick={onClick}>
      <SearchInputBox
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={value}
        onChange={handleOnChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />
      {withIcon && (
        <IconButton type="button" aria-label="search">
          <SearchIcon />
        </IconButton>
      )}
    </Box>
  )
})

SearchInput.displayName = 'SearchInput'
