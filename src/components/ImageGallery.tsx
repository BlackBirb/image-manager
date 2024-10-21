import { Box, Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { ImageGridItem } from 'src/components/ImageGridItem'
import { getAllImages, getUserPreferences } from 'src/db/useDB'

export const ImageGallery = () => {
  const content = useLiveQuery(getAllImages)

  console.log('content: ', content)

  return (
    <Stack
      flexGrow={1}
      justifyContent="space-between"
      sx={{
        border: '1px solid red',
      }}
    >
      <Stack>
        {content?.map((item) => {
          return <ImageGridItem key={item.id} id={item.id} ext={item.ext} thumbnail />
        })}
      </Stack>
      <Stack direction="row" justifyContent="center">
        Pagination
      </Stack>
    </Stack>
  )
}
