import { Box, Grid2, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { ImageGridItem } from 'src/components/ImageGridItem'
import { Pagination } from 'src/components/Pagination'
import { getAllImages, getUserPreferences } from 'src/db/useDB'

export const ImageGallery = () => {
  const content = useLiveQuery(getAllImages)

  const [page, setPage] = useState(1)

  console.log('content: ', content)

  return (
    <Stack flexGrow={1} justifyContent="space-between" spacing={2}>
      {/* TODO add the mosaic grid from the user preferences */}
      <Grid2 container spacing={2}>
        {content?.map((item) => {
          return (
            <Grid2 key={item.id}>
              <ImageGridItem id={item.id} ext={item.ext} thumbnail />
            </Grid2>
          )
        })}
      </Grid2>
      <Pagination currentPage={page} lastPage={4} onPageChange={setPage} />
    </Stack>
  )
}
