import { Button, Stack, TextField } from '@mui/material'
import { ChangeEvent, useMemo } from 'react'

type PaginationPropsType = {
  currentPage: number
  lastPage: number
  onPageChange: (newPage: number) => void
}

export const Pagination = (props: PaginationPropsType) => {
  const { currentPage = 1, lastPage = 1, onPageChange } = props

  const renderFirstPage = useMemo(() => {
    if (lastPage > 1 && currentPage > 1) {
      return (
        <Button
          variant="outlined"
          onClick={() => {
            onPageChange(1)
          }}
        >
          1
        </Button>
      )
    }
    return null
  }, [currentPage, lastPage, onPageChange])

  const renderMiddlePages = useMemo(() => {
    if (lastPage > 1 && currentPage > 0 && currentPage <= lastPage) {
      return (
        <TextField
          value={currentPage}
          type="number"
          size="small"
          onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            try {
              const newNumber = Number(event?.target?.value)
              if (newNumber > 0 && newNumber <= lastPage) {
                onPageChange(newNumber)
              }
            } catch (err) {
              console.error('err: ', err)
            }
          }}
        >
          {currentPage}
        </TextField>
      )
    }
    return null
  }, [currentPage, lastPage, onPageChange])

  const renderLastPage = useMemo(() => {
    if (lastPage > 1 && currentPage < lastPage) {
      return (
        <Button
          variant="outlined"
          onClick={() => {
            onPageChange(lastPage)
          }}
        >
          {lastPage}
        </Button>
      )
    }
    return null
  }, [currentPage, lastPage, onPageChange])

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
      {renderFirstPage}
      {renderMiddlePages}
      {renderLastPage}
    </Stack>
  )
}
