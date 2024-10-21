import { Stack } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { getAllImages } from 'src/db/useDB'

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
      <Stack>Image Gallery</Stack>
      <Stack direction="row" justifyContent="center">
        Pagination
      </Stack>
    </Stack>
  )
}
