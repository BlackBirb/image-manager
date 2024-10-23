import { Box, Grid2, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo, useState } from 'react'
import { ImageGridItem } from 'src/components/ImageGridItem'
import { Pagination } from 'src/components/Pagination'
import { getAllImages, getAllImagesCount, getPaginationImages, getUserPreferences } from 'src/db/useDB'

export const ImageGallery = () => {
  const user = useLiveQuery(getUserPreferences)
  const allImagesCount = useLiveQuery(getAllImagesCount)
  const [page, setPage] = useState(1)

  const lastPage = useMemo(() => {
    if (!user) return 1000
    if (!allImagesCount) return 1000
    return Math.ceil(allImagesCount / user?.pagination)
  }, [user, allImagesCount])

  const pageToFilter = useMemo(() => {
    if (!user) return 0
    if (page === 1) return 0
    return (page - 1) * user?.pagination
  }, [page, user])

  const content = useLiveQuery(
    () =>
      getPaginationImages(
        pageToFilter,
        user?.pagination || 50,
        // user?.pagination
      ),
    [pageToFilter],
  )

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
      <Pagination currentPage={page} lastPage={lastPage} onPageChange={setPage} />
    </Stack>
  )
}
