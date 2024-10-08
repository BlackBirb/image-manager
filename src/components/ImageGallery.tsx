import { Stack } from '@mui/material'

export const ImageGallery = () => {
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
