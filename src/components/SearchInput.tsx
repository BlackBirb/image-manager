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
  onClick?: () => void,
  onEnter?: () => void,
  withIcon?: boolean
}

export const SearchInput = forwardRef((props: SearchInputProps, ref: React.ForwardedRef<HTMLDivElement | null>) => {
  const { value, placeholder, onChange, onClick, onEnter, withIcon } = props
  const handleOnChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event?.target?.value)
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(!onEnter) return

    if(event.key === 'Enter') {
      onEnter()
    }
  }, [ onEnter ])

  return (
    <Box ref={ref} onClick={onClick}>
      <SearchInputBox
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={value}
        onChange={handleOnChange}
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
