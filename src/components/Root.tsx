import { Box, Stack } from '@mui/material'
import { TitleBar } from 'src/components/TitleBar'

export const Root = () => {
  return (
    <Stack width="100%" height="100%">
      <TitleBar />
      <Box component="section">Body</Box>
    </Stack>
  )
}
