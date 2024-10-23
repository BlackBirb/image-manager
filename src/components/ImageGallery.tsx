import { Box, Grid2, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { ImageGridItem } from 'src/components/ImageGridItem'
import { Pagination } from 'src/components/Pagination'
import { getAllImagesCount, getPaginationImages, getUserPreferences } from 'src/db/useDB'

export const ImageGallery = () => {
  const preferences = useLiveQuery(getUserPreferences)
  const allImagesCount = useLiveQuery(getAllImagesCount)

  const [page, setPage] = useState(1)
  const lastPage = useMemo(() => {
    if (!preferences) return 1000
    if (!allImagesCount) return 1000
    return Math.ceil(allImagesCount / preferences?.pagination)
  }, [preferences, allImagesCount])

  const pageToFilter = useMemo(() => {
    if (!preferences) return 0
    if (page === 1) return 0
    return (page - 1) * preferences?.pagination
  }, [page, preferences])

  const content = useLiveQuery(
    () => getPaginationImages(pageToFilter, preferences?.pagination || 50),
    [pageToFilter, preferences?.pagination],
  )

  console.log('content: ', content)

  return (
    <Stack flexGrow={1} justifyContent="space-between" spacing={2}>
      {/* TODO add the mosaic grid from the user preferences */}
      <Box sx={{ height: '0px', flex: '1 1 auto', overflow: 'auto' }}>
        <Grid2 container spacing={2} p={2}>
          {content?.map((item) => {
            return (
              <Grid2 key={item.id}>
                <ImageGridItem id={item.id} ext={item.ext} thumbnail />
              </Grid2>
            )
          })}
        </Grid2>
      </Box>
      <Box p={2}>
        <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
      </Box>
    </Stack>
  )
}
